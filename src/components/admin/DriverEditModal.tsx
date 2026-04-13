"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  licenseNumber: string | null;
  commissionPercent: number | string;
  payoutFrequency: string;
  isActive: boolean;
}

interface DriverEditModalProps {
  driver: Driver;
  onClose: () => void;
}

export function DriverEditModal({ driver, onClose }: DriverEditModalProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: driver.name,
    phone: driver.phone ?? "",
    licenseNumber: driver.licenseNumber ?? "",
    commissionPercent: String(driver.commissionPercent),
    payoutFrequency: driver.payoutFrequency,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      licenseNumber: form.licenseNumber.trim() || null,
      commissionPercent: parseFloat(form.commissionPercent),
      payoutFrequency: form.payoutFrequency,
    };

    try {
      const res = await fetch(`/api/admin/drivers/${driver.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.formErrors?.[0] ?? "Error al guardar");
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-(--color-brand-500)";
  const inputStyle = {
    backgroundColor: "var(--color-surface-raised)",
    borderColor: "var(--color-surface-border)",
    color: "var(--color-text-primary)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl"
        style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-surface-border)" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Editar chofer
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {driver.email}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Nombre completo *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Teléfono
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+351 912 345 678"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Licencia */}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Nº de licencia / carta de conducir
            </label>
            <input
              type="text"
              value={form.licenseNumber}
              onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
              placeholder="Ej: PT-12345678"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* Comisión + Frecuencia */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Comisión del chofer (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                  value={form.commissionPercent}
                  onChange={(e) => setForm((f) => ({ ...f, commissionPercent: e.target.value }))}
                  className={`${inputClass} pr-8`}
                  style={inputStyle}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                  style={{ color: "var(--color-text-muted)" }}>%</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                El chofer recibe este % del importe bruto del viaje
              </p>
            </div>

            <div className="w-36">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                Frecuencia de pago
              </label>
              <select
                value={form.payoutFrequency}
                onChange={(e) => setForm((f) => ({ ...f, payoutFrequency: e.target.value }))}
                className={inputClass}
                style={inputStyle}
              >
                <option value="WEEKLY">Semanal</option>
                <option value="BIWEEKLY">Quincenal</option>
                <option value="MONTHLY">Mensual</option>
              </select>
            </div>
          </div>

          {/* Ejemplo de distribución */}
          {form.commissionPercent && !isNaN(parseFloat(form.commissionPercent)) && (
            <div className="rounded-lg px-4 py-3 space-y-1"
              style={{ backgroundColor: "var(--color-surface-raised)" }}>
              <p className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>
                Ejemplo con un viaje de 100 €
              </p>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--color-text-muted)" }}>Chofer recibe</span>
                <span className="font-semibold" style={{ color: "var(--color-success)" }}>
                  {parseFloat(form.commissionPercent).toFixed(0)} €
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "var(--color-text-muted)" }}>Empresa retiene</span>
                <span className="font-semibold" style={{ color: "var(--color-brand-400)" }}>
                  {(100 - parseFloat(form.commissionPercent)).toFixed(0)} €
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg bg-red-500/10" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--color-surface-border)", color: "var(--color-text-secondary)" }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
