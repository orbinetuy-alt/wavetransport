"use client";

import { useState } from "react";
import { MessageCircle, Mail, Phone, CheckCircle2, Send } from "lucide-react";

const SERVICES = [
  "Transfer Aeroporto",
  "Transfer Executivo & Corporativo",
  "Transfer Ponto a Ponto",
  "Chauffeur à Disposição",
  "Tour Privado – Lisboa",
  "Tour Privado – Sintra & Cascais",
  "Tour Privado – Alentejo & Vinhos",
  "Evento ou Ocasião Especial",
  "Outro",
];

export function ContactoSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    servico: "",
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
    // TODO: replace with real submission (e.g. email API or CRM)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#f0f7ff", paddingTop: 100, paddingBottom: 100 }}
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
            Contacto
          </span>
          <h2
            className="font-extrabold"
            style={{ color: "#0a2d52", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.15 }}
          >
            Solicite o seu orçamento.<br />
            <span style={{ color: "#0e81b8" }}>Resposta rápida, sem compromisso.</span>
          </h2>
          <p
            className="mt-4 text-base max-w-xl mx-auto"
            style={{ color: "#4a6a8a" }}
          >
            Todos os preços são apresentados sob consulta. Diga-nos o que precisa e enviamos uma proposta clara em minutos.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40,
            alignItems: "start",
          }}
        >
          {/* Left — contact info */}
          <div className="flex flex-col gap-6">

            {/* Info cards */}
            {[
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "+351 900 000 000",
                href: "https://wa.me/351900000000",
                color: "#25d366",
                bg: "#e8faf0",
                cta: "Enviar mensagem",
              },
              {
                icon: Phone,
                label: "Telefone",
                value: "+351 900 000 000",
                href: "tel:+351900000000",
                color: "#0e81b8",
                bg: "#e8f4fc",
                cta: "Ligar agora",
              },
              {
                icon: Mail,
                label: "Email",
                value: "info@wavetransport.pt",
                href: "mailto:info@wavetransport.pt",
                color: "#0e4f8a",
                bg: "#e0eef8",
                cta: "Enviar email",
              },
            ].map(({ icon: Icon, label, value, href, color, bg, cta }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl p-5 group"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(14,129,184,0.12)",
                  boxShadow: "0 2px 12px rgba(10,45,82,0.06)",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(10,45,82,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,45,82,0.06)";
                }}
              >
                <div
                  className="shrink-0 flex items-center justify-center rounded-xl"
                  style={{ width: 48, height: 48, backgroundColor: bg }}
                >
                  <Icon size={22} style={{ color }} strokeWidth={1.8} />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <span style={{ color: "#8aa0b8", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {label}
                  </span>
                  <span style={{ color: "#0a2d52", fontSize: 14, fontWeight: 600 }}>{value}</span>
                  <span style={{ color, fontSize: 12, fontWeight: 500 }}>{cta} →</span>
                </div>
              </a>
            ))}

            {/* Trust note */}
            <div
              className="flex items-start gap-3 rounded-2xl p-4"
              style={{
                backgroundColor: "rgba(14,129,184,0.06)",
                border: "1px solid rgba(14,129,184,0.15)",
              }}
            >
              <CheckCircle2 size={18} style={{ color: "#0e81b8", flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#3a5a7a", fontSize: 13, lineHeight: 1.6 }}>
                A nossa equipa responde rapidamente com uma proposta clara, adaptada às suas necessidades — sem obrigações.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, #0e81b8 0%, #0a2d52 100%)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 40px rgba(10,45,82,0.25)",
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
                  Mensagem enviada!
                </h3>
                <p style={{ color: "#4a6a8a", fontSize: 14, maxWidth: 280 }}>
                  Entraremos em contacto consigo em breve com uma proposta personalizada.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ nome: "", email: "", servico: "", data: "", mensagem: "" }); }}
                  style={{ color: "#0e81b8", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer", marginTop: 8 }}
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="font-bold mb-1" style={{ color: "#ffffff", fontSize: 18 }}>
                  Pedido de orçamento
                </h3>

                {/* Nome */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Nome completo *</label>
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
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Email *</label>
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
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Tipo de serviço *</label>
                  <select
                    name="servico"
                    value={form.servico}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, appearance: "auto" }}
                    onFocus={(e) => (e.target.style.borderColor = "#0e81b8")}
                    onBlur={(e) => (e.target.style.borderColor = "#dde3ea")}
                  >
                    <option value="">Selecionar serviço</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Data */}
                <div className="flex flex-col gap-1.5">
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Data prevista</label>
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
                  <label style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Mensagem</label>
                  <textarea
                    name="mensagem"
                    value={form.mensagem}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descreva o que precisa (origem, destino, nº de passageiros...)"
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
                    backgroundColor: loading ? "rgba(255,255,255,0.3)" : "#ffffff",
                    color: loading ? "#ffffff" : "#0a2d52",
                    padding: "13px 20px",
                    fontSize: 15,
                    border: "none",
                    cursor: loading ? "default" : "pointer",
                    transition: "background-color 0.2s ease, transform 0.15s ease",
                    marginTop: 4,
                    fontWeight: 700,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.85)"; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = "#ffffff"; } }}
                >
                  <Send size={16} />
                  {loading ? "A enviar..." : "Enviar pedido"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
