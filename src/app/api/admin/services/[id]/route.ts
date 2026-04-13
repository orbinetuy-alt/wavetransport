import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  basePrice: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  isActive: z.boolean().optional(),
});

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

  const service = await prisma.service.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(service);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("ADMIN");
  const { id } = await params;

  // Solo permite borrar si no tiene reservas asociadas
  const bookingCount = await prisma.booking.count({ where: { serviceId: id } });
  if (bookingCount > 0) {
    return NextResponse.json(
      { error: "No se puede eliminar un servicio con reservas. Desactívalo en su lugar." },
      { status: 409 }
    );
  }

  await prisma.service.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
