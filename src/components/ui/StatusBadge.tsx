type StatusVariant =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show"
  | "paid"
  | "refunded"
  | "disputed"
  | "transferred"
  | "available"
  | "on_hold";

const variants: Record<StatusVariant, { label: string; color: string; bg: string }> = {
  pending:     { label: "Pendiente",    color: "var(--color-warning)",   bg: "var(--color-warning)22" },
  confirmed:   { label: "Confirmada",   color: "var(--color-info)",      bg: "var(--color-info)22" },
  in_progress: { label: "En curso",     color: "#8b5cf6",               bg: "rgba(139,92,246,0.15)" },
  completed:   { label: "Completado",   color: "var(--color-success)",   bg: "var(--color-success)22" },
  cancelled:   { label: "Cancelado",    color: "var(--color-danger)",    bg: "var(--color-danger)22" },
  no_show:     { label: "No se presentó", color: "var(--color-danger)",  bg: "var(--color-danger)22" },
  paid:        { label: "Pagado",       color: "var(--color-success)",   bg: "var(--color-success)22" },
  refunded:    { label: "Reembolsado",  color: "var(--color-danger)",    bg: "var(--color-danger)22" },
  disputed:    { label: "En disputa",   color: "var(--color-danger)",    bg: "var(--color-danger)22" },
  transferred: { label: "Transferido",  color: "var(--color-brand-400)", bg: "var(--color-brand-500)22" },
  available:   { label: "Disponible",   color: "var(--color-success)",   bg: "var(--color-success)22" },
  on_hold:     { label: "En espera",    color: "var(--color-warning)",   bg: "var(--color-warning)22" },
};

interface StatusBadgeProps {
  status: StatusVariant;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const v = variants[status] ?? variants.pending;
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: v.color, backgroundColor: v.bg }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: v.color }}
      />
      {v.label}
    </span>
  );
}
