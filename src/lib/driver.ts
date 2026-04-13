import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import type { Driver } from "@prisma/client";

/**
 * Returns the Driver DB record for the given Clerk user.
 * If no record exists yet auto-provisions one with default values.
 * Returns null if the user has the ADMIN role — admins are never drivers.
 */
export async function getOrCreateDriver(clerkUserId: string): Promise<Driver | null> {
  // Fetch Clerk profile once for both role-check and potential create
  const user = await currentUser();
  if (!user || user.id !== clerkUserId) return null;

  // Admins must never get a driver record
  const role = (user.publicMetadata as { role?: string })?.role;
  if (role === "ADMIN") return null;

  const existing = await prisma.driver.findUnique({
    where: { clerkUserId },
  });
  if (existing) return existing;

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || email;

  return prisma.driver.create({
    data: {
      clerkUserId,
      email,
      name,
      commissionPercent: 0,
    },
  });
}
