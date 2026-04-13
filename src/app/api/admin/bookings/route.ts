import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
