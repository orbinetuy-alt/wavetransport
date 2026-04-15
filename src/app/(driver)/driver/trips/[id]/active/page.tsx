import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { ActiveTripClient } from "./ActiveTripClient";

export default async function ActiveTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const driver = await getOrCreateDriver(userId);
  if (!driver) redirect("/unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { service: { select: { name: true } } },
  });

  if (!booking) redirect("/driver/trips");
  if (booking.driverId !== driver.id) redirect("/driver/trips");
  if (booking.status !== "IN_PROGRESS") redirect("/driver/trips");

  return (
    <ActiveTripClient
      booking={{
        id: booking.id,
        status: booking.status,
        pickupDatetime: booking.pickupDatetime.toISOString(),
        pickupAddress: booking.pickupAddress,
        dropoffAddress: booking.dropoffAddress,
        passengers: booking.passengers,
        clientName: booking.clientName,
        clientPhone: booking.clientPhone ?? null,
        driverAmountCents: booking.driverAmountCents,
        service: booking.service,
        notes: booking.notes ?? null,
      }}
    />
  );
}
