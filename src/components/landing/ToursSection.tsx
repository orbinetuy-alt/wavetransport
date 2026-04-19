"use client";

import { MapPin, Clock, CheckCircle2 } from "lucide-react";

const TOURS = [
  {
    id: "lisboa",
    title: "Lisboa Privada",
    subtitle: "A cidade a seu ritmo",
    duration: "Meio dia ou dia completo",
    description:
      "Descubra Lisboa com acompanhamento personalizado. Roteiro flexível, paragens estratégicas e um motorista que conhece cada detalhe da cidade.",
    highlights: [
      "Alfama & Miradouros",
      "Belém & Torre",
      "Chiado & Baixa",
      "Paragens à escolha",
    ],
    accent: "#0e81b8",
    gradientFrom: "#0a2d52",
    gradientTo: "#0e4f8a",
    badge: "Mais reservado",
  },
  {
    id: "sintra",
    title: "Sintra & Cascais",
    subtitle: "Paláciosе mar numa só viagem",
    duration: "Dia completo",
    description:
      "Um percurso icónico pela Serra de Sintra e pela costa de Cascais. Paisagens, história e arquitetura num único dia inesquecível.",
    highlights: [
      "Palácio da Pena",
      "Quinta da Regaleira",
      "Centro histórico de Sintra",
      "Cascais",
      "Cabo da Roca (opcional)",
    ],
    accent: "#0d5c8a",
    gradientFrom: "#0a3a60",
    gradientTo: "#0d5c8a",
    badge: null,
  },
  {
    id: "alentejo",
    title: "Alentejo & Vinhos",
    subtitle: "Planície, sabor e cultura",
    duration: "Dia completo",
    description:
      "Mergulhe na autenticidade do Alentejo: aldeias medievais, vinhas infinitas e uma gastronomia que conta a história da região.",
    highlights: [
      "Évora",
      "Monsaraz",
      "Prova de vinhos",
      "Almoço típico alentejano",
    ],
    accent: "#7a5c2e",
    gradientFrom: "#4a3010",
    gradientTo: "#7a5c2e",
    badge: null,
  },
];

export function ToursSection() {
  return (
    <section
      id="tours"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#ffffff", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="max-w-6xl mx-auto px-6">

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
            Tours Privados
          </span>
          <h2
            className="font-extrabold"
            style={{ color: "#0a2d52", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            Experiências exclusivas,<br />
            <span style={{ color: "#0e81b8" }}>desenhadas para si.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "#4a6a8a" }}
          >
            Roteiros privados por Portugal com motorista dedicado, total flexibilidade e conforto premium do início ao fim.
          </p>
        </div>

        {/* Tour cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {TOURS.map((tour) => (
            <div
              key={tour.id}
              className="relative flex flex-col overflow-hidden rounded-2xl"
              style={{
                boxShadow: "0 4px 24px rgba(10,45,82,0.10)",
                border: "1px solid rgba(14,129,184,0.10)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 16px 40px rgba(10,45,82,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(10,45,82,0.10)";
              }}
            >
              {/* Colored header */}
              <div
                className="relative flex flex-col justify-end"
                style={{
                  background: `linear-gradient(135deg, ${tour.gradientFrom} 0%, ${tour.gradientTo} 100%)`,
                  padding: "32px 28px 24px",
                  minHeight: 160,
                }}
              >
                {tour.badge && (
                  <span
                    className="absolute top-4 right-4 font-bold uppercase rounded-full"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      padding: "3px 10px",
                      backgroundColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                      border: "1px solid rgba(255,255,255,0.35)",
                    }}
                  >
                    {tour.badge}
                  </span>
                )}

                <p className="text-xs font-semibold uppercase mb-1" style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em" }}>
                  {tour.subtitle}
                </p>
                <h3 className="font-extrabold text-white" style={{ fontSize: 24, lineHeight: 1.2 }}>
                  {tour.title}
                </h3>

                {/* Duration pill */}
                <div className="flex items-center gap-1.5 mt-3">
                  <Clock size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500 }}>
                    {tour.duration}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 gap-4 p-6" style={{ backgroundColor: "#ffffff" }}>
                <p className="text-sm leading-relaxed" style={{ color: "#5a7a9a" }}>
                  {tour.description}
                </p>

                {/* Highlights */}
                <div className="flex flex-col gap-2">
                  {tour.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 size={15} style={{ color: tour.accent, flexShrink: 0 }} />
                      <span style={{ color: "#3a5a7a", fontSize: 13, fontWeight: 500 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer row */}
                <div className="mt-auto pt-4 flex items-center gap-2" style={{ borderTop: "1px solid #edf0f3" }}>
                  <MapPin size={14} style={{ color: tour.accent }} />
                  <span style={{ color: "#8aa0b8", fontSize: 12 }}>Portugal · Saída de Lisboa</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p style={{ color: "#4a6a8a", fontSize: 15 }}>
            Quer um roteiro personalizado?{" "}
            <a
              href="#contacto"
              style={{ color: "#0e81b8", fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Fale connosco e criamos a sua experiência.
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}
