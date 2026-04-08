import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// ─────────────────────────────────────────────
// POST /api/stripe/onboard
// Genera el link de onboarding de Stripe Connect Express para un chofer
// ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const driver = await prisma.driver.findUnique({
    where: { clerkUserId: userId },
  });

  if (!driver) return NextResponse.json({ error: "Driver not found" }, { status: 404 });

  let stripeAccountId = driver.stripeAccountId;

  // Crear cuenta Express si no existe
  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "PT",
      email: driver.email,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: { driverId: driver.id },
    });

    stripeAccountId = account.id;

    await prisma.driver.update({
      where: { id: driver.id },
      data: { stripeAccountId },
    });
  }

  // Generar link de onboarding
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/driver/settings?onboarding=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/driver/settings?onboarding=complete`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
