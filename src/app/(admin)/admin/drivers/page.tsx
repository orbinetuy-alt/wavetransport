import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DriversClient } from "./DriversClient";

export default async function AdminDriversPage() {
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true, settlements: true } },
    },
  });

  return (
    <>
      <AdminHeader
        title="Choferes"
        subtitle="Gestiona el equipo, comisiones y estado de Stripe Connect"
      />
      <div className="p-8">
        <DriversClient drivers={drivers as any} />
      </div>
    </>
  );
}
