import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accentColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = "var(--color-brand-500)",
}: StatCardProps) {
  return (
    <div
      className="relative rounded-xl p-6 border overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface-card)",
        borderColor: "var(--color-surface-border)",
      }}
    >
      {/* Glow de fondo sutil */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}>
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold"
            style={{ color: "var(--color-text-primary)" }}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p
              className="mt-2 text-xs font-medium"
              style={{ color: trend.positive ? "var(--color-success)" : "var(--color-danger)" }}
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </p>
          )}
        </div>

        <div
          className="flex items-center justify-center w-11 h-11 rounded-lg shrink-0"
          style={{ backgroundColor: accentColor + "22" }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  );
}
