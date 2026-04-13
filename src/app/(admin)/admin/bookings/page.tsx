import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BookingsClient } from "./BookingsClient";

export default async function AdminBookingsPage() {
  const [bookings, drivers] = await Promise.all([
    prisma.booking.findMany({
      orderBy: { pickupDatetime: "desc" },
      include: {
        service: { select: { id: true, name: true } },
        driver: { select: { id: true, name: true, email: true } },
        settlement: { select: { id: true, status: true } },
      },
    }),
    prisma.driver.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  return (
    <>
      <AdminHeader
        title="Reservas"
        subtitle="Gestiona reservas, asigna choferes y cambia estados"
      />
      <div className="p-8">
        <BookingsClient bookings={bookings as any} drivers={drivers} />
      </div>
    </>
  );
}
