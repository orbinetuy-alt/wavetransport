import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { Car } from "lucide-react";
import { TripsClient } from "./TripsClient";

export default async function DriverTripsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const driver = await getOrCreateDriver(userId);
  if (!driver) redirect("/unauthorized");

  const bookings = await prisma.booking.findMany({
    where: { driverId: driver.id },
    orderBy: { pickupDatetime: "desc" },
    include: { service: { select: { name: true } } },
  });

  return (
    <>
      <DriverHeader title="Mis viajes" subtitle={`${bookings.length} viajes en total`} />

      <div className="px-4 lg:px-8 py-6">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Car size={40} className="mb-3" style={{ color: "var(--color-text-muted)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>No tenés viajes asignados todavía</p>
          </div>
        ) : (
          <TripsClient bookings={bookings.map((b) => ({
            id: b.id,
            status: b.status,
            driverResponse: b.driverResponse as "PENDING" | "ACCEPTED" | "REJECTED" | null,
            pickupDatetime: b.pickupDatetime.toISOString(),
            pickupAddress: b.pickupAddress,
            dropoffAddress: b.dropoffAddress,
            passengers: b.passengers,
            driverAmountCents: b.driverAmountCents,
            service: b.service,
          }))} />
        )}
      </div>
    </>
  );
}
