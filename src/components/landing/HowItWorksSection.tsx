import { ClipboardList, CheckCircle, Car } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Faça a sua reserva",
    description:
      "Preencha o formulário com o local de partida, destino, data, hora e número de passageiros. Simples e rápido.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Confirmação imediata",
    description:
      "Receberá uma confirmação por email com todos os detalhes da sua viagem. Sem surpresas, sem esperas.",
  },
  {
    number: "03",
    icon: Car,
    title: "Desfrute da viagem",
    description:
      "O seu condutor chega pontualmente ao local combinado. Relaxe e chegue ao destino com conforto e estilo.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="como-funciona"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0d4a8a", paddingTop: 100, paddingBottom: 100 }}
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/como-funciona.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
        }}
      />

      {/* Gradient transition — top (from ServicesSection white) */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0"
        style={{
          height: 100,
          background: "linear-gradient(to bottom, #f8fafc 0%, transparent 100%)",
          zIndex: 2,
        }}
      />

      {/* Gradient transition — bottom (to ToursSection white) */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0"
        style={{
          height: 100,
          background: "linear-gradient(to bottom, transparent 0%, #f8fafc 100%)",
          zIndex: 2,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-xs font-bold uppercase mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#7dd3f0",
              backgroundColor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.20)",
              letterSpacing: "0.18em",
            }}
          >
            Como funciona
          </span>
          <h2
            className="font-extrabold"
            style={{ color: "#ffffff", fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)", lineHeight: 1.15 }}
          >
            Reservar é simples.<br />
            <span style={{ color: "#7dd3f0" }}>Viajar é premium.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute"
            style={{
              top: 40,
              left: "16.66%",
              right: "16.66%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.20)",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 40,
            }}
          >
            {STEPS.map(({ number, icon: Icon, title, description }) => (
              <div key={number} className="flex flex-col items-center text-center gap-5">

                {/* Circle */}
                <div
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    border: "2px solid rgba(255,255,255,0.35)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Icon size={28} style={{ color: "#ffffff" }} strokeWidth={1.5} />
                  <span
                    className="absolute font-extrabold"
                    style={{
                      top: -10,
                      right: -10,
                      fontSize: 11,
                      lineHeight: 1,
                      padding: "3px 7px",
                      borderRadius: 999,
                      backgroundColor: "#7dd3f0",
                      color: "#0a2d52",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {number}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="font-bold" style={{ color: "#ffffff", fontSize: 17 }}>{title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.65, maxWidth: 240, margin: "0 auto" }}>
                    {description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#reservar"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 36px",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              backgroundColor: "#ffffff",
              color: "#0d4a8a",
              boxShadow: "0 8px 32px rgba(0,0,0,0.20)",
            }}
          >
            Reservar agora
          </a>
        </div>

      </div>
    </section>
  );
}
