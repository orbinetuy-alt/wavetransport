"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Servicios", href: "#servicios" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Flota", href: "#flota" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleNavClick(href: string) {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled
          ? "rgba(13, 27, 46, 0.92)"
          : "rgba(13, 27, 46, 0.4)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(36, 61, 88, 0.8)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-18 flex items-center justify-between" style={{ height: "72px" }}>

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Wave Transports"
            width={160}
            height={52}
            className="h-10 w-auto"
            style={{ mixBlendMode: "screen", filter: "brightness(1.1)" }}
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/8 cursor-pointer"
                style={{ color: "var(--color-text-secondary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-secondary)")}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-white/8"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Acceder
          </Link>
          <button
            onClick={() => handleNavClick("#reservar")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-100 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #0e81b8, #0b6a97)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(14, 129, 184, 0.35)",
            }}
          >
            Reservar ahora
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10 cursor-pointer"
          style={{ color: "var(--color-text-primary)" }}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          opacity: menuOpen ? 1 : 0,
          borderTop: menuOpen ? "1px solid rgba(36, 61, 88, 0.6)" : "1px solid transparent",
          backgroundColor: "rgba(13, 27, 46, 0.97)",
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 hover:bg-white/8 cursor-pointer"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 pt-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(36, 61, 88, 0.6)" }}>
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-center transition-colors hover:bg-white/8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Acceder
            </Link>
            <button
              onClick={() => handleNavClick("#reservar")}
              className="px-4 py-3.5 rounded-xl text-sm font-semibold text-center cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #0e81b8, #0b6a97)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(14, 129, 184, 0.3)",
              }}
            >
              Reservar ahora
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
