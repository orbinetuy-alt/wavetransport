import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TrendingUp, Car, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

async function getDriverData(clerkUserId: string) {
  const driver = await getOrCreateDriver(clerkUserId);
  if (!driver) return null;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalEarnings,
    weekEarnings,
    totalTrips,
    pendingTrips,
    recentBookings,
    pendingSettlements,
  ] = await Promise.all([
    prisma.settlement.aggregate({
      _sum: { driverAmountCents: true },
      where: { driverId: driver.id, status: { in: ["TRANSFERRED", "PAID_OUT", "RECONCILED"] } },
    }),
    prisma.settlement.aggregate({
      _sum: { driverAmountCents: true },
      where: {
        driverId: driver.id,
        createdAt: { gte: startOfWeek },
      },
    }),
    prisma.booking.count({
      where: { driverId: driver.id, status: "COMPLETED" },
    }),
    prisma.booking.count({
      where: { driverId: driver.id, status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
    }),
    prisma.booking.findMany({
      where: { driverId: driver.id },
      take: 6,
      orderBy: { pickupDatetime: "desc" },
      include: { service: true },
    }),
    prisma.settlement.aggregate({
      _sum: { driverAmountCents: true },
      where: { driverId: driver.id, status: "AVAILABLE" },
    }),
  ]);

  return {
    driver,
    totalEarnings: totalEarnings._sum.driverAmountCents ?? 0,
    weekEarnings: weekEarnings._sum.driverAmountCents ?? 0,
    totalTrips,
    pendingTrips,
    recentBookings,
    pendingSettlements: pendingSettlements._sum.driverAmountCents ?? 0,
  };
}

export default async function DriverDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await getDriverData(userId);
  if (!data) redirect("/unauthorized");

  const { driver, totalEarnings, weekEarnings, totalTrips, pendingTrips, recentBookings, pendingSettlements } = data;

  return (
    <>
      <DriverHeader
        title={`Hola, ${driver.name.split(" ")[0]} 👋`}
        subtitle={format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
      />

      <div className="px-4 lg:px-8 py-6 space-y-6">

        {/* ── Ganancia pendiente destacada ── */}
        {pendingSettlements > 0 && (
          <div
            className="rounded-2xl p-5 border"
            style={{
              background: "linear-gradient(135deg, var(--color-brand-900) 0%, var(--color-brand-800) 100%)",
              borderColor: "var(--color-brand-700)",
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-1"
              style={{ color: "var(--color-brand-300)" }}>
              Disponible para cobrar
            </p>
            <p className="text-4xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {formatEuros(pendingSettlements)}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--color-brand-300)" }}>
              Se transferirá en el próximo corte semanal
            </p>
          </div>
        )}

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Esta semana",
              value: formatEuros(weekEarnings),
              icon: TrendingUp,
              color: "var(--color-brand-500)",
            },
            {
              label: "Total cobrado",
              value: formatEuros(totalEarnings),
              icon: CheckCircle,
              color: "var(--color-success)",
            },
            {
              label: "Viajes completados",
              value: totalTrips.toString(),
              icon: Car,
              color: "var(--color-info)",
            },
            {
              label: "Próximos viajes",
              value: pendingTrips.toString(),
              icon: Clock,
              color: "var(--color-warning)",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: "var(--color-surface-card)",
                  borderColor: "var(--color-surface-border)",
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.color + "22" }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p className="text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>
                  {stat.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Viajes recientes ── */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface-card)",
            borderColor: "var(--color-surface-border)",
          }}
        >
          <div className="px-4 lg:px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--color-surface-border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Últimos viajes
            </h2>
          </div>

          {recentBookings.length === 0 ? (
            <div className="py-12 text-center">
              <Car size={28} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                Todavía no tenés viajes asignados
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
              {recentBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4 hover:bg-brand-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                      {booking.pickupAddress}
                      <span className="mx-2" style={{ color: "var(--color-text-muted)" }}>→</span>
                      {booking.dropoffAddress}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {format(new Date(booking.pickupDatetime), "dd MMM · HH:mm", { locale: es })}
                      {" · "}
                      {booking.service.name}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                      {formatEuros(booking.driverAmountCents)}
                    </span>
                    <StatusBadge
                      status={booking.status.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Aviso onboarding Stripe ── */}
        {!driver.stripeOnboardingDone && (
          <div
            className="rounded-xl p-4 border flex items-start gap-3"
            style={{
              backgroundColor: "var(--color-warning)11",
              borderColor: "var(--color-warning)44",
            }}
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
                Configurá tu cuenta de cobro
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Para recibir pagos necesitás completar la verificación de Stripe.
              </p>
              <a
                href="/driver/settings"
                className="inline-block mt-2 text-xs font-medium underline"
                style={{ color: "var(--color-warning)" }}
              >
                Ir a Mi cuenta →
              </a>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
