"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Reservas",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Choferes",
    href: "/admin/drivers",
    icon: Users,
  },
  {
    label: "Liquidaciones",
    href: "/admin/settlements",
    icon: CreditCard,
  },
  {
    label: "Ajustes",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex flex-col w-64 border-r"
      style={{
        backgroundColor: "var(--color-surface-card)",
        borderColor: "var(--color-surface-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <Image
          src="/logo.png"
          alt="Wave Transports"
          width={140}
          height={40}
          className="object-contain"
          priority
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
              style={{
                backgroundColor: isActive ? "var(--color-brand-500)" + "22" : "transparent",
                color: isActive ? "var(--color-brand-400)" : "var(--color-text-secondary)",
                borderLeft: isActive ? `2px solid var(--color-brand-500)` : "2px solid transparent",
              }}
            >
              <Icon
                size={18}
                style={{ color: isActive ? "var(--color-brand-400)" : "var(--color-text-muted)" }}
                className="transition-colors group-hover:text-[var(--color-brand-400)] shrink-0"
              />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight size={14} style={{ color: "var(--color-brand-400)" }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="px-4 py-4 border-t"
        style={{ borderColor: "var(--color-surface-border)" }}
      >
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Panel de administración
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
          Wave Transports © 2026
        </p>
      </div>
    </aside>
  );
}
