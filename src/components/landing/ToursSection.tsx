"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import Link from "next/link";

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
    highlights: ["Évora", "Monsaraz", "Prova de vinhos", "Almoço típico alentejano"],
    image: "tour-alentejo.jpg",
    accent: "#f0c060",
    badge: null,
  },
  {
    id: "fatima-nazare-obidos",
    title: "Fátima, Nazaré & Óbidos",
    subtitle: "Fé, oceano e história medieval",
    duration: "10H – 11H",
    description:
      "Do Santuário de Fátima às ondas gigantes de Nazaré, terminando nas muralhas douradas de Óbidos. Um dia verdadeiramente português.",
    highlights: ["Santuário de Fátima", "Nazaré & Farol", "Óbidos medieval", "Opcional: Batalha"],
    image: "nazare.jpg",
    accent: "#0e81b8",
    badge: null,
  },
  {
    id: "sintra-half-day",
    title: "Sintra Half Day",
    subtitle: "O essencial de Sintra em meio dia",
    duration: "5H – 6H",
    description:
      "Palácio de Queluz, Palácio da Pena e o centro histórico de Sintra — tudo com motorista privado e em apenas meio dia.",
    highlights: ["Palácio de Queluz", "Palácio da Pena", "Centro histórico Sintra", "Paragens para fotos"],
    image: "sintra-half-day.jpg",
    accent: "#7dd3f0",
    badge: null,
  },
  {
    id: "aveiro-costa-nova",
    title: "Aveiro & Costa Nova",
    subtitle: "A Veneza portuguesa",
    duration: "7H – 8H",
    description:
      "Canais, Moliceiros coloridos, Ovos Moles e as famosas casas às riscas da Costa Nova. Um dia diferente e cheio de cor.",
    highlights: ["Centro de Aveiro", "Passeio de Moliceiro", "Costa Nova", "Opcional: Farol da Barra"],
    image: "aveiro-costa.jpg",
    accent: "#f0c060",
    badge: null,
  },
  {
    id: "porto-gaia",
    title: "Porto & Gaia",
    subtitle: "A Cidade Invicta e o Vinho do Porto",
    duration: "7H – 8H",
    description:
      "Da Ribeira histórica às caves de Gaia, da Livraria Lello à Ponte Luís I. Um dia inesquecível na capital do norte de Portugal.",
    highlights: ["Ribeira & Ponte Luís I", "Livraria Lello", "Cave Vinho do Porto", "Vila Nova de Gaia"],
    image: "porto-gaia.jpg",
    accent: "#0e81b8",
    badge: null,
  },
];

export function ToursSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="tours"
      className="relative overflow-hidden py-16 md:py-24"
      style={{ backgroundColor: "#f8fafc" }}
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
            gap: 28,
          }}
        >
          {TOURS.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="relative overflow-hidden rounded-2xl block"
              style={{
                height: 420,
                boxShadow: hoveredId === tour.id
                  ? "0 24px 56px rgba(10,45,82,0.28)"
                  : "0 6px 28px rgba(10,45,82,0.12)",
                transform: hoveredId === tour.id ? "translateY(-6px)" : "translateY(0)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                textDecoration: "none",
              }}
              onMouseEnter={() => setHoveredId(tour.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Full-bleed image */}
              <img
                src={`/${tour.image}`}
                alt={tour.title}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: hoveredId === tour.id ? "scale(1.07)" : "scale(1)",
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Gradient overlay — stronger at bottom */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(5,18,40,0.90) 0%, rgba(5,18,40,0.40) 50%, rgba(5,18,40,0.10) 100%)",
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

              {/* Bottom content */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "0 28px 28px",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: "rgba(255,255,255,0.65)", letterSpacing: "0.14em" }}
                >
                  {tour.subtitle}
                </p>
                <h3 className="font-extrabold text-white mb-2" style={{ fontSize: 26, lineHeight: 1.2 }}>
                  {tour.title}
                </h3>
                <div className="flex items-center gap-1.5 mb-5">
                  <Clock size={12} style={{ color: "rgba(255,255,255,0.60)" }} />
                  <span style={{ color: "rgba(255,255,255,0.70)", fontSize: 12, fontWeight: 500 }}>
                    {tour.duration}
                  </span>
                </div>

                <span
                  className="inline-flex items-center gap-2 rounded-xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: hoveredId === tour.id ? "#0e81b8" : "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.30)",
                    color: "#ffffff",
                    padding: "10px 22px",
                    transition: "background-color 0.25s ease",
                  }}
                >
                  Ver tour
                </span>
              </div>
            </Link>
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
