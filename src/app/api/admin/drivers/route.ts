import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  await requireRole("ADMIN");

  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true, settlements: true } },
    },
  });

  return NextResponse.json(drivers);
}
