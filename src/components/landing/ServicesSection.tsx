"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    label: "Transfer Aeroporto",
    tag: "Mais popular",
    image: "/transfer-aeroporto.jpg",
    href: "/servicos/transfer-aeroporto",
  },
  {
    label: "Transfer Executivo & Corporativo",
    tag: null,
    image: "/transfer-executivo.jpg",
    href: "/servicos/transfer-executivo",
  },
  {
    label: "Transfer Ponto a Ponto",
    tag: null,
    image: "/transfer-ponto-a-ponto.jpeg",
    href: "/servicos/transfer-ponto-a-ponto",
  },
  {
    label: "Chauffeur à Disposição",
    tag: null,
    image: "/chauffeur-disposicao.jpeg",
    href: "/servicos/chauffeur-disposicao",
  },
  {
    label: "Tours Privados em Portugal",
    tag: null,
    image: "/tours-privados.jpg",
    href: "/servicos/tours-privados",
  },
  {
    label: "Eventos & Ocasiões Especiais",
    tag: null,
    image: "/eventos-especiais.jpg",
    href: "/servicos/eventos-especiais",
  },
];

const CARD_WIDTH = 340;
const CARD_GAP = 20;

export function ServicesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? CARD_WIDTH + CARD_GAP : -(CARD_WIDTH + CARD_GAP),
      behavior: "smooth",
    });
  }

  return (
    <section
      id="servicos"
      style={{ backgroundColor: "#f8fafc", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase mb-3 px-3 py-1 rounded-full"
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
              style={{ color: "#0a2d52", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15 }}
            >
              Mobilidade premium,<br />
              <span style={{ color: "#0e81b8" }}>para cada ocasião.</span>
            </h2>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Anterior"
              className="flex items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "#ffffff",
                border: "1px solid #dde3ea",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(10,45,82,0.08)",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0a2d52";
                e.currentTarget.style.borderColor = "#0a2d52";
                (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.borderColor = "#dde3ea";
                (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#0a2d52";
              }}
            >
              <ChevronLeft size={20} style={{ color: "#0a2d52", transition: "color 0.2s" }} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Próximo"
              className="flex items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                backgroundColor: "#0a2d52",
                border: "1px solid #0a2d52",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(10,45,82,0.18)",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#0e81b8"; e.currentTarget.style.borderColor = "#0e81b8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#0a2d52"; e.currentTarget.style.borderColor = "#0a2d52"; }}
            >
              <ChevronRight size={20} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex"
          style={{
            gap: CARD_GAP,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingBottom: 8,
          }}
        >
          {SERVICES.map(({ label, tag, image, href }) => (
            <Link
              key={label}
              href={href}
              style={{
                flexShrink: 0,
                width: "min(340px, calc(85vw))",
                height: 420,
                borderRadius: 20,
                overflow: "hidden",
                scrollSnapAlign: "start",
                display: "block",
                textDecoration: "none",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector(".card-image") as HTMLElement;
                if (img) img.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector(".card-image") as HTMLElement;
                if (img) img.style.transform = "scale(1)";
              }}
            >
              {/* Background image */}
              <div
                className="card-image"
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 0.5s ease",
                }}
              />

              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(8,20,40,0.85) 0%, rgba(8,20,40,0.3) 50%, transparent 100%)",
                }}
              />

              {/* Tag */}
              {tag && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    backgroundColor: "#0e81b8",
                    color: "#ffffff",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "4px 10px",
                    borderRadius: 999,
                  }}
                >
                  {tag}
                </div>
              )}

              {/* Bottom content */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "24px 24px 28px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <h3
                  style={{
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                >
                  {label}
                </h3>
                <div
                  className="explore-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    color: "#ffffff",
                    fontSize: 13,
                    fontWeight: 600,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 999,
                    padding: "7px 16px",
                    width: "fit-content",
                    backdropFilter: "blur(4px)",
                    transition: "background-color 0.2s ease",
                  }}
                >
                  Explorar
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Gradient transition to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: 120,
          background: "linear-gradient(to bottom, transparent 0%, #0d4a8a 100%)",
        }}
      />
    </section>
  );
}
