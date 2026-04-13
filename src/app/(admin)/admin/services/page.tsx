import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ServicesClient } from "./ServicesClient";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { bookings: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Servicios"
        subtitle="Gestiona los servicios disponibles para reservar"
      />
      <div className="p-8">
        <ServicesClient services={services as any} />
      </div>
    </>
  );
}
