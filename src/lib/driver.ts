import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { Driver } from "@prisma/client";

/**
 * Returns the Driver DB record for the given Clerk user.
 * If no record exists yet (e.g. the Clerk webhook hasn't fired),
 * auto-provisions one with default values so the driver can log in.
 * The admin can later configure commissionPercent and other settings.
 */
export async function getOrCreateDriver(clerkUserId: string): Promise<Driver | null> {
  const existing = await prisma.driver.findUnique({
    where: { clerkUserId },
  });
  if (existing) return existing;

  // Fetch profile from Clerk to populate name/email
  const user = await currentUser();
  if (!user || user.id !== clerkUserId) return null;

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;

  return prisma.driver.create({
    data: {
      clerkUserId,
      email,
      name,
      commissionPercent: 0, // Admin configures this later
    },
  });
}
