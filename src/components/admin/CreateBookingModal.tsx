"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, MessageCircle, MapPin } from "lucide-react";

interface Service { id: string; name: string; basePrice: number | string; currency: string }
interface Driver { id: string; name: string; email: string; commissionPercent: number | string }

interface CreateBookingModalProps {
  services: Service[];
  drivers: Driver[];
  onClose: () => void;
}

const PAYMENT_METHODS = [
  { value: "PENDING", label: "Pendiente (sin cobrar aún)" },
  { value: "CASH", label: "Efectivo — cobrado en mano" },
  { value: "CARD_PRESENT", label: "Tarjeta — cobrado en persona" },
];

function eurosToCents(val: string) {
  return Math.round(parseFloat(val) * 100);
}

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function CreateBookingModal({ services, drivers, onClose }: CreateBookingModalProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    serviceId: services[0]?.id ?? "",
    driverId: "",
    pickupAddress: "",
    dropoffAddress: "",
    pickupDate: "",
    pickupTime: "09:00",
    passengers: "1",
    notes: "",
    grossAmount: services[0] ? String(Number(services[0].basePrice)) : "",
    paymentMethod: "PENDING",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preview distribución en tiempo real
  const grossCents = form.grossAmount && !isNaN(parseFloat(form.grossAmount))
    ? eurosToCents(form.grossAmount)
    : 0;
  const selectedDriver = drivers.find((d) => d.id === form.driverId);
  const commissionPct = selectedDriver ? Number(selectedDriver.commissionPercent) : 0;
  const driverCents = Math.round((grossCents * commissionPct) / 100);
  const platformCents = grossCents - driverCents;

  function handleServiceChange(serviceId: string) {
    const svc = services.find((s) => s.id === serviceId);
    setForm((f) => ({
      ...f,
      serviceId,
      grossAmount: svc ? String(Number(svc.basePrice)) : f.grossAmount,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.pickupDate) {
      setError("Selecciona la fecha y hora de recogida");
      return;
    }

    setLoading(true);
    try {
      const pickupDatetime = new Date(`${form.pickupDate}T${form.pickupTime}`).toISOString();

      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.clientName.trim(),
          clientEmail: form.clientEmail.trim(),
          clientPhone: form.clientPhone.trim() || null,
          serviceId: form.serviceId,
          driverId: form.driverId || null,
          pickupAddress: form.pickupAddress.trim(),
          dropoffAddress: form.dropoffAddress.trim(),
          pickupDatetime,
          passengers: parseInt(form.passengers),
          notes: form.notes.trim() || null,
          grossAmountCents: grossCents,
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.error?.fieldErrors
            ? Object.values(data.error.fieldErrors).flat().join(", ")
            : "Error al crear la reserva"
        );
      }

      router.refresh();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors";
  const inputStyle = {
    backgroundColor: "var(--color-surface-raised)",
    borderColor: "var(--color-surface-border)",
    color: "var(--color-text-primary)",
  };
  const labelClass = "block text-xs font-medium mb-1.5";
  const labelStyle = { color: "var(--color-text-secondary)" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-2xl rounded-2xl border shadow-2xl max-h-[92vh] overflow-y-auto"
        style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2"
              style={{ color: "var(--color-text-primary)" }}>
              <MessageCircle size={16} style={{ color: "var(--color-brand-400)" }} />
              Nueva reserva manual
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Para reservas por WhatsApp, teléfono o en persona
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"
            style={{ color: "var(--color-text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

          {/* ── Sección cliente ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>
              Datos del cliente
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass} style={labelStyle}>Nombre completo *</label>
                <input required type="text" value={form.clientName}
                  onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))}
                  placeholder="João Silva"
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass} style={labelStyle}>Email *</label>
                <input required type="email" value={form.clientEmail}
                  onChange={(e) => setForm((f) => ({ ...f, clientEmail: e.target.value }))}
                  placeholder="joao@email.com"
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass} style={labelStyle}>Teléfono</label>
                <input type="tel" value={form.clientPhone}
                  onChange={(e) => setForm((f) => ({ ...f, clientPhone: e.target.value }))}
                  placeholder="+351 912 345 678"
                  className={inputClass} style={inputStyle} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass} style={labelStyle}>Pasajeros</label>
                <input type="number" min="1" max="20" value={form.passengers}
                  onChange={(e) => setForm((f) => ({ ...f, passengers: e.target.value }))}
                  className={inputClass} style={inputStyle} />
              </div>
            </div>
          </section>

          {/* ── Sección viaje ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>
              Detalles del viaje
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={labelStyle}>Servicio *</label>
                  <select required value={form.serviceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                    className={inputClass} style={inputStyle}>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Chofer asignado</label>
                  <select value={form.driverId}
                    onChange={(e) => setForm((f) => ({ ...f, driverId: e.target.value }))}
                    className={inputClass} style={inputStyle}>
                    <option value="">— Sin asignar —</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({Number(d.commissionPercent).toFixed(0)}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass} style={labelStyle}>
                  <span className="flex items-center gap-1"><MapPin size={11} />Dirección de recogida *</span>
                </label>
                <input required type="text" value={form.pickupAddress}
                  onChange={(e) => setForm((f) => ({ ...f, pickupAddress: e.target.value }))}
                  placeholder="Aeropuerto de Lisboa, Terminal 1"
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>
                  <span className="flex items-center gap-1"><MapPin size={11} />Dirección de destino *</span>
                </label>
                <input required type="text" value={form.dropoffAddress}
                  onChange={(e) => setForm((f) => ({ ...f, dropoffAddress: e.target.value }))}
                  placeholder="Hotel Bairro Alto, Lisboa"
                  className={inputClass} style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass} style={labelStyle}>Fecha de recogida *</label>
                  <input required type="date" value={form.pickupDate}
                    onChange={(e) => setForm((f) => ({ ...f, pickupDate: e.target.value }))}
                    className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Hora de recogida *</label>
                  <input type="time" value={form.pickupTime}
                    onChange={(e) => setForm((f) => ({ ...f, pickupTime: e.target.value }))}
                    className={inputClass} style={inputStyle} />
                </div>
              </div>
            </div>
          </section>

          {/* ── Sección pago ── */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>
              Pago
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass} style={labelStyle}>Importe total *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}>€</span>
                  <input required type="number" min="0.01" step="0.01" value={form.grossAmount}
                    onChange={(e) => setForm((f) => ({ ...f, grossAmount: e.target.value }))}
                    placeholder="0.00"
                    className={`${inputClass} pl-7`} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Método de pago</label>
                <select value={form.paymentMethod}
                  onChange={(e) => setForm((f) => ({ ...f, paymentMethod: e.target.value }))}
                  className={inputClass} style={inputStyle}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preview distribución */}
            {grossCents > 0 && (
              <div className="mt-3 rounded-lg px-4 py-3 space-y-1.5"
                style={{ backgroundColor: "var(--color-surface-raised)" }}>
                <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  Distribución estimada
                </p>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--color-text-muted)" }}>Total cliente</span>
                  <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {formatEuros(grossCents)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    Chofer recibe {selectedDriver ? `(${commissionPct}%)` : "(sin asignar)"}
                  </span>
                  <span className="font-semibold" style={{ color: "var(--color-success)" }}>
                    {formatEuros(driverCents)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--color-text-muted)" }}>Empresa retiene</span>
                  <span className="font-semibold" style={{ color: "var(--color-brand-400)" }}>
                    {formatEuros(platformCents)}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Notas */}
          <div>
            <label className={labelClass} style={labelStyle}>Notas internas</label>
            <textarea rows={2} value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Ej: Reservado por WhatsApp, cliente habitual..."
              className={`${inputClass} resize-none`} style={inputStyle} />
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg bg-red-500/10" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
              style={{ borderColor: "var(--color-surface-border)", color: "var(--color-text-secondary)" }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}>
              {loading && <Loader2 size={14} className="animate-spin" />}
              Crear reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
