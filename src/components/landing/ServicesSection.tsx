"use client";

import { Plane, Briefcase, MapPin, Clock, Compass, Star } from "lucide-react";

const SERVICES = [
  {
    icon: Plane,
    label: "Transfer Aeroporto",
    description:
      "Chegadas e partidas do Aeroporto de Lisboa com acompanhamento total. Monitorização de voo em tempo real, meet & greet no terminal e assistência com bagagem. Disponível 24h, todos os dias.",
    accent: "#0e81b8",
    bg: "#e8f4fc",
    tag: "Mais popular",
  },
  {
    icon: Briefcase,
    label: "Transfer Executivo & Corporativo",
    description:
      "Transporte dedicado para executivos e equipas empresariais. Motoristas bilíngues (PT/EN), viaturas de alta gama, gestão de contas e faturação mensal.",
    accent: "#0e4f8a",
    bg: "#ddeaf8",
    tag: null,
  },
  {
    icon: MapPin,
    label: "Transfer Ponto a Ponto",
    description:
      "Viagens privadas de longa distância entre cidades, hotéis, aeroportos, portos e estações. Preço fixo sem surpresas, em todo o território português.",
    accent: "#0d5c8a",
    bg: "#e0eef8",
    tag: null,
  },
  {
    icon: Clock,
    label: "Chauffeur à Disposição",
    description:
      "Viatura com motorista dedicado pelo tempo que precisar. Ideal para dias com múltiplos compromissos ou eventos. Itinerário ajustado em tempo real.",
    accent: "#0e81b8",
    bg: "#e8f4fc",
    tag: null,
  },
  {
    icon: Compass,
    label: "Tours Privados em Portugal",
    description:
      "Experiências exclusivas e personalizadas: Lisboa, Sintra & Cascais, Alentejo & Vinhos. Roteiros à medida, com total flexibilidade de horário.",
    accent: "#0891b2",
    bg: "#e0f4fb",
    tag: null,
  },
  {
    icon: Star,
    label: "Eventos & Ocasiões Especiais",
    description:
      "Transporte dedicado para casamentos, jantares de gala e eventos privados. Apresentação impecável, total discrição e um serviço adaptado a cada ocasião.",
    accent: "#0a6a9a",
    bg: "#e0eef7",
    tag: null,
  },
];

export function ServicesSection() {
  return (
    <section
      id="servicos"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#f0f7ff", paddingTop: 100, paddingBottom: 100 }}
    >
      {/* Soft wave top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: 80,
          background: "linear-gradient(to bottom, rgba(14,81,140,0.12) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#0e81b8",
              backgroundColor: "rgba(14,129,184,0.10)",
              border: "1px solid rgba(14,129,184,0.25)",
              letterSpacing: "0.18em",
            }}
          >
            Os nossos serviços
          </span>
          <h2
            className="font-extrabold"
            style={{ color: "#0a2d52", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            Mobilidade premium,<br />
            <span style={{ color: "#0e81b8" }}>para cada ocasião.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "#4a6a8a" }}
          >
            Seja qual for o destino ou o motivo, garantimos uma experiência de transporte impecável.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {SERVICES.map(({ icon: Icon, label, description, accent, bg, tag }) => (
            <div
              key={label}
              className="relative flex flex-col gap-4 cursor-default rounded-2xl p-6"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(14,129,184,0.12)",
                boxShadow: "0 2px 16px rgba(14,81,140,0.07)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(-5px)";
                el.style.boxShadow = `0 16px 40px rgba(14,81,140,0.15)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 2px 16px rgba(14,81,140,0.07)";
              }}
            >
              {tag && (
                <span
                  className="absolute top-4 right-4 font-bold uppercase rounded-full"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.12em",
                    padding: "2px 8px",
                    backgroundColor: `${accent}18`,
                    color: accent,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  {tag}
                </span>
              )}

              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width: 52, height: 52, backgroundColor: bg }}
              >
                <Icon size={24} style={{ color: accent }} strokeWidth={1.8} />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <h3 className="font-bold" style={{ color: "#0a2d52", fontSize: 16 }}>{label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5a7a9a" }}>
                  {description}
                </p>
              </div>

              {/* Bottom colored bar */}
              <div style={{ height: 3, borderRadius: 999, backgroundColor: accent, opacity: 0.6 }} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
