"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, RefreshCw, ArrowRightLeft, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { SettlementDetailModal } from "@/components/admin/SettlementDetailModal";

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

interface SettlementsClientProps {
  settlements: Settlement[];
  pendingCents: number;
  availableCents: number;
  transferredCents: number;
  pendingCount: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:     { label: "Pendiente",    color: "var(--color-warning)"   },
  AVAILABLE:   { label: "Disponible",   color: "var(--color-brand-400)" },
  TRANSFERRED: { label: "Transferida",  color: "var(--color-success)"   },
  PAID_OUT:    { label: "Pagada",        color: "var(--color-success)"   },
  RECONCILED:  { label: "Reconciliada", color: "var(--color-text-muted)" },
  ON_HOLD:     { label: "En espera",    color: "var(--color-danger)"    },
};

const STATUS_FILTERS = ["ALL", "PENDING", "AVAILABLE", "TRANSFERRED", "PAID_OUT", "RECONCILED", "ON_HOLD"];
const STATUS_FILTER_LABELS: Record<string, string> = {
  ALL: "Todas", PENDING: "Pendiente", AVAILABLE: "Disponible",
  TRANSFERRED: "Transferida", PAID_OUT: "Pagada", RECONCILED: "Conciliada", ON_HOLD: "En espera",
};

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function SettlementsClient({
  settlements,
  pendingCents,
  availableCents,
  transferredCents,
  pendingCount,
}: SettlementsClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Settlement | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateMsg, setGenerateMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return settlements.filter((s) => {
      const matchStatus = statusFilter === "ALL" || s.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        s.driver.name.toLowerCase().includes(q) ||
        s.booking.clientName.toLowerCase().includes(q) ||
        s.booking.service.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [settlements, search, statusFilter]);

  async function handleGenerate() {
    setGenerating(true);
    setGenerateMsg(null);
    try {
      const res = await fetch("/api/admin/settlements", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error("Error al generar liquidaciones");
      setGenerateMsg(
        data.created === 0
          ? "Sin viajes completados pendientes de liquidar."
          : `${data.created} liquidación${data.created !== 1 ? "es" : ""} generada${data.created !== 1 ? "s" : ""}.`
      );
      router.refresh();
    } catch {
      setGenerateMsg("Error al generar liquidaciones.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          {
            icon: <Clock size={16} style={{ color: "var(--color-warning)" }} />,
            bg: "var(--color-warning)22",
            label: "Pendiente de procesar",
            value: formatEuros(pendingCents),
            sub: `${pendingCount} liquidación${pendingCount !== 1 ? "es" : ""}`,
          },
          {
            icon: <ArrowRightLeft size={16} style={{ color: "var(--color-brand-400)" }} />,
            bg: "var(--color-brand-400)22",
            label: "Disponible para transferir",
            value: formatEuros(availableCents),
            sub: "Listo para pagar",
          },
          {
            icon: <CheckCircle size={16} style={{ color: "var(--color-success)" }} />,
            bg: "var(--color-success)22",
            label: "Total transferido",
            value: formatEuros(transferredCents),
            sub: "Histórico",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-5 border"
            style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: card.bg }}>
              {card.icon}
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>
              {card.value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {card.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por chofer, cliente o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none"
            style={{
              backgroundColor: "var(--color-surface-card)",
              borderColor: "var(--color-surface-border)",
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60 transition-colors whitespace-nowrap"
          style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}
        >
          {generating ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <RefreshCw size={14} />
          )}
          Generar liquidaciones
        </button>
      </div>

      {generateMsg && (
        <p className="text-sm mb-4 px-3 py-2 rounded-lg"
          style={{ backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-secondary)" }}>
          {generateMsg}
        </p>
      )}

      {/* Filtros de estado */}
      <div className="flex gap-1.5 flex-wrap mb-5">
        {STATUS_FILTERS.map((val) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: statusFilter === val ? "var(--color-brand-500)" : "var(--color-surface-card)",
              borderWidth: 1,
              borderColor: statusFilter === val ? "var(--color-brand-500)" : "var(--color-surface-border)",
              color: statusFilter === val ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {STATUS_FILTER_LABELS[val]}
          </button>
        ))}
      </div>

      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        {filtered.length} liquidación{filtered.length !== 1 ? "es" : ""}
        {search || statusFilter !== "ALL" ? " (filtradas)" : " en total"}
      </p>

      {/* Tabla vacía */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <p className="text-base font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Sin liquidaciones
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {settlements.length === 0
              ? "Haz clic en «Generar liquidaciones» para crear los registros pendientes."
              : "Prueba cambiando los filtros."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs"
                  style={{ backgroundColor: "var(--color-surface-raised)", borderColor: "var(--color-surface-border)" }}>
                  {["Fecha", "Cliente / Servicio", "Chofer", "Chofer recibe", "Plataforma", "Estado", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium"
                      style={{ color: "var(--color-text-muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const cfg = STATUS_CONFIG[s.status];
                  return (
                    <tr
                      key={s.id}
                      className="border-b transition-colors hover:bg-white/2 cursor-pointer"
                      style={{ borderColor: "var(--color-surface-border)" }}
                      onClick={() => setSelected(s)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {format(new Date(s.booking.pickupDatetime), "d MMM", { locale: es })}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {format(new Date(s.booking.pickupDatetime), "HH:mm")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-xs" style={{ color: "var(--color-text-primary)" }}>
                          {s.booking.clientName}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {s.booking.service.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                          {s.driver.name}
                        </p>
                        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {s.driver.stripeAccountId ? "Stripe ✓" : "Sin Stripe"}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-xs" style={{ color: "var(--color-success)" }}>
                          {formatEuros(s.driverAmountCents)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {formatEuros(s.platformFeeCents)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold" style={{ color: cfg?.color }}>
                          {cfg?.label ?? s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs" style={{ color: "var(--color-brand-400)" }}>Ver →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <SettlementDetailModal
          settlement={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
