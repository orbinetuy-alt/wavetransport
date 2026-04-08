import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

// ─────────────────────────────────────────────
// Webhook de Stripe — maneja todos los eventos financieros
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing stripe signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotencia: evitar procesar el mismo evento dos veces
  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { stripeId: event.id },
  });
  if (existing?.processed) {
    return NextResponse.json({ received: true, skipped: true });
  }

  // Registrar evento antes de procesarlo
  await prisma.stripeWebhookEvent.upsert({
    where: { stripeId: event.id },
    create: {
      stripeId: event.id,
      type: event.type,
      payload: JSON.parse(JSON.stringify(event)),
      processed: false,
    },
    update: {},
  });

  try {
    await handleStripeEvent(event);

    await prisma.stripeWebhookEvent.update({
      where: { stripeId: event.id },
      data: { processed: true },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error processing event ${event.type}:`, errorMessage);

    await prisma.stripeWebhookEvent.update({
      where: { stripeId: event.id },
      data: { error: errorMessage },
    });

    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }

    case "payment_intent.succeeded": {
      const intent = event.data.object as Stripe.PaymentIntent;
      await handlePaymentSucceeded(intent);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      await handleChargeRefunded(charge);
      break;
    }

    case "charge.dispute.created": {
      const dispute = event.data.object as Stripe.Dispute;
      await handleDisputeCreated(dispute);
      break;
    }

    case "transfer.created": {
      const transfer = event.data.object as Stripe.Transfer;
      await handleTransferCreated(transfer);
      break;
    }

    case "payout.paid": {
      const payout = event.data.object as Stripe.Payout;
      await handlePayoutPaid(payout);
      break;
    }

    // Onboarding Connect
    case "account.updated": {
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account);
      break;
    }

    default:
      // Evento no manejado — se registra pero no falla
      break;
  }
}

// ─────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const bookingId = session.metadata?.bookingId;
  if (!bookingId) return;

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    },
  });
}

async function handlePaymentSucceeded(intent: Stripe.PaymentIntent) {
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: intent.id },
    include: { driver: true },
  });

  if (!booking || !booking.driverId) return;

  // Calcular Stripe fee desde los charges (disponible en intent.charges)
  const stripeFeeCents = intent.application_fee_amount ?? 0;

  // Actualizar settlement con fee real de Stripe
  await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: "PAID",
        stripeFeeCents,
        netAmountCents: booking.platformFeeCents - stripeFeeCents,
      },
    }),
    prisma.settlement.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        driverId: booking.driverId,
        grossAmountCents: booking.grossAmountCents,
        platformFeeCents: booking.platformFeeCents,
        driverAmountCents: booking.driverAmountCents,
        stripeFeeCents,
        status: "AVAILABLE",
      },
      update: { stripeFeeCents, status: "AVAILABLE" },
    }),
  ]);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: charge.payment_intent as string },
  });
  if (!booking) return;

  const isFullRefund = charge.amount_refunded === charge.amount;

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: isFullRefund ? "REFUNDED" : "PARTIALLY_REFUNDED",
        status: isFullRefund ? "CANCELLED" : booking.status,
      },
    }),
    prisma.settlement.updateMany({
      where: { bookingId: booking.id },
      data: { status: "ON_HOLD" },
    }),
  ]);
}

async function handleDisputeCreated(dispute: Stripe.Dispute) {
  const booking = await prisma.booking.findUnique({
    where: { stripePaymentIntentId: dispute.payment_intent as string },
  });
  if (!booking) return;

  await prisma.$transaction([
    prisma.booking.update({
      where: { id: booking.id },
      data: { paymentStatus: "DISPUTED" },
    }),
    prisma.settlement.updateMany({
      where: { bookingId: booking.id },
      data: { status: "ON_HOLD" },
    }),
  ]);
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  const settlementId = transfer.metadata?.settlementId;
  if (!settlementId) return;

  await prisma.settlement.update({
    where: { id: settlementId },
    data: {
      stripeTransferId: transfer.id,
      status: "TRANSFERRED",
    },
  });
}

async function handlePayoutPaid(payout: Stripe.Payout) {
  const payoutId = payout.metadata?.internalPayoutId;
  if (!payoutId) return;

  await prisma.payout.update({
    where: { id: payoutId },
    data: {
      stripePayoutId: payout.id,
      status: "PAID_OUT",
    },
  });

  // Marcar todos los settlements de este payout como PAID_OUT
  await prisma.settlement.updateMany({
    where: { payoutId },
    data: { status: "PAID_OUT" },
  });
}

async function handleAccountUpdated(account: Stripe.Account) {
  await prisma.driver.updateMany({
    where: { stripeAccountId: account.id },
    data: {
      stripePayoutsEnabled: account.payouts_enabled ?? false,
      stripeChargesEnabled: account.charges_enabled ?? false,
      stripeOnboardingDone: account.details_submitted ?? false,
    },
  });
}
