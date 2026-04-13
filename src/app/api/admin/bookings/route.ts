import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  clientName: z.string().min(1).max(100),
  clientEmail: z.string().email(),
  clientPhone: z.string().max(30).optional().nullable(),
  serviceId: z.string().min(1),
  driverId: z.string().optional().nullable(),
  pickupAddress: z.string().min(1).max(300),
  dropoffAddress: z.string().min(1).max(300),
  pickupDatetime: z.string().min(1),
  passengers: z.number().int().min(1).default(1),
  notes: z.string().max(1000).optional().nullable(),
  grossAmountCents: z.number().int().positive(),
  paymentMethod: z.enum(["CASH", "CARD_PRESENT", "PENDING"]).default("PENDING"),
});

export async function GET(req: NextRequest) {
  await requireRole("ADMIN");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const paymentStatus = searchParams.get("paymentStatus");
  const driverId = searchParams.get("driverId");
  const search = searchParams.get("search");

  const bookings = await prisma.booking.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
      ...(driverId ? { driverId } : {}),
      ...(search
        ? {
            OR: [
              { clientName: { contains: search, mode: "insensitive" } },
              { clientEmail: { contains: search, mode: "insensitive" } },
              { pickupAddress: { contains: search, mode: "insensitive" } },
              { dropoffAddress: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { pickupDatetime: "desc" },
    include: {
      service: { select: { id: true, name: true } },
      driver: { select: { id: true, name: true, email: true } },
      settlement: { select: { id: true, status: true } },
    },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  await requireRole("ADMIN");

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const {
    grossAmountCents,
    driverId,
    paymentMethod,
    pickupDatetime,
    ...rest
  } = parsed.data;

  // Calcular distribución según comisión del chofer si está asignado
  let driverAmountCents = 0;
  let platformFeeCents = grossAmountCents;

  if (driverId) {
    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (driver) {
      const pct = Number(driver.commissionPercent);
      driverAmountCents = Math.round((grossAmountCents * pct) / 100);
      platformFeeCents = grossAmountCents - driverAmountCents;
    }
  }

  // Determinar estado de pago según método
  const paymentStatus =
    paymentMethod === "CASH" || paymentMethod === "CARD_PRESENT" ? "PAID" : "PENDING";

  const booking = await prisma.booking.create({
    data: {
      ...rest,
      driverId: driverId ?? null,
      pickupDatetime: new Date(pickupDatetime),
      grossAmountCents,
      driverAmountCents,
      platformFeeCents,
      stripeFeeCents: 0,
      netAmountCents: platformFeeCents,
      status: "CONFIRMED",
      paymentStatus,
    },
    include: {
      service: { select: { id: true, name: true } },
      driver: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
