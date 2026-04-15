"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Users, Phone, Navigation, UserX, Flag, Loader2, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function formatEuros(cents: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(cents / 100);
}

interface ActiveTripClientProps {
  booking: {
    id: string;
    status: string;
    pickupDatetime: string;
    pickupAddress: string;
    dropoffAddress: string;
    passengers: number;
    clientName: string;
    clientPhone: string | null;
    driverAmountCents: number;
    service: { name: string };
    notes: string | null;
  };
}

export function ActiveTripClient({ booking }: ActiveTripClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNoShowConfirm, setShowNoShowConfirm] = useState(false);

  async function callApi(body: object, actionKey: string, redirectTo?: string) {
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
      startTransition(() => router.push(redirectTo ?? "/driver/trips"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
      setLoadingAction(null);
    }
  }

  function openMaps(address: string) {
    const encoded = encodeURIComponent(address);
    // On mobile: try Apple Maps / Google Maps app; fallback to Google Maps web
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
    window.open(url, "_blank");
  }

  const isLoading = loadingAction !== null || isPending;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-surface-base)" }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-4 border-b"
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderColor: "var(--color-surface-border)",
        }}
      >
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-bold text-base" style={{ color: "var(--color-text-primary)" }}>
            Viaje en curso
          </h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {booking.service.name}
          </p>
        </div>
        {/* Pulse indicator */}
        <div className="ml-auto flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <span className="text-xs font-semibold" style={{ color: "#8b5cf6" }}>
            EN CURSO
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-5 max-w-xl mx-auto w-full">

        {/* Fecha y hora */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "var(--color-surface-card)", border: "1px solid var(--color-surface-border)" }}
        >
          <Clock size={18} style={{ color: "var(--color-brand-500)" }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {format(new Date(booking.pickupDatetime), "EEEE, d 'de' MMMM · HH:mm", { locale: es })}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {booking.passengers} {booking.passengers === 1 ? "pasajero" : "pasajeros"} · {formatEuros(booking.driverAmountCents)}
            </p>
          </div>
        </div>

        {/* Ruta */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "var(--color-surface-card)", border: "1px solid var(--color-surface-border)" }}
        >
          {/* Recogida */}
          <div className="p-4 flex items-start gap-3">
            <div
              className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(14,129,184,0.12)" }}
            >
              <MapPin size={16} style={{ color: "var(--color-brand-500)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase mb-0.5" style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}>
                Recogida
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                {booking.pickupAddress}
              </p>
            </div>
          </div>

          <div className="mx-4 border-t" style={{ borderColor: "var(--color-surface-border)" }} />

          {/* Destino */}
          <div className="p-4 flex items-start gap-3">
            <div
              className="mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(16,185,129,0.12)" }}
            >
              <MapPin size={16} style={{ color: "#10b981" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase mb-0.5" style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}>
                Destino
              </p>
              <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                {booking.dropoffAddress}
              </p>
            </div>
          </div>
        </div>

        {/* Cliente */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ backgroundColor: "var(--color-surface-card)", border: "1px solid var(--color-surface-border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: "rgba(14,129,184,0.12)", color: "var(--color-brand-500)" }}
            >
              {booking.clientName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {booking.clientName}
              </p>
              {booking.clientPhone && (
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {booking.clientPhone}
                </p>
              )}
            </div>
          </div>
          {booking.clientPhone && (
            <a
              href={`tel:${booking.clientPhone}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: "rgba(14,129,184,0.10)", color: "var(--color-brand-500)" }}
            >
              <Phone size={14} />
              Llamar
            </a>
          )}
        </div>

        {/* Notas */}
        {booking.notes && (
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)" }}
          >
            <p className="text-xs font-semibold mb-1" style={{ color: "#f59e0b" }}>Notas del cliente</p>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{booking.notes}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col gap-3 mt-2">

          {/* Cómo llegar */}
          <button
            onClick={() => openMaps(booking.pickupAddress)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm"
            style={{
              backgroundColor: "var(--color-brand-500)",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(14,129,184,0.30)",
            }}
          >
            <Navigation size={18} />
            Cómo llegar
          </button>

          {/* Finalizar viaje */}
          <button
            disabled={isLoading}
            onClick={() => callApi({ action: "status", status: "COMPLETED" }, "complete")}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50"
            style={{
              backgroundColor: "rgba(16,185,129,0.12)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.35)",
            }}
          >
            {loadingAction === "complete" ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Flag size={18} />
            )}
            Finalizar viaje
          </button>

          {/* El cliente no llega */}
          {!showNoShowConfirm ? (
            <button
              disabled={isLoading}
              onClick={() => setShowNoShowConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
              style={{ color: "var(--color-text-muted)" }}
            >
              <UserX size={16} />
              El cliente no llega
            </button>
          ) : (
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)" }}
            >
              <p className="text-sm font-semibold text-center" style={{ color: "#ef4444" }}>
                ¿Confirmar que el cliente no llegó?
              </p>
              <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
                El viaje se marcará como "No se presentó" y se notificará al administrador.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNoShowConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: "var(--color-surface-raised)", color: "var(--color-text-secondary)" }}
                >
                  Cancelar
                </button>
                <button
                  disabled={isLoading}
                  onClick={() => callApi({ action: "status", status: "NO_SHOW" }, "noshow")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                  style={{ backgroundColor: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" }}
                >
                  {loadingAction === "noshow" ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <UserX size={14} />
                  )}
                  Confirmar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Espacio para el bottom nav en mobile */}
        <div className="h-24" />
      </div>
    </div>
  );
}
