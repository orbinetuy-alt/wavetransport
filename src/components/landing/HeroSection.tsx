"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const CYCLING_WORDS = [
  "ao Aeroporto",
  "ao seu Hotel",
  "por Lisboa",
  "para Empresas",
];

function CyclingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CYCLING_WORDS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes cycleIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        .cycle-word { display: inline; animation: cycleIn 0.4s ease forwards; }
      `}</style>
      <span key={index} className="cycle-word" style={{ color: "#7dd3f0", fontStyle: "normal" }}>
        {CYCLING_WORDS[index]}
      </span>
    </>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560 }}>

      {/* Background image */}
      <Image
        src="/hero4.jpeg"
        alt="WaveTransports — transporte premium em Lisboa"
        fill
        className="object-cover"
        style={{ objectPosition: "60% 50%" }}
        priority
      />

      {/* Full overlay — stronger on mobile where image is brighter */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(4,14,36,0.82) 0%, rgba(4,14,36,0.55) 50%, rgba(4,14,36,0.15) 100%)" }}
      />
      {/* Top gradient — darkens navbar zone so logo/links are legible */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, rgba(4,14,36,0.60) 0%, transparent 25%)" }}
      />
      {/* Bottom gradient — anchors text area */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(4,14,36,0.80) 0%, rgba(4,14,36,0.20) 30%, transparent 55%)" }}
      />


      {/* Content — bottom-left, clear of navbar */}
      <div
        className="absolute bottom-0 left-0 w-full px-6 sm:px-10 md:px-16 pb-16 sm:pb-20 md:pb-28"
        style={{ maxWidth: "min(680px, 100%)" }}
      >
        {/* Headline */}
        <h1
          className="font-extrabold text-white tracking-tight mb-5"
          style={{ fontSize: "clamp(1.9rem, 6vw, 3.75rem)", lineHeight: 1.1 }}
        >
          <em style={{ fontStyle: "italic" }}>O seu transfer</em>
          <br />
          <CyclingText />
          <br />
          com especialistas.
        </h1>

        <p
          className="mb-8"
          style={{ color: "rgba(255,255,255,0.68)", fontSize: "clamp(0.85rem, 2.5vw, 1rem)", lineHeight: 1.7 }}
        >
          Motoristas profissionais, viaturas premium e pontualidade garantida —
          <br className="hidden sm:block" /> em Lisboa e em todo o Portugal.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="#servicos"
            className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-200"
            style={{ border: "2px solid rgba(255,255,255,0.75)", color: "#ffffff" }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = "#ffffff"; el.style.color = "#0a2d52"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = "transparent"; el.style.color = "#ffffff"; }}
          >
            Ver Transfers
          </Link>
          <Link
            href="#tours"
            className="px-6 py-3 rounded-full text-sm font-bold transition-all duration-200"
            style={{ backgroundColor: "#0e81b8", color: "#ffffff", boxShadow: "0 4px 20px rgba(14,129,184,0.45)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; }}
          >
            Ver Tours
          </Link>
        </div>

      </div>

    </section>
  );
}
