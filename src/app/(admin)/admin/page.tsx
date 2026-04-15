import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  TrendingUp,
  Car,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

async function getDashboardStats() {
  const [
    totalBookings,
    pendingBookings,
    completedBookings,
    activeDrivers,
    recentBookings,
    totalRevenueCents,
    pendingSettlementsCents,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.driver.count({ where: { isActive: true } }),
    prisma.booking.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { service: true, driver: true },
    }),
    prisma.booking.aggregate({
      _sum: { grossAmountCents: true },
      where: { paymentStatus: "PAID" },
    }),
    prisma.settlement.aggregate({
      _sum: { driverAmountCents: true },
      where: { status: "AVAILABLE" },
    }),
  ]);

  return {
    totalBookings,
    pendingBookings,
    completedBookings,
    activeDrivers,
    recentBookings,
    totalRevenueCents: totalRevenueCents._sum.grossAmountCents ?? 0,
    pendingSettlementsCents: pendingSettlementsCents._sum.driverAmountCents ?? 0,
  };
}

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle={format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
      />

      <div className="p-8 space-y-8">
        {/* ── Métricas ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Ingresos totales"
            value={formatEuros(stats.totalRevenueCents)}
            subtitle="Viajes cobrados"
            icon={TrendingUp}
            accentColor="var(--color-brand-500)"
          />
          <StatCard
            title="Total de reservas"
            value={stats.totalBookings.toString()}
            subtitle={`${stats.completedBookings} completadas`}
            icon={Car}
            accentColor="var(--color-success)"
          />
          <StatCard
            title="Choferes activos"
            value={stats.activeDrivers.toString()}
            subtitle="En la plataforma"
            icon={Users}
            accentColor="var(--color-info)"
          />
          <StatCard
            title="Liquidaciones pendientes"
            value={formatEuros(stats.pendingSettlementsCents)}
            subtitle="Por transferir a choferes"
            icon={CreditCard}
            accentColor="var(--color-warning)"
          />
        </div>

        {/* ── Reservas recientes ── */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface-card)",
            borderColor: "var(--color-surface-border)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "var(--color-surface-border)" }}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} style={{ color: "var(--color-brand-400)" }} />
              <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Reservas recientes
              </h2>
            </div>
            {stats.pendingBookings > 0 && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: "var(--color-warning)22",
                  color: "var(--color-warning)",
                }}
              >
                {stats.pendingBookings} pendientes
              </span>
            )}
          </div>

          {stats.recentBookings.length === 0 ? (
            <div className="py-16 text-center">
              <Car size={32} className="mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>No hay reservas todavía</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid var(--color-surface-border)` }}>
                    {["Cliente", "Servicio", "Chofer", "Fecha", "Importe", "Estado"].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentBookings.map((booking, i) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-brand-50"
                      style={{
                        borderBottom:
                          i < stats.recentBookings.length - 1
                            ? `1px solid var(--color-surface-border)`
                            : "none",
                      }}
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {booking.clientName}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                          {booking.clientEmail}
                        </p>
                      </td>
                      <td className="px-6 py-4" style={{ color: "var(--color-text-secondary)" }}>
                        {booking.service.name}
                      </td>
                      <td className="px-6 py-4" style={{ color: "var(--color-text-secondary)" }}>
                        {booking.driver?.name ?? (
                          <span style={{ color: "var(--color-text-muted)" }}>Sin asignar</span>
                        )}
                      </td>
                      <td className="px-6 py-4" style={{ color: "var(--color-text-secondary)" }}>
                        {format(new Date(booking.pickupDatetime), "dd MMM, HH:mm", { locale: es })}
                      </td>
                      <td className="px-6 py-4 font-medium" style={{ color: "var(--color-text-primary)" }}>
                        {formatEuros(booking.grossAmountCents)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={booking.status.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
