import { UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";

interface DriverHeaderProps {
  title: string;
  subtitle?: string;
}

export function DriverHeader({ title, subtitle }: DriverHeaderProps) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-4 lg:px-8 border-b"
      style={{
        backgroundColor: "var(--color-surface-card)",
        borderColor: "var(--color-surface-border)",
        minHeight: "64px",
        paddingTop: "max(env(safe-area-inset-top), 0px)",
      }}
    >
      <div>
        <h1 className="text-base lg:text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5 hidden sm:block" style={{ color: "var(--color-text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Bell size={18} />
        </button>
        <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
      </div>
    </header>
  );
}
