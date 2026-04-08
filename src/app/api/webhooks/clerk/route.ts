import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// Webhook de Clerk — sincroniza usuarios con la DB
// Eventos: user.created, user.updated, user.deleted
// ─────────────────────────────────────────────

type ClerkUserEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    primary_email_address_id: string;
    first_name: string | null;
    last_name: string | null;
    phone_numbers: { phone_number: string }[];
    public_metadata: { role?: "ADMIN" | "DRIVER" | "CLIENT" };
  };
};

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing CLERK_WEBHOOK_SECRET" }, { status: 500 });
  }

  // Verificar firma de Clerk via svix
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(webhookSecret);

  let event: ClerkUserEvent;
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { type, data } = event;

  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  )?.email_address ?? "";

  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Sin nombre";
  const phone = data.phone_numbers?.[0]?.phone_number ?? null;
  const role = data.public_metadata?.role ?? "CLIENT";

  switch (type) {
    case "user.created": {
      // Si el rol es DRIVER, crear registro en tabla drivers
      if (role === "DRIVER") {
        await prisma.driver.upsert({
          where: { clerkUserId: data.id },
          create: {
            clerkUserId: data.id,
            email: primaryEmail,
            name,
            phone,
            commissionPercent: 0, // Admin debe configurarlo después
          },
          update: {},
        });
      }
      break;
    }

    case "user.updated": {
      // Actualizar datos del chofer si existe
      const driver = await prisma.driver.findUnique({
        where: { clerkUserId: data.id },
      });

      if (driver) {
        await prisma.driver.update({
          where: { clerkUserId: data.id },
          data: { email: primaryEmail, name, phone },
        });
      }

      // Si ahora tiene rol DRIVER y no existía en la DB, crearlo
      if (role === "DRIVER" && !driver) {
        await prisma.driver.create({
          data: {
            clerkUserId: data.id,
            email: primaryEmail,
            name,
            phone,
            commissionPercent: 0,
          },
        });
      }
      break;
    }

    case "user.deleted": {
      // Desactivar chofer (no borramos para preservar historial)
      await prisma.driver.updateMany({
        where: { clerkUserId: data.id },
        data: { isActive: false },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
