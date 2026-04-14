"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MapPin, Users, Calendar, CheckCircle, XCircle, Play, Flag, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

type DriverResponse = "PENDING" | "ACCEPTED" | "REJECTED" | null;

interface Booking {
  id: string;
  status: string;
  driverResponse: DriverResponse;
  pickupDatetime: string;
  pickupAddress: string;
  dropoffAddress: string;
  passengers: number;
  driverAmountCents: number;
  service: { name: string };
}

interface TripsClientProps {
  bookings: Booking[];
}

function DriverResponseBadge({ response }: { response: DriverResponse }) {
  if (!response || response === "PENDING") {
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "#f59e0b" }}
      >
        Pendiente respuesta
      </span>
    );
  }
  if (response === "ACCEPTED") {
    return (
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981" }}
      >
        Aceptado
      </span>
    );
  }
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444" }}
    >
      Rechazado
    </span>
  );
}

function TripCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localResponse, setLocalResponse] = useState<DriverResponse>(booking.driverResponse);
  const [localStatus, setLocalStatus] = useState(booking.status);
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  async function callApi(body: object, actionKey: string) {
    setError(null);
    setLoadingAction(actionKey);
    try {
      const res = await fetch(`/api/driver/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      // Update local state immediately for snappy UX
      if ("driverResponse" in data) setLocalResponse(data.driverResponse);
      if ("status" in data && data.status !== localStatus) setLocalStatus(data.status);
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoadingAction(null);
    }
  }

  const showRespondButtons = localResponse === "PENDING";
  const showStartButton = localResponse === "ACCEPTED" && localStatus === "CONFIRMED";
  const showCompleteButton = localResponse === "ACCEPTED" && localStatus === "IN_PROGRESS";

  return (
    <li
      className="rounded-xl border p-4 transition-colors"
      style={{
        backgroundColor: "var(--color-surface-card)",
        borderColor: localResponse === "REJECTED"
          ? "rgba(239,68,68,0.3)"
          : localResponse === "PENDING"
          ? "rgba(245,158,11,0.3)"
          : "var(--color-surface-border)",
      }}
    >
      {/* Cabecera: fecha + estado booking + respuesta del chofer */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={13} style={{ color: "var(--color-text-muted)" }} />
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {format(new Date(booking.pickupDatetime), "dd MMM yyyy · HH:mm", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={localStatus.toLowerCase() as Parameters<typeof StatusBadge>[0]["status"]} />
          <DriverResponseBadge response={localResponse} />
        </div>
      </div>

      {/* Ruta */}
      <div className="flex flex-col gap-1.5 mb-3">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-brand-400)" }} />
          <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
            {booking.pickupAddress}
          </span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
          <span className="text-sm" style={{ color: "var(--color-text-primary)" }}>
            {booking.dropoffAddress}
          </span>
        </div>
      </div>

      {/* Footer: servicio + pasajeros + ganancia */}
      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-surface-raised)",
              color: "var(--color-text-secondary)",
            }}
          >
            {booking.service.name}
          </span>
          <div className="flex items-center gap-1">
            <Users size={12} style={{ color: "var(--color-text-muted)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {booking.passengers}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-bold" style={{ color: "var(--color-text-primary)" }}>
            {formatEuros(booking.driverAmountCents)}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            tu ganancia
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      {(showRespondButtons || showStartButton || showCompleteButton) && (
        <div className="mt-4 flex gap-2">
          {showRespondButtons && (
            <>
              <button
                disabled={isPending || loadingAction !== null}
                onClick={() => callApi({ action: "respond", driverResponse: "ACCEPTED" }, "accept")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
              >
                {loadingAction === "accept" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Aceptar viaje
              </button>
              <button
                disabled={isPending || loadingAction !== null}
                onClick={() => callApi({ action: "respond", driverResponse: "REJECTED" }, "reject")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
                style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                {loadingAction === "reject" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Rechazar
              </button>
            </>
          )}

          {showStartButton && (
            <button
              disabled={isPending || loadingAction !== null}
              onClick={() => callApi({ action: "status", status: "IN_PROGRESS" }, "start")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}
            >
              {loadingAction === "start" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Play size={15} />
              )}
              Iniciar viaje
            </button>
          )}

          {showCompleteButton && (
            <button
              disabled={isPending || loadingAction !== null}
              onClick={() => callApi({ action: "status", status: "COMPLETED" }, "complete")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "rgba(16,185,129,0.2)", color: "#10b981", border: "1px solid rgba(16,185,129,0.4)" }}
            >
              {loadingAction === "complete" ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Flag size={15} />
              )}
              Completar viaje
            </button>
          )}
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs px-3 py-1.5 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
          {error}
        </p>
      )}
    </li>
  );
}

export function TripsClient({ bookings }: TripsClientProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>
          No tenés viajes asignados todavía
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {bookings.map((booking) => (
        <TripCard key={booking.id} booking={booking} />
      ))}
    </ul>
  );
}
