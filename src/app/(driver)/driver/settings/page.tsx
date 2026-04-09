import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getOrCreateDriver } from "@/lib/driver";
import { DriverHeader } from "@/components/driver/DriverHeader";
import { StripeOnboardingButton } from "@/components/driver/StripeOnboardingButton";
import { UserButton } from "@clerk/nextjs";
import { CheckCircle, XCircle, User, Percent } from "lucide-react";

export default async function DriverSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const driver = await getOrCreateDriver(userId);
  if (!driver) redirect("/unauthorized");

  const stripeOk = driver.stripeOnboardingDone && driver.stripePayoutsEnabled;

  return (
    <>
      <DriverHeader title="Mi cuenta" />

      <div className="px-4 lg:px-8 py-6 space-y-5">

        {/* ── Perfil ── */}
        <div className="rounded-xl border p-5"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "w-14 h-14" } }} />
            <div>
              <p className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{driver.name}</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{driver.email}</p>
              {driver.phone && (
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{driver.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Comisión ── */}
        <div className="rounded-xl border p-5"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Percent size={16} style={{ color: "var(--color-brand-400)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Tu porcentaje</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold" style={{ color: "var(--color-brand-400)" }}>
              {Number(driver.commissionPercent).toFixed(0)}%
            </span>
            <span className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>de cada viaje</span>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
            Este porcentaje fue acordado con la empresa. Contactá al administrador para modificarlo.
          </p>
        </div>

        {/* ── Stripe Connect ── */}
        <div className="rounded-xl border p-5"
          style={{
            backgroundColor: "var(--color-surface-card)",
            borderColor: stripeOk ? "var(--color-success)44" : "var(--color-warning)44",
          }}>
          <div className="flex items-center gap-2 mb-3">
            {stripeOk ? (
              <CheckCircle size={16} style={{ color: "var(--color-success)" }} />
            ) : (
              <XCircle size={16} style={{ color: "var(--color-warning)" }} />
            )}
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Cuenta de cobro (Stripe)
            </p>
          </div>

          {stripeOk ? (
            <div>
              <p className="text-sm" style={{ color: "var(--color-success)" }}>
                ✓ Verificación completada — podés recibir pagos
              </p>
              {driver.stripeAccountId && (
                <p className="text-xs mt-1 font-mono" style={{ color: "var(--color-text-muted)" }}>
                  ID: {driver.stripeAccountId}
                </p>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                Para recibir pagos directamente en tu banco necesitás completar la verificación de identidad de Stripe.
                Es un proceso de 5 minutos.
              </p>
              <StripeOnboardingButton />
            </div>
          )}
        </div>

        {/* ── Info cuenta ── */}
        <div className="rounded-xl border p-5"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div className="flex items-center gap-2 mb-3">
            <User size={16} style={{ color: "var(--color-text-muted)" }} />
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Frecuencia de pago
            </p>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {{
              WEEKLY: "Semanal — corte todos los domingos",
              BIWEEKLY: "Quincenal",
              MONTHLY: "Mensual",
            }[driver.payoutFrequency]}
          </p>
        </div>

      </div>
    </>
  );
}
