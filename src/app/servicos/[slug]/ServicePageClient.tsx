"use client";

import { useState } from "react";
import { CheckCircle2, Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ServiceData } from "./data";

const ALL_SERVICES = [
  "Transfer Aeroporto",
  "Transfer Executivo & Corporativo",
  "Transfer Ponto a Ponto",
  "Chauffeur à Disposição",
  "Tours Privados em Portugal",
  "Eventos & Ocasiões Especiais",
];

export function ServicePageClient({ service }: { service: ServiceData }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    servico: service.label,
    data: "",
    mensagem: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid #dde3ea",
    backgroundColor: "#f8fafc",
    color: "#0a2d52",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ height: "55vh", minHeight: 380 }}
      >
        {/* Background image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${service.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(8,20,40,0.85) 0%, rgba(8,20,40,0.3) 55%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <Link
          href="/#servicos"
          className="absolute flex items-center gap-2"
          style={{
            top: 24,
            left: 32,
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
        <div className="relative z-10 max-w-5xl mx-auto px-8 pb-12 w-full">
          <h1
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            {service.label}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, marginTop: 10 }}>
            {service.tagline}
          </p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section style={{ backgroundColor: "#f8fafc", paddingTop: 72, paddingBottom: 100 }}>
        <div
          className="max-w-5xl mx-auto px-6"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left — service info */}
          <div className="flex flex-col gap-8">
            <div>
              <span
                className="inline-block text-xs font-bold uppercase mb-4 px-3 py-1 rounded-full"
                style={{
                  color: "#0e81b8",
                  backgroundColor: "rgba(14,129,184,0.10)",
                  border: "1px solid rgba(14,129,184,0.25)",
                  letterSpacing: "0.18em",
                }}
              >
                Sobre este serviço
              </span>
              <h2
                className="font-bold"
                style={{ color: "#0a2d52", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", lineHeight: 1.3 }}
              >
                O que está incluído
              </h2>
              <p
                className="mt-4 leading-relaxed"
                style={{ color: "#4a6a8a", fontSize: 15 }}
              >
                {service.description}
              </p>
            </div>

            {/* Includes list */}
            <div
              className="flex flex-col gap-3 rounded-2xl p-6"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid rgba(14,129,184,0.12)",
                boxShadow: "0 2px 16px rgba(10,45,82,0.06)",
              }}
            >
              <h3 className="font-bold mb-1" style={{ color: "#0a2d52", fontSize: 15 }}>
                Incluído neste serviço:
              </h3>
              {service.includes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={17}
                    style={{ color: "#0e81b8", flexShrink: 0, marginTop: 1 }}
                  />
                  <span style={{ color: "#3a5a7a", fontSize: 14, lineHeight: 1.5 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing note */}
            <div
              className="flex items-start gap-3 rounded-2xl p-5"
              style={{
                backgroundColor: "rgba(14,129,184,0.06)",
                border: "1px solid rgba(14,129,184,0.18)",
              }}
            >
              <span style={{ fontSize: 22 }}>💬</span>
              <div>
                <p className="font-semibold" style={{ color: "#0a2d52", fontSize: 14 }}>
                  Preços sob consulta
                </p>
                <p style={{ color: "#4a6a8a", fontSize: 13, lineHeight: 1.6, marginTop: 2 }}>
                  Cada serviço é adaptado às suas necessidades. Preencha o formulário e receba uma proposta clara e sem compromisso.
                </p>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid rgba(14,129,184,0.12)",
              boxShadow: "0 4px 24px rgba(10,45,82,0.08)",
              position: "sticky",
              top: 100,
            }}
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 64, height: 64, backgroundColor: "#e8f4fc" }}
                >
                  <CheckCircle2 size={32} style={{ color: "#0e81b8" }} />
                </div>
                <h3 className="font-bold" style={{ color: "#0a2d52", fontSize: 20 }}>
                  Pedido enviado!
                </h3>
                <p style={{ color: "#4a6a8a", fontSize: 14, maxWidth: 260 }}>
                  Entraremos em contacto em breve com uma proposta personalizada.
                </p>
                <button
                  onClick={() => setSent(false)}
                  style={{ color: "#0e81b8", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer", marginTop: 8 }}
                >
                  Enviar outro pedido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <h3 className="font-bold" style={{ color: "#0a2d52", fontSize: 18 }}>
                    Solicitar orçamento
                  </h3>
                  <p style={{ color: "#8aa0b8", fontSize: 13, marginTop: 2 }}>
                    Resposta rápida, sem compromisso.
                  </p>
                </div>

                {/* Nome */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "#4a6a8a", fontSize: 13, fontWeight: 500 }}>Nome completo *</label>
                  <input
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    required
                    placeholder="O seu nome"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "#4a6a8a", fontSize: 13, fontWeight: 500 }}>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@exemplo.com"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  />
                </div>

                {/* Serviço */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "#4a6a8a", fontSize: 13, fontWeight: 500 }}>Serviço</label>
                  <select
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    style={{ ...inputStyle, appearance: "auto" }}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  >
                    {ALL_SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "#4a6a8a", fontSize: 13, fontWeight: 500 }}>Data prevista</label>
                  <input
                    type="date"
                    name="data"
                    value={form.data}
                    onChange={handleChange}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  />
                </div>

                {/* Mensagem */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "#4a6a8a", fontSize: 13, fontWeight: 500 }}>Mensagem</label>
                  <textarea
                    name="mensagem"
                    value={form.mensagem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Origem, destino, nº de passageiros..."
                    style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl font-semibold text-white"
                  style={{
                    backgroundColor: loading ? "#6a9ab8" : "#0a2d52",
                    padding: "13px 20px",
                    fontSize: 15,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    transition: "background-color 0.2s ease",
                    marginTop: 4,
                  }}
                  onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#0e81b8"; }}
                  onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#0a2d52"; }}
                >
                  <Send size={16} />
                  {loading ? "A enviar..." : "Enviar pedido"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
