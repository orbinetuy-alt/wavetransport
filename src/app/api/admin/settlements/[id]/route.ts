import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const patchSchema = z.object({
  action: z.enum([
    "mark_available",   // PENDING → AVAILABLE
    "transfer",         // AVAILABLE → TRANSFERRED (Stripe transfer si tiene cuenta)
    "mark_transferred", // AVAILABLE → TRANSFERRED (manual, sin Stripe)
    "mark_paid",        // TRANSFERRED → PAID_OUT
    "reconcile",        // PAID_OUT → RECONCILED
    "hold",             // cualquier → ON_HOLD
  ]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("ADMIN");

  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { action } = parsed.data;

  const settlement = await prisma.settlement.findUnique({
    where: { id },
    include: {
      driver: {
        select: {
          id: true,
          name: true,
          stripeAccountId: true,
          stripeChargesEnabled: true,
        },
      },
    },
  });

  if (!settlement) {
    return NextResponse.json({ error: "Settlement no encontrado" }, { status: 404 });
  }

  // ── Validar transiciones de estado ──
  const validTransitions: Record<string, string[]> = {
    mark_available: ["PENDING"],
    transfer: ["AVAILABLE"],
    mark_transferred: ["AVAILABLE"],
    mark_paid: ["TRANSFERRED"],
    reconcile: ["PAID_OUT"],
    hold: ["PENDING", "AVAILABLE", "TRANSFERRED"],
  };

  if (!validTransitions[action]?.includes(settlement.status)) {
    return NextResponse.json(
      { error: `No se puede ejecutar '${action}' desde el estado '${settlement.status}'` },
      { status: 422 }
    );
  }

  // ── Acción: transferencia vía Stripe ──
  if (action === "transfer") {
    const driver = settlement.driver;
    if (!driver.stripeAccountId || !driver.stripeChargesEnabled) {
      return NextResponse.json(
        { error: "El chofer no tiene cuenta Stripe activa. Usa 'Marcar transferida' manualmente." },
        { status: 422 }
      );
    }

    let stripeTransferId: string;
    try {
      const transfer = await stripe.transfers.create({
        amount: settlement.driverAmountCents,
        currency: "eur",
        destination: driver.stripeAccountId,
        metadata: {
          settlementId: settlement.id,
          bookingId: settlement.bookingId,
          driverId: settlement.driverId,
        },
      });
      stripeTransferId = transfer.id;
    } catch (err: any) {
      return NextResponse.json(
        { error: `Error Stripe: ${err?.message ?? "desconocido"}` },
        { status: 502 }
      );
    }

    const updated = await prisma.settlement.update({
      where: { id },
      data: { status: "TRANSFERRED", stripeTransferId },
      include: {
        booking: { select: { id: true, clientName: true, pickupDatetime: true, paymentStatus: true, service: { select: { name: true } } } },
        driver: { select: { id: true, name: true, email: true, stripeAccountId: true, stripeChargesEnabled: true } },
      },
    });

    return NextResponse.json(updated);
  }

  // ── Resto de acciones: solo cambio de estado ──
  const statusMap: Record<string, string> = {
    mark_available: "AVAILABLE",
    mark_transferred: "TRANSFERRED",
    mark_paid: "PAID_OUT",
    reconcile: "RECONCILED",
    hold: "ON_HOLD",
  };

  const updated = await prisma.settlement.update({
    where: { id },
    data: { status: statusMap[action] as any },
    include: {
      booking: { select: { id: true, clientName: true, pickupDatetime: true, paymentStatus: true, service: { select: { name: true } } } },
      driver: { select: { id: true, name: true, email: true, stripeAccountId: true, stripeChargesEnabled: true } },
    },
  });

  return NextResponse.json(updated);
}
