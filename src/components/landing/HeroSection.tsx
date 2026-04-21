"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Users, ArrowRight, Loader2 } from "lucide-react";

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
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        .cycle-word { display: inline-block; animation: cycleIn 0.45s ease forwards; }
      `}</style>
      <span key={index} className="cycle-word" style={{ color: "#7dd3f0" }}>
        {CYCLING_WORDS[index]}
      </span>
    </>
  );
}

export function HeroSection() {
  const [form, setForm] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    passengers: "1",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const el = document.querySelector("#reservar");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setLoading(false);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/hero2.png"
        alt="WaveTransports — transporte premium em Lisboa"
        fill
        className="object-cover"
        style={{ objectPosition: "30% center" }}
        priority
      />

      {/* Left-to-right dark gradient — protects text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, rgba(5,25,55,0.82) 0%, rgba(5,25,55,0.50) 45%, rgba(5,25,55,0.05) 100%)",
        }}
      />

      {/* Top + bottom fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(7,40,80,0.50) 0%, transparent 25%, transparent 75%, rgba(7,40,80,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-28 pb-16"
        style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 60, alignItems: "center" }}
      >
        {/* ── LEFT: headline + trust ── */}
        <div>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold uppercase tracking-widest"
            style={{ backgroundColor: "rgba(14,129,184,0.2)", color: "#7dd3f0", border: "1px solid rgba(14,129,184,0.35)" }}
          >
            ✦ Transporte privado premium · Portugal
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            O seu transfer<br />
            <CyclingText /><br />
            com especialistas.
          </h1>

          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.70)", lineHeight: 1.7, maxWidth: 440 }}>
            Motoristas profissionais, viaturas premium e pontualidade garantida — em Lisboa e em todo o Portugal.
          </p>

          {/* Trust signals */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">500+</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>viagens concluídas</p>
            </div>
            <div className="w-px h-10" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">4.9★</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>avaliação média</p>
            </div>
            <div className="w-px h-10" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
            <div className="text-center">
              <p className="text-2xl font-extrabold text-white">24/7</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>sempre disponível</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: booking form ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "rgba(10,30,60,0.35)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
          }}
        >
          <h3 className="font-bold text-base mb-5" style={{ color: "#ffffff" }}>
            Reserve a sua viagem
          </h3>

          {/* Pickup */}
          <div className="relative mb-3">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#0e81b8" }} />
            <input
              name="pickup"
              value={form.pickup}
              onChange={handleChange}
              required
              placeholder="Local de partida"
              className="w-full pl-8 pr-3 py-3 rounded-xl text-sm border outline-none transition-colors text-white placeholder-white/50"
              style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.10)" }}
            />
          </div>

          {/* Dropoff */}
          <div className="relative mb-3">
            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#10b981" }} />
            <input
              name="dropoff"
              value={form.dropoff}
              onChange={handleChange}
              required
              placeholder="Destino"
              className="w-full pl-8 pr-3 py-3 rounded-xl text-sm border outline-none transition-colors text-white placeholder-white/50"
              style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.10)" }}
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7280" }} />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-2 py-3 rounded-xl text-sm border outline-none transition-colors text-white"
                style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.10)", colorScheme: "dark" }}
              />
            </div>
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 rounded-xl text-sm border outline-none transition-colors text-white"
              style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.10)", colorScheme: "dark" }}
            />
          </div>

          {/* Passengers */}
          <div className="relative mb-5">
            <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#6b7280" }} />
            <select
              name="passengers"
              value={form.passengers}
              onChange={handleChange}
              className="w-full pl-8 pr-2 py-3 rounded-xl text-sm border outline-none transition-colors text-white appearance-none cursor-pointer"
              style={{ borderColor: "rgba(255,255,255,0.20)", backgroundColor: "rgba(255,255,255,0.10)", colorScheme: "dark" }}
            >
              {[1,2,3,4,5,6,7,8].map((n) => (
                <option key={n} value={n}>{n} passageiro{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            style={{ backgroundColor: "#0e81b8" }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Ver disponibilidade
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="text-center text-xs mt-3" style={{ color: "rgba(255,255,255,0.50)" }}>
            Sem compromisso · Confirmação imediata
          </p>
        </form>

      </div>
    </section>
  );
}
