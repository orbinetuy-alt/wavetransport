"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, MapPin, Calendar, Users, FileText, Car } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Driver { id: string; name: string; email: string }

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string | null;
  pickupAddress: string;
  dropoffAddress: string;
  pickupDatetime: string;
  passengers: number;
  notes: string | null;
  grossAmountCents: number;
  platformFeeCents: number;
  driverAmountCents: number;
  stripeFeeCents: number;
  status: string;
  paymentStatus: string;
  service: { name: string };
  driver: { id: string; name: string } | null;
}

interface BookingDetailModalProps {
  booking: Booking;
  drivers: Driver[];
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "CONFIRMED", label: "Confirmada" },
  { value: "IN_PROGRESS", label: "En curso" },
  { value: "COMPLETED", label: "Completada" },
  { value: "CANCELLED", label: "Cancelada" },
  { value: "NO_SHOW", label: "No show" },
];

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function BookingDetailModal({ booking, drivers, onClose }: BookingDetailModalProps) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [driverId, setDriverId] = useState(booking.driver?.id ?? "");
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDirty =
    status !== booking.status ||
    driverId !== (booking.driver?.id ?? "") ||
    notes !== (booking.notes ?? "");

  async function handleSave() {
    if (!isDirty) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          driverId: driverId || null,
          notes: notes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      router.refresh();
      onClose();
    } catch {
      setError("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  }

  const selectStyle = {
    backgroundColor: "var(--color-surface-raised)",
    borderColor: "var(--color-surface-border)",
    color: "var(--color-text-primary)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b z-10"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Reserva #{booking.id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {booking.service.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"
            style={{ color: "var(--color-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Cliente */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>Cliente</h3>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="Nombre" value={booking.clientName} />
              <InfoRow label="Email" value={booking.clientEmail} />
              {booking.clientPhone && <InfoRow label="Teléfono" value={booking.clientPhone} />}
              <InfoRow label="Pasajeros" value={`${booking.passengers}`} icon={<Users size={13} />} />
            </div>
          </section>

          {/* Viaje */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>Viaje</h3>
            <div className="space-y-2">
              <InfoRow label="Recogida" value={booking.pickupAddress} icon={<MapPin size={13} />} />
              <InfoRow label="Destino" value={booking.dropoffAddress} icon={<MapPin size={13} />} />
              <InfoRow
                label="Fecha y hora"
                value={format(new Date(booking.pickupDatetime), "d MMM yyyy — HH:mm", { locale: es })}
                icon={<Calendar size={13} />}
              />
            </div>
          </section>

          {/* Financiero */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>Distribución de pago</h3>
            <div className="rounded-lg overflow-hidden border"
              style={{ borderColor: "var(--color-surface-border)" }}>
              {[
                { label: "Total cliente", value: formatEuros(booking.grossAmountCents), highlight: true },
                { label: "Fee Stripe", value: `− ${formatEuros(booking.stripeFeeCents)}`, muted: true },
                { label: "Empresa retiene", value: formatEuros(booking.platformFeeCents), accent: "brand" },
                { label: "Chofer recibe", value: formatEuros(booking.driverAmountCents), accent: "success" },
              ].map((row) => (
                <div key={row.label}
                  className="flex justify-between items-center px-4 py-2.5 border-b last:border-0"
                  style={{ borderColor: "var(--color-surface-border)" }}>
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{row.label}</span>
                  <span className="text-sm font-semibold" style={{
                    color: row.accent === "success"
                      ? "var(--color-success)"
                      : row.accent === "brand"
                      ? "var(--color-brand-400)"
                      : row.muted
                      ? "var(--color-text-muted)"
                      : "var(--color-text-primary)",
                  }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Editar estado */}
          <section>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>Gestión</h3>
            <div className="space-y-3">
              {/* Estado */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Estado de la reserva
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={selectStyle}>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Asignar chofer */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="flex items-center gap-1.5"><Car size={12} /> Chofer asignado</span>
                </label>
                <select value={driverId} onChange={(e) => setDriverId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                  style={selectStyle}>
                  <option value="">— Sin asignar —</option>
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                  ))}
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  <span className="flex items-center gap-1.5"><FileText size={12} /> Notas internas</span>
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas visibles solo para el admin..."
                  className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
                  style={selectStyle}
                />
              </div>
            </div>
          </section>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg bg-red-500/10" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--color-surface-border)", color: "var(--color-text-secondary)" }}>
              Cerrar
            </button>
            <button onClick={handleSave} disabled={!isDirty || loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs mb-0.5 flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
        {icon} {label}
      </p>
      <p className="text-sm" style={{ color: "var(--color-text-primary)" }}>{value}</p>
    </div>
  );
}
