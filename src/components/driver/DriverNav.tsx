"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CreditCard,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Inicio",         href: "/driver",             icon: LayoutDashboard },
  { label: "Mis viajes",     href: "/driver/trips",       icon: Car },
  { label: "Liquidaciones",  href: "/driver/settlements", icon: CreditCard },
  { label: "Mi cuenta",      href: "/driver/settings",    icon: Settings },
];

export function DriverNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/driver" ? pathname === "/driver" : pathname.startsWith(href);

  return (
    <>
      {/* ── SIDEBAR — solo en desktop ── */}
      <aside
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-60 border-r"
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderColor: "var(--color-surface-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-5 border-b"
          style={{ borderColor: "var(--color-surface-border)" }}
        >
          <Image src="/logo.png" alt="Wave Transports" width={130} height={36} className="object-contain" priority />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  backgroundColor: active ? "var(--color-brand-500)22" : "transparent",
                  color: active ? "var(--color-brand-400)" : "var(--color-text-secondary)",
                  borderLeft: active ? "2px solid var(--color-brand-500)" : "2px solid transparent",
                }}
              >
                <Icon size={17} style={{ color: active ? "var(--color-brand-400)" : "var(--color-text-muted)" }} className="shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={13} style={{ color: "var(--color-brand-400)" }} />}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t" style={{ borderColor: "var(--color-surface-border)" }}>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>Panel del chofer</p>
        </div>
      </aside>

      {/* ── BOTTOM NAV — solo en mobile ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 pb-safe"
        style={{
          backgroundColor: "var(--color-surface-card)",
          borderColor: "var(--color-surface-border)",
          paddingBottom: "max(env(safe-area-inset-bottom), 8px)",
          paddingTop: "8px",
        }}
      >
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-150 min-w-0"
              style={{ color: active ? "var(--color-brand-400)" : "var(--color-text-muted)" }}
            >
              <div
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: active ? "var(--color-brand-500)22" : "transparent" }}
              >
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-medium truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
