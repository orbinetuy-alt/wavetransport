import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  CreditCard, Users, BookOpen, Layers, ExternalLink,
  CheckCircle, XCircle, AlertCircle, DollarSign, Activity,
} from "lucide-react";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export default async function AdminSettingsPage() {
  // ── Stats de plataforma ──
  const [
    driverCount,
    activeDrivers,
    serviceCount,
    bookingStats,
    settlementStats,
    stripeBalance,
  ] = await Promise.all([
    prisma.driver.count(),
    prisma.driver.count({ where: { isActive: true } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.booking.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { grossAmountCents: true },
    }),
    prisma.settlement.groupBy({
      by: ["status"],
      _count: { id: true },
      _sum: { driverAmountCents: true },
    }),
    stripe.balance.retrieve().catch(() => null),
  ]);

  const totalBookings = bookingStats.reduce((a, b) => a + b._count.id, 0);
  const totalRevenueCents = bookingStats.reduce((a, b) => a + (b._sum.grossAmountCents ?? 0), 0);
  const completedCents = bookingStats.find(b => b.status === "COMPLETED")?._sum?.grossAmountCents ?? 0;

  const pendingSettlements = settlementStats.find(s => s.status === "PENDING")?._count?.id ?? 0;
  const availableSettlements = settlementStats.find(s => s.status === "AVAILABLE")?._count?.id ?? 0;
  const pendingDriverPayout = settlementStats
    .filter(s => ["PENDING", "AVAILABLE"].includes(s.status))
    .reduce((a, b) => a + (b._sum.driverAmountCents ?? 0), 0);

  const stripeAvailableEur = stripeBalance?.available?.find(b => b.currency === "eur")?.amount ?? null;
  const stripePendingEur = stripeBalance?.pending?.find(b => b.currency === "eur")?.amount ?? null;

  const cardClass = "rounded-xl border p-5";
  const cardStyle = { backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" };
  const labelStyle = { color: "var(--color-text-muted)" };
  const valueStyle = { color: "var(--color-text-primary)" };
  const subStyle = { color: "var(--color-text-secondary)" };

  return (
    <>
      <AdminHeader title="Ajustes" subtitle="Estado de la plataforma y accesos rápidos" />

      <div className="p-8 space-y-8 max-w-4xl">

        {/* ══ RESUMEN DE PLATAFORMA ══ */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={labelStyle}>
            Resumen de la plataforma
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Users size={16} />, label: "Choferes activos", value: `${activeDrivers} / ${driverCount}`, color: "var(--color-brand-400)" },
              { icon: <Layers size={16} />, label: "Servicios activos", value: serviceCount, color: "var(--color-success)" },
              { icon: <BookOpen size={16} />, label: "Reservas totales", value: totalBookings, color: "var(--color-warning)" },
              { icon: <DollarSign size={16} />, label: "Volumen total", value: formatEuros(totalRevenueCents), color: "var(--color-success)" },
            ].map((item) => (
              <div key={item.label} className={cardClass} style={cardStyle}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${item.color}22`, color: item.color }}>
                  {item.icon}
                </div>
                <p className="text-xl font-bold" style={valueStyle}>{item.value}</p>
                <p className="text-xs mt-0.5" style={labelStyle}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ LIQUIDACIONES PENDIENTES ══ */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={labelStyle}>
            Estado de liquidaciones
          </h2>
          <div className={`${cardClass} space-y-3`} style={cardStyle}>
            {[
              { label: "Viajes completados facturados", value: formatEuros(completedCents), icon: <CheckCircle size={14} />, color: "var(--color-success)" },
              { label: "Liquidaciones pendientes de procesar", value: pendingSettlements, icon: <AlertCircle size={14} />, color: "var(--color-warning)" },
              { label: "Liquidaciones disponibles para transferir", value: availableSettlements, icon: <Activity size={14} />, color: "var(--color-brand-400)" },
              { label: "Total pendiente de pago a choferes", value: formatEuros(pendingDriverPayout), icon: <CreditCard size={14} />, color: "var(--color-danger)" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b last:border-0"
                style={{ borderColor: "var(--color-surface-border)" }}>
                <span className="flex items-center gap-2 text-sm" style={{ color: row.color }}>
                  {row.icon}
                  <span style={subStyle}>{row.label}</span>
                </span>
                <span className="text-sm font-semibold" style={valueStyle}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══ STRIPE ══ */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={labelStyle}>
            Stripe
          </h2>
          <div className={cardClass} style={cardStyle}>
            {stripeBalance ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={15} style={{ color: "var(--color-success)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
                    Conectado correctamente
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-4" style={{ backgroundColor: "var(--color-surface-raised)" }}>
                    <p className="text-xs mb-1" style={labelStyle}>Balance disponible</p>
                    <p className="text-lg font-bold" style={valueStyle}>
                      {stripeAvailableEur !== null ? formatEuros(stripeAvailableEur) : "—"}
                    </p>
                    <p className="text-xs mt-0.5" style={labelStyle}>En cuenta Stripe (EUR)</p>
                  </div>
                  <div className="rounded-lg p-4" style={{ backgroundColor: "var(--color-surface-raised)" }}>
                    <p className="text-xs mb-1" style={labelStyle}>Balance pendiente</p>
                    <p className="text-lg font-bold" style={valueStyle}>
                      {stripePendingEur !== null ? formatEuros(stripePendingEur) : "—"}
                    </p>
                    <p className="text-xs mt-0.5" style={labelStyle}>En tránsito (EUR)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle size={15} style={{ color: "var(--color-danger)" }} />
                <span className="text-sm" style={{ color: "var(--color-danger)" }}>
                  No se pudo conectar con Stripe. Verifica la variable STRIPE_SECRET_KEY.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ══ ACCESOS RÁPIDOS ══ */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={labelStyle}>
            Accesos rápidos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: "Stripe Dashboard",
                description: "Pagos, transferencias y Connect",
                href: "https://dashboard.stripe.com",
                color: "var(--color-brand-400)",
              },
              {
                label: "Vercel",
                description: "Deployments, logs y variables de entorno",
                href: "https://vercel.com/dashboard",
                color: "var(--color-success)",
              },
              {
                label: "Clerk Dashboard",
                description: "Usuarios, roles y autenticación",
                href: "https://dashboard.clerk.com",
                color: "var(--color-warning)",
              },
              {
                label: "Neon Console",
                description: "Base de datos PostgreSQL",
                href: "https://console.neon.tech",
                color: "var(--color-text-secondary)",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border px-5 py-4 transition-colors hover:bg-white/3 group"
                style={cardStyle}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: link.color }}>{link.label}</p>
                  <p className="text-xs mt-0.5" style={labelStyle}>{link.description}</p>
                </div>
                <ExternalLink size={14} className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity"
                  style={{ color: link.color }} />
              </a>
            ))}
          </div>
        </section>

        {/* ══ VARIABLES DE ENTORNO ══ */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={labelStyle}>
            Variables de entorno
          </h2>
          <div className={`${cardClass} space-y-2`} style={cardStyle}>
            {[
              { key: "STRIPE_SECRET_KEY", set: !!process.env.STRIPE_SECRET_KEY },
              { key: "STRIPE_WEBHOOK_SECRET", set: !!process.env.STRIPE_WEBHOOK_SECRET },
              { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", set: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY },
              { key: "CLERK_SECRET_KEY", set: !!process.env.CLERK_SECRET_KEY },
              { key: "CLERK_WEBHOOK_SECRET", set: !!process.env.CLERK_WEBHOOK_SECRET },
              { key: "DATABASE_URL", set: !!process.env.DATABASE_URL },
            ].map(({ key, set }) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-xs font-mono" style={subStyle}>{key}</span>
                {set ? (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-success)" }}>
                    <CheckCircle size={12} /> Configurada
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-danger)" }}>
                    <XCircle size={12} /> Falta
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
