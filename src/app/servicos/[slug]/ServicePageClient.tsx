"use client";

import { CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServiceData } from "./data";

export function ServicePageClient({ service }: { service: ServiceData }) {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ height: "60vh", minHeight: 420 }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${service.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(8,20,40,0.88) 0%, rgba(8,20,40,0.35) 55%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <Link
          href="/#servicos"
          className="absolute flex items-center gap-2"
          style={{
            top: 24,
            left: 16,
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
            backgroundColor: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.2)",
            padding: "7px 14px",
            borderRadius: 999,
          }}
        >
          <ArrowLeft size={15} />
          Voltar
        </Link>

        {/* Title */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pb-12 md:pb-16 w-full">
          <h1
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.8rem)", lineHeight: 1.08 }}
          >
            {service.label}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "clamp(14px, 3vw, 19px)", marginTop: 12 }}>
            {service.tagline}
          </p>
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section style={{ backgroundColor: "#f8fafc", paddingTop: 72, paddingBottom: 56 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span
            className="inline-block text-xs font-bold uppercase mb-5 px-3 py-1 rounded-full"
            style={{
              color: "#0e81b8",
              backgroundColor: "rgba(14,129,184,0.10)",
              border: "1px solid rgba(14,129,184,0.25)",
              letterSpacing: "0.18em",
            }}
          >
            Sobre este serviço
          </span>
          <p className="leading-relaxed" style={{ color: "#4a6a8a", fontSize: 17, lineHeight: 1.85 }}>
            {service.description}
          </p>
        </div>
      </section>

      {/* ── INCLUDES CARDS ── */}
      <section style={{ backgroundColor: "#f8fafc", paddingBottom: 80 }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2
            className="text-center font-extrabold mb-10"
            style={{ color: "#0a2d52", fontSize: "clamp(1.3rem, 3vw, 1.75rem)" }}
          >
            O que está incluído
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {service.includes.map((item) => (
              <div
                key={item}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(14,129,184,0.12)",
                  boxShadow: "0 2px 16px rgba(10,45,82,0.06)",
                }}
              >
                <CheckCircle2 size={22} style={{ color: "#0e81b8", flexShrink: 0 }} />
                <p style={{ color: "#0a2d52", fontSize: 14, fontWeight: 500, lineHeight: 1.55 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING NOTE ── */}
      <section style={{ backgroundColor: "#f8fafc", paddingBottom: 120 }}>
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="flex items-start gap-4 rounded-2xl p-6"
            style={{
              backgroundColor: "rgba(14,129,184,0.06)",
              border: "1px solid rgba(14,129,184,0.18)",
            }}
          >
            <span style={{ fontSize: 26 }}>💬</span>
            <div>
              <p className="font-semibold" style={{ color: "#0a2d52", fontSize: 15 }}>
                Preços sob consulta
              </p>
              <p style={{ color: "#4a6a8a", fontSize: 14, lineHeight: 1.65, marginTop: 4 }}>
                Cada serviço é adaptado às suas necessidades. Clique em{" "}
                <strong>Reservar agora</strong> e receba uma proposta clara e sem compromisso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY BOTTOM BAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "#0a2d52",
          borderTop: "1px solid rgba(255,255,255,0.10)",
          padding: "12px 16px",
          boxShadow: "0 -4px 24px rgba(10,45,82,0.25)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p
              className="hidden sm:block"
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
              }}
            >
              Serviço
            </p>
            <p className="truncate" style={{ color: "#ffffff", fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>
              {service.label}
            </p>
          </div>
          <Link
            href="/#contacto"
            style={{
              backgroundColor: "#0e81b8",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 14,
              padding: "12px 20px",
              borderRadius: 12,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0b6d9e")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0e81b8")}
          >
            Reservar agora →
          </Link>
        </div>
      </div>
    </>
  );
}
