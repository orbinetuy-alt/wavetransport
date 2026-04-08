import { NextRequest, NextResponse } from "next/server";
import { stripe, calculateTripDistribution } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// ─────────────────────────────────────────────
// POST /api/stripe/checkout
// Crea una Stripe Checkout Session para reservar un viaje
// ─────────────────────────────────────────────

const checkoutSchema = z.object({
  serviceId: z.string().min(1),
  pickupAddress: z.string().min(1),
  dropoffAddress: z.string().min(1),
  pickupDatetime: z.string().datetime(),
  passengers: z.number().int().min(1).max(20),
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  notes: z.string().optional(),
  driverId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const service = await prisma.service.findUnique({
    where: { id: data.serviceId, isActive: true },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  // Resolver chofer (si aplica) y su % de comisión
  let driver = null;
  let commissionPercent = 0;

  if (data.driverId) {
    driver = await prisma.driver.findUnique({
      where: { id: data.driverId, isActive: true },
    });
    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }
    commissionPercent = Number(driver.commissionPercent);
  }

  const grossAmountCents = Number(service.basePrice) * 100;
  const distribution = calculateTripDistribution({ grossAmountCents, commissionPercent });

  // Crear booking en estado PENDING
  const booking = await prisma.booking.create({
    data: {
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientPhone: data.clientPhone,
      serviceId: data.serviceId,
      driverId: data.driverId ?? null,
      pickupAddress: data.pickupAddress,
      dropoffAddress: data.dropoffAddress,
      pickupDatetime: new Date(data.pickupDatetime),
      passengers: data.passengers,
      notes: data.notes,
      ...distribution,
      status: "PENDING",
      paymentStatus: "PENDING",
    },
  });

  // Crear Checkout Session con application_fee para capturar comisión plataforma
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: data.clientEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: grossAmountCents,
          product_data: {
            name: service.name,
            description: `${data.pickupAddress} → ${data.dropoffAddress}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?bookingId=${booking.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cancel?bookingId=${booking.id}`,
  });

  // Guardar session ID
  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeCheckoutSessionId: session.id },
  });

  return NextResponse.json({ url: session.url, bookingId: booking.id });
}
