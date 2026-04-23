"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Tours", href: "#tours" },
  { label: "Porquê a Wave", href: "#porquewave" },
  { label: "Contacto", href: "#contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.pageYOffset || document.documentElement.scrollTop) > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchmove", onScroll);
    };
  }, []);

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
        backgroundColor: scrolled ? "#ffffff" : "transparent",
        borderBottom: scrolled ? "1px solid #e5e7eb" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
      }}
    >
      <nav className="relative max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between" style={{ height: "72px" }}>

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="Wave Transports"
            width={160}
            height={52}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  scrolled
                    ? "text-gray-500 hover:text-brand-500 hover:underline underline-offset-4"
                    : "text-white/90 hover:text-white"
                }`}
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
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              scrolled ? "text-gray-500 hover:text-gray-800 hover:bg-gray-100" : "text-white/80 hover:text-white"
            }`}
          >
            Entrar
          </Link>
          <button
            onClick={() => handleNavClick("#contacto")}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-100 cursor-pointer"
            style={{
              backgroundColor: scrolled ? "#111827" : "rgba(255,255,255,0.15)",
              border: scrolled ? "none" : "1.5px solid rgba(255,255,255,0.6)",
              backdropFilter: scrolled ? "none" : "blur(8px)",
            }}
          >
            Reservar agora
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-lg transition-colors cursor-pointer"
          style={{ color: scrolled ? "#4b5563" : "#ffffff" }}
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
          borderTop: menuOpen ? "1px solid #f3f4f6" : "1px solid transparent",
          backgroundColor: "#ffffff",
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-500 hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <div className="mt-3 pt-3 flex flex-col gap-2 border-t border-gray-100">
            <Link
              href="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-center text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Entrar
            </Link>
            <button
              onClick={() => handleNavClick("#contacto")}
              className="px-4 py-3.5 rounded-xl text-sm font-semibold text-center text-white cursor-pointer"
              style={{ backgroundColor: "#111827" }}
            >
              Reservar agora
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
