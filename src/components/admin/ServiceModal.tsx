"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2 } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | string;
  currency: string;
  isActive: boolean;
}

interface ServiceModalProps {
  service?: Service | null;
  onClose: () => void;
}

export function ServiceModal({ service, onClose }: ServiceModalProps) {
  const router = useRouter();
  const isEditing = !!service;

  const [form, setForm] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    basePrice: service ? String(service.basePrice) : "",
    currency: service?.currency ?? "eur",
    isActive: service?.isActive ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      basePrice: parseFloat(form.basePrice),
      currency: form.currency.toLowerCase(),
      isActive: form.isActive,
    };

    try {
      const url = isEditing
        ? `/api/admin/services/${service.id}`
        : "/api/admin/services";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderColor: "var(--color-surface-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {isEditing ? "Editar servicio" : "Nuevo servicio"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--color-text-secondary)" }}>
              Nombre del servicio *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Transfer Aeropuerto Lisboa"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-(--color-brand-500)"
              style={{
                backgroundColor: "var(--color-surface-raised)",
                borderColor: "var(--color-surface-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-medium mb-1.5"
              style={{ color: "var(--color-text-secondary)" }}>
              Descripción
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Descripción opcional para el cliente..."
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-(--color-brand-500) resize-none"
              style={{
                backgroundColor: "var(--color-surface-raised)",
                borderColor: "var(--color-surface-border)",
                color: "var(--color-text-primary)",
              }}
            />
          </div>

          {/* Precio + Moneda */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-text-secondary)" }}>
                Precio base *
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  €
                </span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={form.basePrice}
                  onChange={(e) => setForm((f) => ({ ...f, basePrice: e.target.value }))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-(--color-brand-500)"
                  style={{
                    backgroundColor: "var(--color-surface-raised)",
                    borderColor: "var(--color-surface-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-text-secondary)" }}>
                Moneda
              </label>
              <select
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:border-(--color-brand-500)"
                style={{
                  backgroundColor: "var(--color-surface-raised)",
                  borderColor: "var(--color-surface-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                <option value="eur">EUR</option>
                <option value="usd">USD</option>
                <option value="gbp">GBP</option>
              </select>
            </div>
          </div>

          {/* Estado activo */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-lg"
            style={{ backgroundColor: "var(--color-surface-raised)" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                Servicio activo
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                Visible para los clientes al reservar
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: form.isActive
                  ? "var(--color-brand-500)"
                  : "var(--color-surface-border)",
              }}
            >
              <span
                className="inline-block h-4 w-4 rounded-full bg-white transition-transform shadow-sm"
                style={{ transform: form.isActive ? "translateX(22px)" : "translateX(4px)" }}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--color-danger)/15", color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
              style={{
                borderColor: "var(--color-surface-border)",
                color: "var(--color-text-secondary)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-brand-500)",
                color: "#ffffff",
              }}
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? "Guardar cambios" : "Crear servicio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
