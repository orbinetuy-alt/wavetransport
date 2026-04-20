"use client";

import { useState } from "react";
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
    image: "tour-lisboa.webp",
    accent: "#0e81b8",
    badge: "Mais reservado",
  },
  {
    id: "sintra",
    title: "Sintra & Cascais",
    subtitle: "Palácios e mar numa só viagem",
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
    image: "tour-sintrajpg.jpg",
    accent: "#7dd3f0",
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
    image: "tour-alentejo.jpg",
    accent: "#f0c060",
    badge: null,
  },
];

export function ToursSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="tours"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#f8fafc", paddingTop: 100, paddingBottom: 100 }}
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
            gap: 28,
          }}
        >
          {TOURS.map((tour) => (
            <div
              key={tour.id}
              className="relative flex flex-col overflow-hidden rounded-2xl"
              style={{
                boxShadow: hoveredId === tour.id
                  ? "0 20px 48px rgba(10,45,82,0.22)"
                  : "0 4px 24px rgba(10,45,82,0.10)",
                border: "1px solid rgba(14,129,184,0.10)",
                transform: hoveredId === tour.id ? "translateY(-6px)" : "translateY(0)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                backgroundColor: "#ffffff",
              }}
              onMouseEnter={() => setHoveredId(tour.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image area */}
              <div className="relative overflow-hidden" style={{ height: 230 }}>
                <img
                  src={`/${tour.image}`}
                  alt={tour.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transform: hoveredId === tour.id ? "scale(1.07)" : "scale(1)",
                    transition: "transform 0.5s ease",
                    display: "block",
                  }}
                />
                {/* Dark gradient overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(5,20,40,0.82) 0%, rgba(5,20,40,0.35) 55%, transparent 100%)",
                  }}
                />

                {/* Badge */}
                {tour.badge && (
                  <span
                    className="absolute top-4 left-4 font-bold uppercase rounded-full"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.12em",
                      padding: "4px 12px",
                      backgroundColor: "#0e81b8",
                      color: "#ffffff",
                    }}
                  >
                    {tour.badge}
                  </span>
                )}

                {/* Text overlay at bottom of image */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0 24px 20px",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase mb-1"
                    style={{ color: "rgba(255,255,255,0.70)", letterSpacing: "0.14em" }}
                  >
                    {tour.subtitle}
                  </p>
                  <h3 className="font-extrabold text-white" style={{ fontSize: 22, lineHeight: 1.2 }}>
                    {tour.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock size={12} style={{ color: "rgba(255,255,255,0.65)" }} />
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 500 }}>
                      {tour.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 gap-4 p-6">
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
