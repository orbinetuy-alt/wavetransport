"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Send, CheckCircle, AlertCircle, Banknote, CreditCard } from "lucide-react";

interface Settlement {
  id: string;
  status: string;
  grossAmountCents: number;
  platformFeeCents: number;
  driverAmountCents: number;
  stripeFeeCents: number;
  stripeTransferId: string | null;
  createdAt: string;
  booking: {
    id: string;
    clientName: string;
    pickupDatetime: string;
    paymentStatus: string;
    service: { name: string };
  };
  driver: {
    id: string;
    name: string;
    email: string;
    stripeAccountId: string | null;
    stripeChargesEnabled: boolean;
  };
}

interface SettlementDetailModalProps {
  settlement: Settlement;
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:     { label: "Pendiente",    color: "var(--color-warning)",  bg: "var(--color-warning)22"  },
  AVAILABLE:   { label: "Disponible",   color: "var(--color-brand-400)", bg: "var(--color-brand-400)22" },
  TRANSFERRED: { label: "Transferida",  color: "var(--color-success)",  bg: "var(--color-success)22"  },
  PAID_OUT:    { label: "Pagada",        color: "var(--color-success)",  bg: "var(--color-success)33"  },
  RECONCILED:  { label: "Reconciliada", color: "var(--color-text-muted)", bg: "transparent" },
  ON_HOLD:     { label: "En espera",    color: "var(--color-danger)",   bg: "var(--color-danger)22"   },
};

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
}

type Action = "mark_available" | "transfer" | "mark_transferred" | "mark_paid" | "reconcile" | "hold";

export function SettlementDetailModal({ settlement: initial, onClose }: SettlementDetailModalProps) {
  const router = useRouter();
  const [settlement, setSettlement] = useState(initial);
  const [loading, setLoading] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cfg = STATUS_CONFIG[settlement.status] ?? STATUS_CONFIG.PENDING;
  const hasStripe = !!settlement.driver.stripeAccountId && settlement.driver.stripeChargesEnabled;

  async function execute(action: Action) {
    setError(null);
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/settlements/${settlement.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al ejecutar la acción");
      setSettlement(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setLoading(null);
    }
  }

  const btnBase = "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: "var(--color-surface-border)" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
              Liquidación
            </h2>
            <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--color-text-muted)" }}>
              {settlement.id.slice(-8)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ backgroundColor: cfg.bg, color: cfg.color }}>
              {cfg.label}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10"
              style={{ color: "var(--color-text-muted)" }}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Info reserva + chofer */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4"
              style={{ backgroundColor: "var(--color-surface-raised)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                Reserva
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {settlement.booking.clientName}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {settlement.booking.service.name}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                {formatDate(settlement.booking.pickupDatetime)}
              </p>
            </div>
            <div className="rounded-xl p-4"
              style={{ backgroundColor: "var(--color-surface-raised)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
                Chofer
              </p>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {settlement.driver.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                {settlement.driver.email}
              </p>
              <div className="flex items-center gap-1 mt-1">
                {hasStripe ? (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-success)" }}>
                    <CheckCircle size={11} /> Stripe activo
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <AlertCircle size={11} /> Sin Stripe
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Desglose financiero */}
          <div className="rounded-xl overflow-hidden border"
            style={{ borderColor: "var(--color-surface-border)" }}>
            <div className="px-4 py-3 border-b"
              style={{ backgroundColor: "var(--color-surface-raised)", borderColor: "var(--color-surface-border)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--color-text-muted)" }}>
                Desglose financiero
              </p>
            </div>
            <div className="divide-y divide-(--color-surface-border)">
              {[
                { label: "Total cobrado al cliente", value: settlement.grossAmountCents, highlight: false },
                { label: "Comisión plataforma", value: settlement.platformFeeCents, highlight: false },
                { label: "Fee Stripe", value: settlement.stripeFeeCents, highlight: false },
                { label: "Pago al chofer", value: settlement.driverAmountCents, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex justify-between items-center px-4 py-3">
                  <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {label}
                  </span>
                  <span className={`text-sm font-semibold`}
                    style={{ color: highlight ? "var(--color-success)" : "var(--color-text-primary)" }}>
                    {formatEuros(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stripe transfer ID */}
          {settlement.stripeTransferId && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg"
              style={{ backgroundColor: "var(--color-success)11", border: "1px solid var(--color-success)33" }}>
              <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--color-success)" }}>
                  Transferencia Stripe realizada
                </p>
                <p className="text-xs font-mono mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {settlement.stripeTransferId}
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm px-3 py-2.5 rounded-lg bg-red-500/10" style={{ color: "var(--color-danger)" }}>
              {error}
            </p>
          )}

          {/* ── Acciones según estado ── */}
          <div className="space-y-2">
            {settlement.status === "PENDING" && (
              <button disabled={!!loading} onClick={() => execute("mark_available")}
                className={`${btnBase} w-full justify-center`}
                style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}>
                {loading === "mark_available" && <Loader2 size={14} className="animate-spin" />}
                <Banknote size={15} />
                Marcar fondos disponibles
              </button>
            )}

            {settlement.status === "AVAILABLE" && (
              <div className="space-y-2">
                {hasStripe && (
                  <button disabled={!!loading} onClick={() => execute("transfer")}
                    className={`${btnBase} w-full justify-center`}
                    style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}>
                    {loading === "transfer" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Send size={14} />
                    )}
                    Transferir vía Stripe
                  </button>
                )}
                <button disabled={!!loading} onClick={() => execute("mark_transferred")}
                  className={`${btnBase} w-full justify-center`}
                  style={{
                    backgroundColor: "transparent",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-surface-border)",
                  }}>
                  {loading === "mark_transferred" && <Loader2 size={14} className="animate-spin" />}
                  <CreditCard size={14} />
                  Marcar transferida manualmente
                </button>
              </div>
            )}

            {settlement.status === "TRANSFERRED" && (
              <button disabled={!!loading} onClick={() => execute("mark_paid")}
                className={`${btnBase} w-full justify-center`}
                style={{ backgroundColor: "var(--color-success)", color: "#fff" }}>
                {loading === "mark_paid" && <Loader2 size={14} className="animate-spin" />}
                <CheckCircle size={14} />
                Confirmar pago recibido
              </button>
            )}

            {settlement.status === "PAID_OUT" && (
              <button disabled={!!loading} onClick={() => execute("reconcile")}
                className={`${btnBase} w-full justify-center`}
                style={{ backgroundColor: "transparent", color: "var(--color-text-muted)",
                  border: "1px solid var(--color-surface-border)" }}>
                {loading === "reconcile" && <Loader2 size={14} className="animate-spin" />}
                Marcar reconciliada
              </button>
            )}

            {["PENDING", "AVAILABLE", "TRANSFERRED"].includes(settlement.status) && (
              <button disabled={!!loading} onClick={() => execute("hold")}
                className={`${btnBase} w-full justify-center`}
                style={{ backgroundColor: "transparent", color: "var(--color-danger)",
                  border: "1px solid var(--color-danger)44" }}>
                {loading === "hold" && <Loader2 size={14} className="animate-spin" />}
                Poner en espera
              </button>
            )}

            {["RECONCILED", "ON_HOLD"].includes(settlement.status) && (
              <p className="text-center text-sm py-2" style={{ color: "var(--color-text-muted)" }}>
                No hay acciones disponibles en este estado.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
