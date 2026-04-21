export type TourData = {
  slug: string;
  label: string;
  image: string;
  tagline: string;
  description: string;
  includes: string[];
  duration: string;
};

export const TOURS_DATA: TourData[] = [
  {
    slug: "lisboa",
    label: "Lisboa Privada",
    image: "/tour-lisboa.webp",
    tagline: "A cidade a seu ritmo, com motorista dedicado e total flexibilidade.",
    duration: "Meio dia ou dia completo",
    description:
      "Descubra Lisboa de forma exclusiva, com um motorista local que conhece cada detalhe da cidade. De Alfama ao Chiado, dos Miradouros a Belém — o roteiro é seu, o conforto é nosso. Paramos onde quiser, ao ritmo que preferir.",
    includes: [
      "Motorista local experiente e dedicado",
      "Alfama, Miradouros e Castelo de São Jorge",
      "Belém: Torre, Mosteiro dos Jerónimos e Pastéis",
      "Chiado, Baixa e Praça do Comércio",
      "Paragens livres a qualquer momento",
      "Viatura privada de alta gama com Wi-Fi",
    ],
  },
  {
    slug: "sintra",
    label: "Sintra & Cascais",
    image: "/tour-sintrajpg.jpg",
    tagline: "Palácios, mistério e mar num único dia inesquecível.",
    duration: "Dia completo",
    description:
      "Um percurso icónico pela Serra de Sintra e pela costa atlântica de Cascais. Paisagens únicas no mundo, palácios de conto de fadas e história a cada curva da estrada. Uma experiência que fica para sempre.",
    includes: [
      "Palácio da Pena e Jardins da Pena",
      "Quinta da Regaleira e túneis iniciáticos",
      "Centro histórico de Sintra (Patrimônio UNESCO)",
      "Cascais: marina, centro e praia",
      "Cabo da Roca — o ponto mais a oeste da Europa (opcional)",
      "Tempo livre para refeição e compras",
    ],
  },
  {
    slug: "alentejo",
    label: "Alentejo & Vinhos",
    image: "/tour-alentejo.jpg",
    tagline: "Planície infinita, sabores autênticos e vinhos premiados.",
    duration: "Dia completo",
    description:
      "Mergulhe na autenticidade do Alentejo: aldeias medievais com muralhas de séculos, vinhas que se perdem no horizonte e uma gastronomia que conta a história de um povo. Um dia que acalma, surpreende e satisfaz.",
    includes: [
      "Évora: Catedral, Templo Romano e centro histórico (UNESCO)",
      "Monsaraz: aldeia medieval sobre a planície",
      "Visita a adega local com prova de vinhos alentejanos",
      "Almoço típico alentejano incluído",
      "Cromeleque dos Almendres (megalítico pré-histórico)",
      "Motorista local com conhecimento profundo da região",
    ],
  },
];

export function getTourBySlug(slug: string): TourData | undefined {
  return TOURS_DATA.find((t) => t.slug === slug);
}
