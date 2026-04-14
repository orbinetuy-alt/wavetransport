import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendTripAssignedEmail, sendTripUnassignedEmail } from "@/lib/email";

const updateSchema = z.object({
  status: z
    .enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"])
    .optional(),
  driverId: z.string().nullable().optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("ADMIN");
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      driver: true,
      settlement: true,
    },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("ADMIN");
  const { id } = await params;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Fetch booking before update to detect driver changes
  const previous = await prisma.booking.findUnique({
    where: { id },
    select: {
      driverId: true,
      driver: { select: { name: true, email: true } },
      pickupDatetime: true,
      pickupAddress: true,
    },
  });

  const booking = await prisma.booking.update({
    where: { id },
    data: parsed.data,
    include: {
      service: { select: { name: true } },
      driver: { select: { id: true, name: true, email: true } },
    },
  });

  // ── Notificaciones por email al cambiar chofer ──
  const driverChanged = "driverId" in parsed.data && parsed.data.driverId !== previous?.driverId;
  if (driverChanged) {
    // Nuevo chofer asignado
    if (booking.driver) {
      sendTripAssignedEmail({
        driverName: booking.driver.name,
        driverEmail: booking.driver.email,
        clientName: booking.clientName,
        serviceName: booking.service.name,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        pickupDatetime: booking.pickupDatetime.toISOString(),
        passengers: booking.passengers,
        driverAmountCents: booking.driverAmountCents,
        notes: booking.notes,
      }).catch(console.error);
    }
    // Chofer anterior desasignado
    if (previous?.driver && previous.driverId !== parsed.data.driverId) {
      sendTripUnassignedEmail({
        driverName: previous.driver.name,
        driverEmail: previous.driver.email,
        pickupDatetime: previous.pickupDatetime.toISOString(),
        pickupAddress: previous.pickupAddress,
      }).catch(console.error);
    }
  }

  return NextResponse.json(booking);
}
