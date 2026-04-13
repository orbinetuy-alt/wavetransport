"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { ServiceModal } from "@/components/admin/ServiceModal";

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  _count: { bookings: number };
}

interface ServicesClientProps {
  services: Service[];
}

function formatPrice(amount: number | string, currency: string) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(amount));
}

export function ServicesClient({ services }: ServicesClientProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  function openCreate() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEdit(service: Service) {
    setEditingService(service);
    setModalOpen(true);
  }

  async function toggleActive(service: Service) {
    setTogglingId(service.id);
    try {
      await fetch(`/api/admin/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !service.isActive }),
      });
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleDelete(service: Service) {
    if (!confirm(`¿Eliminar "${service.name}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(service.id);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error ?? "Error al eliminar");
        return;
      }
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Botón nuevo */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {services.length} {services.length === 1 ? "servicio" : "servicios"} en total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}
        >
          <Plus size={16} />
          Nuevo servicio
        </button>
      </div>

      {/* Lista vacía */}
      {services.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-xl border"
          style={{
            backgroundColor: "var(--color-surface-card)",
            borderColor: "var(--color-surface-border)",
          }}
        >
          <p className="text-lg font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Sin servicios todavía
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Crea el primero para poder recibir reservas
          </p>
          <button
            onClick={openCreate}
            className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: "var(--color-brand-500)", color: "#fff" }}
          >
            <Plus size={16} />
            Crear servicio
          </button>
        </div>
      )}

      {/* Grid de servicios */}
      {services.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex flex-col rounded-xl border p-5 transition-colors"
              style={{
                backgroundColor: "var(--color-surface-card)",
                borderColor: service.isActive
                  ? "var(--color-surface-border)"
                  : "var(--color-surface-border)",
                opacity: service.isActive ? 1 : 0.6,
              }}
            >
              {/* Header tarjeta */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3
                  className="font-semibold text-sm leading-snug"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {service.name}
                </h3>
                <span
                  className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: service.isActive
                      ? "var(--color-success)/15"
                      : "var(--color-text-muted)/15",
                    color: service.isActive
                      ? "var(--color-success)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {service.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>

              {/* Descripción */}
              {service.description && (
                <p
                  className="text-xs mb-3 line-clamp-2 flex-1"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {service.description}
                </p>
              )}

              {/* Precio */}
              <div className="mt-auto">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {formatPrice(service.basePrice, service.currency)}
                </span>
                <span
                  className="ml-1 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  precio base
                </span>
              </div>

              {/* Reservas count */}
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                {service._count.bookings} {service._count.bookings === 1 ? "reserva" : "reservas"}
              </p>

              {/* Acciones */}
              <div
                className="flex items-center gap-1 mt-4 pt-4 border-t"
                style={{ borderColor: "var(--color-surface-border)" }}
              >
                {/* Editar */}
                <button
                  onClick={() => openEdit(service)}
                  className="flex items-center gap-1.5 flex-1 justify-center px-2 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <Pencil size={13} />
                  Editar
                </button>

                {/* Toggle activo */}
                <button
                  onClick={() => toggleActive(service)}
                  disabled={togglingId === service.id}
                  className="flex items-center gap-1.5 flex-1 justify-center px-2 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {togglingId === service.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : service.isActive ? (
                    <ToggleRight size={13} />
                  ) : (
                    <ToggleLeft size={13} />
                  )}
                  {service.isActive ? "Desactivar" : "Activar"}
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => handleDelete(service)}
                  disabled={deletingId === service.id || service._count.bookings > 0}
                  title={
                    service._count.bookings > 0
                      ? "No se puede eliminar: tiene reservas"
                      : "Eliminar servicio"
                  }
                  className="flex items-center gap-1.5 flex-1 justify-center px-2 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ color: "var(--color-danger)" }}
                >
                  {deletingId === service.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ServiceModal
          service={editingService}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
