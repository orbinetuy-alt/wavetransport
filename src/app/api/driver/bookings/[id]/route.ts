import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { getCurrentUserRole } from "@/lib/auth";
import { z } from "zod";
import { sendTripRejectedByDriverEmail } from "@/lib/email";

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("respond"),
    driverResponse: z.enum(["ACCEPTED", "REJECTED"]),
  }),
  z.object({
    action: z.literal("status"),
    status: z.enum(["IN_PROGRESS", "COMPLETED"]),
  }),
]);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = await getCurrentUserRole();
  if (role !== "DRIVER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const driver = await getOrCreateDriver(userId);
  if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 403 });

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: { select: { name: true } } },
  });

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.driverId !== driver.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // ── Responder al viaje (aceptar / rechazar) ──
  if (parsed.data.action === "respond") {
    // Accept null as PENDING (bookings assigned before the driverResponse field was added)
    if (booking.driverResponse !== "PENDING" && booking.driverResponse !== null) {
      return NextResponse.json(
        { error: "Ya respondiste a este viaje" },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { driverResponse: parsed.data.driverResponse },
    });

    if (parsed.data.driverResponse === "REJECTED") {
      sendTripRejectedByDriverEmail({
        driverName: driver.name,
        bookingId: id,
        clientName: booking.clientName,
        serviceName: booking.service.name,
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        pickupDatetime: booking.pickupDatetime.toISOString(),
      }).catch(console.error);
    }

    return NextResponse.json(updated);
  }

  // ── Actualizar estado del viaje (iniciar / completar) ──
  if (parsed.data.action === "status") {
    if (booking.driverResponse !== "ACCEPTED") {
      return NextResponse.json(
        { error: "Debes aceptar el viaje antes de iniciar" },
        { status: 409 }
      );
    }
    if (parsed.data.status === "IN_PROGRESS" && booking.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "El viaje debe estar Confirmado para iniciarlo" },
        { status: 409 }
      );
    }
    if (parsed.data.status === "COMPLETED" && booking.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "El viaje debe estar En curso para completarlo" },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: parsed.data.status },
    });

    return NextResponse.json(updated);
  }
}
