"use client";

import { Wifi, ShieldCheck, Globe, Clock, Languages, Star } from "lucide-react";

const FEATURES = [
  {
    icon: Clock,
    title: "Disponível 24 horas",
    description: "Serviço ininterrupto todos os dias do ano. Chegadas tardias, partidas de madrugada — estamos sempre presentes.",
  },
  {
    icon: ShieldCheck,
    title: "Pontualidade garantida",
    description: "Monitorizamos voos e tráfego em tempo real. O motorista chega antes de si — sempre.",
  },
  {
    icon: Languages,
    title: "Motoristas bilíngues PT/EN",
    description: "Comunicação fluente em português e inglês. Formação em protocolo e apresentação profissional.",
  },
  {
    icon: Wifi,
    title: "Wi-Fi & Amenities a bordo",
    description: "Viaje conectado. Água, amenities e conforto premium em todas as viaturas de alta gama.",
  },
  {
    icon: ShieldCheck,
    title: "Total confidencialidade",
    description: "Discrição absoluta em cada serviço. O que acontece na viatura, fica na viatura.",
  },
  {
    icon: Globe,
    title: "Cobertura em todo Portugal",
    description: "Lisboa, Porto, Algarve, Alentejo e todo o território nacional. Uma só empresa, onde precisar.",
  },
];

export function WhyWaveSection() {
  return (
    <section
      id="porquewave"
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        background: "linear-gradient(160deg, #0a2d52 0%, #0e4f8a 60%, #0e81b8 100%)",
      }}
    >
      {/* Wave blob — left */}
      <svg
        className="pointer-events-none absolute"
        style={{ top: 0, left: 0, height: "100%", width: "auto", opacity: 0.18 }}
        viewBox="0 0 220 800"
        preserveAspectRatio="xMinYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-60,0 C20,80 -30,160 30,260 C90,360 -20,420 20,520 C60,620 -40,700 -60,800 L-200,800 L-200,0 Z"
          fill="white"
        />
        <path
          d="M-20,0 C60,100 10,200 70,300 C130,400 20,460 60,560 C100,660 0,740 -20,800 L-200,800 L-200,0 Z"
          fill="white"
          opacity="0.5"
        />
      </svg>

      {/* Wave blob — right */}
      <svg
        className="pointer-events-none absolute"
        style={{ top: 0, right: 0, height: "100%", width: "auto", opacity: 0.18 }}
        viewBox="0 0 220 800"
        preserveAspectRatio="xMaxYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M280,0 C200,80 250,160 190,260 C130,360 240,420 200,520 C160,620 260,700 280,800 L420,800 L420,0 Z"
          fill="white"
        />
        <path
          d="M240,0 C160,100 210,200 150,300 C90,400 200,460 160,560 C120,660 220,740 240,800 L420,800 L420,0 Z"
          fill="white"
          opacity="0.5"
        />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#7dd3f0",
              backgroundColor: "rgba(125,211,240,0.12)",
              border: "1px solid rgba(125,211,240,0.3)",
              letterSpacing: "0.18em",
            }}
          >
            Porquê a Wave Transport
          </span>
          <h2
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            Mais do que transporte —<br />
            <span style={{ color: "#7dd3f0" }}>uma experiência consistente.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Cada detalhe pensado para que a sua viagem seja confortável, segura e impecável, do início ao fim.
          </p>
        </div>

        {/* Features grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: 20,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-2xl p-6"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                backdropFilter: "blur(8px)",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.10)";
                e.currentTarget.style.borderColor = "rgba(125,211,240,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              }}
            >
              {/* Icon */}
              <div
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(125,211,240,0.15)",
                  border: "1px solid rgba(125,211,240,0.25)",
                }}
              >
                <Icon size={22} style={{ color: "#7dd3f0" }} strokeWidth={1.8} />
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-white" style={{ fontSize: 15 }}>{title}</h3>
                <p style={{ color: "rgba(255,255,255,0.60)", fontSize: 13, lineHeight: 1.6 }}>
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div
          className="mt-14 flex flex-wrap items-center justify-center gap-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 40 }}
        >
          {[
            { value: "24/7", label: "Disponibilidade" },
            { value: "100%", label: "Privado & Dedicado" },
            { value: "PT · EN", label: "Idiomas" },
            { value: "5★", label: "Serviço premium" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-extrabold" style={{ color: "#7dd3f0", fontSize: 28, lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, marginTop: 4, letterSpacing: "0.05em" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
