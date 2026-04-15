import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between h-16 px-8 border-b"
      style={{
        backgroundColor: "var(--color-surface-card)",
        borderColor: "var(--color-surface-border)",
      }}
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notificaciones (placeholder) */}
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Bell size={18} />
        </button>

        {/* Avatar Clerk */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
            },
          }}
        />
      </div>
    </header>
  );
}
