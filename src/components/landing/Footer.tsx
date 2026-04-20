import Image from "next/image";
import Link from "next/link";

const SERVICES_LINKS = [
  { label: "Transfer Aeroporto", href: "#servicos" },
  { label: "Transfer Executivo & Corporativo", href: "#servicos" },
  { label: "Transfer Ponto a Ponto", href: "#servicos" },
  { label: "Chauffeur à Disposição", href: "#servicos" },
  { label: "Tours Privados", href: "#tours" },
  { label: "Eventos & Ocasiões Especiais", href: "#servicos" },
];

const NAV_LINKS = [
  { label: "Serviços", href: "#servicos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Tours", href: "#tours" },
  { label: "Porquê a Wave", href: "#porquewave" },
  { label: "Contacto", href: "#contacto" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: "#0a2d52",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Main footer content */}
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ paddingTop: 64, paddingBottom: 48 }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 40,
          }}
        >
          {/* Brand column */}
          <div className="flex flex-col gap-5" style={{ maxWidth: 280 }}>
            <Image
              src="/logo.png"
              alt="Wave Transport"
              width={148}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7 }}>
              Transporte executivo e experiências privadas em Portugal. Conforto, pontualidade e um serviço altamente personalizado.
            </p>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                style={{
                  backgroundColor: "rgba(125,211,240,0.12)",
                  border: "1px solid rgba(125,211,240,0.25)",
                  color: "#7dd3f0",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#7dd3f0",
                    display: "inline-block",
                  }}
                />
                Disponível 24/7
              </span>
            </div>
          </div>

          {/* Services column */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Serviços
            </h4>
            <ul className="flex flex-col gap-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: "rgba(255,255,255,0.60)",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation column */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Navegação
            </h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    style={{
                      color: "rgba(255,255,255,0.60)",
                      fontSize: 13,
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="flex flex-col gap-4">
            <h4
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Contacto
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/351900000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
              >
                WhatsApp: +351 900 000 000
              </a>
              <a
                href="tel:+351900000000"
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
              >
                Tel: +351 900 000 000
              </a>
              <a
                href="mailto:info@wavetransport.pt"
                style={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 13,
                  textDecoration: "none",
                  transition: "color 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#7dd3f0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.60)")}
              >
                info@wavetransport.pt
              </a>
              <p style={{ color: "rgba(255,255,255,0.40)", fontSize: 12, marginTop: 4 }}>
                Lisboa · Portugal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4"
          style={{ paddingTop: 20, paddingBottom: 24 }}
        >
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>
            © {year} Wave Transport. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              Política de Privacidade
            </Link>
            <Link
              href="/terms"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                textDecoration: "none",
                transition: "color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              Termos e Condições
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
