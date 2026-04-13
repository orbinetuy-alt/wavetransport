import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  await requireRole("ADMIN");

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const driverId = searchParams.get("driverId");

  const [settlements, stats] = await Promise.all([
    prisma.settlement.findMany({
      where: {
        ...(status && status !== "ALL" ? { status: status as any } : {}),
        ...(driverId ? { driverId } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            id: true,
            clientName: true,
            pickupDatetime: true,
            paymentStatus: true,
            service: { select: { name: true } },
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
            email: true,
            stripeAccountId: true,
            stripeChargesEnabled: true,
          },
        },
      },
    }),
    prisma.settlement.groupBy({
      by: ["status"],
      _sum: { driverAmountCents: true },
      _count: { id: true },
    }),
  ]);

  return NextResponse.json({ settlements, stats });
}

// POST — genera liquidaciones para todos los viajes COMPLETED sin liquidación
export async function POST() {
  await requireRole("ADMIN");

  const eligible = await prisma.booking.findMany({
    where: {
      status: "COMPLETED",
      driverId: { not: null },
      settlement: null,
    },
  });

  if (eligible.length === 0) {
    return NextResponse.json({ created: 0 });
  }

  const results = await prisma.$transaction(
    eligible.map((b) =>
      prisma.settlement.create({
        data: {
          bookingId: b.id,
          driverId: b.driverId!,
          grossAmountCents: b.grossAmountCents,
          platformFeeCents: b.platformFeeCents,
          driverAmountCents: b.driverAmountCents,
          stripeFeeCents: b.stripeFeeCents,
          status: "PENDING",
        },
      })
    )
  );

  return NextResponse.json({ created: results.length });
}
