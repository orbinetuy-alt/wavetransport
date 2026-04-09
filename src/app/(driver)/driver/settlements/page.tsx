import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CreditCard, ArrowDownToLine } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function DriverSettlementsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const driver = await getOrCreateDriver(userId);
  if (!driver) redirect("/unauthorized");

  const [settlements, payouts] = await Promise.all([
    prisma.settlement.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: "desc" },
      include: { booking: { include: { service: true } } },
    }),
    prisma.payout.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const availableCents = settlements
    .filter((s) => s.status === "AVAILABLE")
    .reduce((acc, s) => acc + s.driverAmountCents, 0);

  const paidCents = settlements
    .filter((s) => ["TRANSFERRED", "PAID_OUT", "RECONCILED"].includes(s.status))
    .reduce((acc, s) => acc + s.driverAmountCents, 0);

  return (
    <>
      <DriverHeader title="Liquidaciones" subtitle="Historial de tus pagos" />

      <div className="px-4 lg:px-8 py-6 space-y-6">

        {/* ── Resumen ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 border"
            style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--color-warning)22" }}>
              <CreditCard size={16} style={{ color: "var(--color-warning)" }} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {formatEuros(availableCents)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Pendiente de cobro</p>
          </div>
          <div className="rounded-xl p-4 border"
            style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: "var(--color-success)22" }}>
              <ArrowDownToLine size={16} style={{ color: "var(--color-success)" }} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {formatEuros(paidCents)}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>Total cobrado</p>
          </div>
        </div>

        {/* ── Cortes (Payouts) ── */}
        {payouts.length > 0 && (
          <div className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
            <div className="px-4 lg:px-6 py-4 border-b" style={{ borderColor: "var(--color-surface-border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                Cortes de pago
              </h2>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
              {payouts.map((payout) => (
                <li key={payout.id} className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {format(new Date(payout.periodStart), "d MMM", { locale: es })}
                      {" — "}
                      {format(new Date(payout.periodEnd), "d MMM yyyy", { locale: es })}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      Corte semanal
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                      {formatEuros(payout.totalAmountCents)}
                    </span>
                    <StatusBadge status={payout.status.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Detalle por viaje ── */}
        <div className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div className="px-4 lg:px-6 py-4 border-b" style={{ borderColor: "var(--color-surface-border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Detalle por viaje
            </h2>
          </div>

          {settlements.length === 0 ? (
            <div className="py-12 text-center">
              <CreditCard size={28} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                No hay liquidaciones todavía
              </p>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
              {settlements.map((s) => (
                <li key={s.id} className="px-4 lg:px-6 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>
                        {s.booking.service.name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        {format(new Date(s.booking.pickupDatetime), "dd MMM yyyy", { locale: es })}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-sm font-bold" style={{ color: "var(--color-text-primary)" }}>
                        {formatEuros(s.driverAmountCents)}
                      </span>
                      <StatusBadge status={s.status.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]} />
                    </div>
                  </div>

                  {/* Desglose financiero */}
                  <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2"
                    style={{ borderColor: "var(--color-surface-border)" }}>
                    {[
                      { label: "Bruto", value: formatEuros(s.grossAmountCents) },
                      { label: "Comisión empresa", value: formatEuros(s.platformFeeCents) },
                      { label: "Tu parte", value: formatEuros(s.driverAmountCents) },
                    ].map((item) => (
                      <div key={item.label}>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.label}</p>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
