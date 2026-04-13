import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  basePrice: z.number().positive(),
  currency: z.string().length(3).default("eur"),
  isActive: z.boolean().default(true),
});

export async function GET() {
  await requireRole("ADMIN");

  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  await requireRole("ADMIN");

  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { basePrice, ...rest } = parsed.data;

  const service = await prisma.service.create({
    data: { ...rest, basePrice },
  });

  return NextResponse.json(service, { status: 201 });
}
