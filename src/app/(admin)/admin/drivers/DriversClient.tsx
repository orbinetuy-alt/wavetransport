"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, ToggleLeft, ToggleRight, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { DriverEditModal } from "@/components/admin/DriverEditModal";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string | null;
  commissionPercent: number | string;
  payoutFrequency: string;
  isActive: boolean;
  stripeOnboardingDone: boolean;
  stripePayoutsEnabled: boolean;
  createdAt: string;
  _count: { bookings: number; settlements: number };
}

interface DriversClientProps {
  drivers: Driver[];
}

const payoutLabels: Record<string, string> = {
  WEEKLY: "Semanal",
  BIWEEKLY: "Quincenal",
  MONTHLY: "Mensual",
};

export function DriversClient({ drivers }: DriversClientProps) {
  const router = useRouter();
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function toggleActive(driver: Driver) {
    setTogglingId(driver.id);
    try {
      await fetch(`/api/admin/drivers/${driver.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !driver.isActive }),
      });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <>
      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total choferes", value: drivers.length },
          { label: "Activos", value: drivers.filter((d) => d.isActive).length },
          { label: "Con Stripe listo", value: drivers.filter((d) => d.stripePayoutsEnabled).length },
        ].map((stat) => (
          <div key={stat.label}
            className="rounded-xl border px-5 py-4"
            style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
            <p className="text-2xl font-bold" style={{ color: "var(--color-text-primary)" }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      {drivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <p className="text-lg font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Sin choferes registrados
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Los choferes aparecen aquí cuando se registran con rol DRIVER
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-surface-border)" }}>
                {["Chofer", "Contacto", "Comisión", "Pagos", "Stripe", "Viajes", "Estado", ""].map((h) => (
                  <th key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--color-surface-border)" }}>
              {drivers.map((driver) => (
                <tr key={driver.id}
                  className="transition-colors hover:bg-white/2"
                  style={{ opacity: driver.isActive ? 1 : 0.55 }}>

                  {/* Nombre + email */}
                  <td className="px-5 py-4">
                    <p className="font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {driver.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {driver.email}
                    </p>
                  </td>

                  {/* Teléfono + licencia */}
                  <td className="px-5 py-4">
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      {driver.phone ?? <span style={{ color: "var(--color-text-muted)" }}>—</span>}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {driver.licenseNumber ?? "Sin licencia"}
                    </p>
                  </td>

                  {/* Comisión */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-base" style={{ color: "var(--color-success)" }}>
                      {Number(driver.commissionPercent).toFixed(0)}%
                    </span>
                  </td>

                  {/* Frecuencia de pago */}
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--color-surface-raised)",
                        color: "var(--color-text-secondary)",
                      }}>
                      {payoutLabels[driver.payoutFrequency] ?? driver.payoutFrequency}
                    </span>
                  </td>

                  {/* Stripe */}
                  <td className="px-5 py-4">
                    {driver.stripePayoutsEnabled ? (
                      <span className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-success)" }}>
                        <CheckCircle size={13} /> Listo
                      </span>
                    ) : driver.stripeOnboardingDone ? (
                      <span className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-warning)" }}>
                        <AlertCircle size={13} /> Pendiente
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs"
                        style={{ color: "var(--color-text-muted)" }}>
                        <XCircle size={13} /> Sin cuenta
                      </span>
                    )}
                  </td>

                  {/* Viajes */}
                  <td className="px-5 py-4">
                    <span style={{ color: "var(--color-text-secondary)" }}>
                      {driver._count.bookings}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-5 py-4">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: driver.isActive ? "var(--color-success)/15" : "var(--color-text-muted)/15",
                        color: driver.isActive ? "var(--color-success)" : "var(--color-text-muted)",
                      }}>
                      {driver.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingDriver(driver)}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                        style={{ color: "var(--color-text-secondary)" }}
                        title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(driver)}
                        disabled={togglingId === driver.id}
                        className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                        style={{ color: driver.isActive ? "var(--color-warning)" : "var(--color-success)" }}
                        title={driver.isActive ? "Desactivar" : "Activar"}>
                        {togglingId === driver.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : driver.isActive ? (
                          <ToggleRight size={14} />
                        ) : (
                          <ToggleLeft size={14} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingDriver && (
        <DriverEditModal
          driver={editingDriver}
          onClose={() => setEditingDriver(null)}
        />
      )}
    </>
  );
}
