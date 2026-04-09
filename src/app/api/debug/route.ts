import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "not logged in" });

  const user = await currentUser();
  const role = (user?.publicMetadata as { role?: string })?.role;

  const driver = await prisma.driver.findUnique({ where: { clerkUserId: userId } });

  return NextResponse.json({
    userId,
    role,
    publicMetadata: user?.publicMetadata,
    driverRecordExists: !!driver,
    driverData: driver,
  });
}
