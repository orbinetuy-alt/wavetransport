import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Car, MapPin, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function DriverTripsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const driver = await getOrCreateDriver(userId);
  if (!driver) redirect("/unauthorized");

  const bookings = await prisma.booking.findMany({
    where: { driverId: driver.id },
    orderBy: { pickupDatetime: "desc" },
    include: { service: true },
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
          <ul className="space-y-3">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-xl border p-4 transition-colors hover:bg-white/[0.02]"
                style={{
                  backgroundColor: "var(--color-surface-card)",
                  borderColor: "var(--color-surface-border)",
                }}
              >
                {/* Cabecera: fecha + estado + importe */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color: "var(--color-text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {format(new Date(booking.pickupDatetime), "dd MMM yyyy · HH:mm", { locale: es })}
                    </span>
                  </div>
                  <StatusBadge status={booking.status.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]} />
                </div>

                {/* Ruta */}
                <div className="flex flex-col gap-1.5 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-brand-400)" }} />
                    <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {booking.pickupAddress}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
                    <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                      {booking.dropoffAddress}
                    </span>
                  </div>
                </div>

                {/* Footer: servicio + pasajeros + ganancia */}
                <div className="flex items-center justify-between pt-3 border-t"
                  style={{ borderColor: "var(--color-surface-border)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-secondary)" }}>
                      {booking.service.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <Users size={12} style={{ color: "var(--color-text-muted)" }} />
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {booking.passengers}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {formatEuros(booking.driverAmountCents)}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      tu ganancia
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
