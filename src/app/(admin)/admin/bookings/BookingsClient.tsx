"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BookingDetailModal } from "@/components/admin/BookingDetailModal";
import { CreateBookingModal } from "@/components/admin/CreateBookingModal";

interface Driver { id: string; name: string; email: string; commissionPercent: number }
interface Service { id: string; name: string; basePrice: number; currency: string }
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
  service: { id: string; name: string };
  driver: { id: string; name: string; email: string } | null;
  settlement: { id: string; status: string } | null;
}

interface BookingsClientProps {
  bookings: Booking[];
  drivers: Driver[];
  services: Service[];
}

const STATUS_LABELS: Record<string, string> = {
  ALL: "Todos",
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No show",
};

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function BookingsClient({ bookings, drivers, services }: BookingsClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "ALL" || b.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        b.clientName.toLowerCase().includes(q) ||
        b.clientEmail.toLowerCase().includes(q) ||
        b.pickupAddress.toLowerCase().includes(q) ||
        b.dropoffAddress.toLowerCase().includes(q) ||
        b.service.name.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, search, statusFilter]);

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5">
        <div />
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}
        >
          <Plus size={15} />
          Nueva reserva
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Buscador */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por cliente, dirección o servicio..."
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

        {/* Filtro estado */}
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                backgroundColor:
                  statusFilter === val
                    ? "var(--color-brand-500)"
                    : "var(--color-surface-card)",
                borderWidth: 1,
                borderColor:
                  statusFilter === val
                    ? "var(--color-brand-500)"
                    : "var(--color-surface-border)",
                color: statusFilter === val ? "#fff" : "var(--color-text-secondary)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contador */}
      <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
        {filtered.length} {filtered.length === 1 ? "reserva" : "reservas"}
        {search || statusFilter !== "ALL" ? " (filtradas)" : " en total"}
      </p>

      {/* Lista vacía */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <p className="text-base font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Sin reservas
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            {search || statusFilter !== "ALL"
              ? "Prueba a cambiar los filtros"
              : "Las reservas aparecerán aquí cuando los clientes reserven"}
          </p>
        </div>
      )}

      {/* Tabla */}
      {filtered.length > 0 && (
        <div className="rounded-xl border overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-card)", borderColor: "var(--color-surface-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-surface-border)" }}>
                {["Fecha", "Cliente", "Servicio", "Trayecto", "Chofer", "Importe", "Estado pago", "Estado", ""].map((h) => (
                  <th key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                    style={{ color: "var(--color-text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b transition-colors hover:bg-white/2 cursor-pointer"
                  style={{ borderColor: "var(--color-surface-border)" }}
                  onClick={() => setSelectedBooking(booking)}
                >
                  {/* Fecha */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="text-xs font-medium" style={{ color: "var(--color-text-primary)" }}>
                      {format(new Date(booking.pickupDatetime), "d MMM", { locale: es })}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {format(new Date(booking.pickupDatetime), "HH:mm")}
                    </p>
                  </td>

                  {/* Cliente */}
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs" style={{ color: "var(--color-text-primary)" }}>
                      {booking.clientName}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {booking.clientEmail}
                    </p>
                  </td>

                  {/* Servicio */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {booking.service.name}
                    </span>
                  </td>

                  {/* Trayecto */}
                  <td className="px-4 py-3 max-w-45">
                    <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                      {booking.pickupAddress}
                    </p>
                    <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                      → {booking.dropoffAddress}
                    </p>
                  </td>

                  {/* Chofer */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {booking.driver ? (
                      <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {booking.driver.name}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "var(--color-warning)/15", color: "var(--color-warning)" }}>
                        Sin asignar
                      </span>
                    )}
                  </td>

                  {/* Importe */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-xs" style={{ color: "var(--color-text-primary)" }}>
                      {formatEuros(booking.grossAmountCents)}
                    </span>
                  </td>

                  {/* Estado pago */}
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.paymentStatus as any} />
                  </td>

                  {/* Estado reserva */}
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status as any} />
                  </td>

                  {/* Ver detalle */}
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: "var(--color-brand-400)" }}>
                      Ver →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detalle */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          drivers={drivers}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      {/* Modal nueva reserva */}
      {createOpen && (
        <CreateBookingModal
          services={services}
          drivers={drivers}
          onClose={() => setCreateOpen(false)}
        />
      )}
    </>
  );
}
