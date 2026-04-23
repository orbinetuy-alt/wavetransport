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
  {
    slug: "fatima-nazare-obidos",
    label: "Fátima, Nazaré & Óbidos",
    image: "/nazare.jpg",
    tagline: "Fé, oceano e história medieval num só dia.",
    duration: "10H – 11H",
    description:
      "Um dia que combina espiritualidade, natureza selvagem e charme medieval. Do Santuário de Fátima às ondas gigantes de Nazaré, terminando nas muralhas douradas de Óbidos — uma experiência verdadeiramente portuguesa.",
    includes: [
      "Santuário de Fátima (tempo livre)",
      "Nazaré: Sítio, Farol e descida à vila",
      "Almoço em Nazaré incluído",
      "Óbidos: Muralhas, Rua Direita e tempo livre",
      "Opcional: Mosteiro da Batalha",
      "Motorista dedicado durante todo o percurso",
    ],
  },
  {
    slug: "sintra-half-day",
    label: "Sintra Half Day",
    image: "/sintra-half-day.jpg",
    tagline: "Os palácios mais icónicos de Sintra em meio dia.",
    duration: "5H – 6H",
    description:
      "A versão essencial de Sintra para quem tem menos tempo mas não quer perder o melhor. Palácio de Queluz, Palácio da Pena e o centro histórico de Sintra — tudo com motorista privado e total comodidade.",
    includes: [
      "Palácio de Queluz e jardins",
      "Palácio da Pena (exterior e jardins)",
      "Centro Histórico de Sintra (Patrimônio UNESCO)",
      "Paragens para fotos nos melhores pontos",
      "Motorista privado durante todo o percurso",
      "Viatura de alta gama com Wi-Fi",
    ],
  },
  {
    slug: "aveiro-costa-nova",
    label: "Aveiro & Costa Nova",
    image: "/aveiro-costa.jpg",
    tagline: "A Veneza portuguesa e as casas às riscas da Costa Nova.",
    duration: "7H – 8H",
    description:
      "Aveiro surpreende com os seus canais, barcos Moliceiros coloridos e os famosos Ovos Moles. A Costa Nova encanta com as pitorescas casas às riscas junto ao Atlântico. Um dia diferente, cheio de cor e autenticidade.",
    includes: [
      "Centro de Aveiro e canais da Ria",
      "Passeio de Moliceiro pelos canais",
      "Tempo livre para Ovos Moles e almoço",
      "Costa Nova: casas às riscas e paragem para fotos",
      "Opcional: Praia da Barra e Farol da Barra",
      "Motorista dedicado durante todo o dia",
    ],
  },
  {
    slug: "porto-gaia",
    label: "Porto & Gaia",
    image: "/porto-gaia.jpg",
    tagline: "A Cidade Invicta, o Douro e os segredos do Vinho do Porto.",
    duration: "7H – 8H",
    description:
      "Porto é uma das cidades mais bonitas da Europa e merece ser vivida com calma. Da Ribeira histórica às caves de Vinho do Porto em Gaia, da Livraria Lello à vista da Ponte Luís I — um dia inesquecível na capital do norte.",
    includes: [
      "Estação de São Bento e azulejos históricos",
      "Sé do Porto e Torre dos Clérigos",
      "Livraria Lello (parada exterior ou visita)",
      "Ribeira do Porto e Ponte Luís I",
      "Vila Nova de Gaia: cave de Vinho do Porto ou WOW",
      "Opcional: Jardim do Morro e Teleférico de Gaia",
    ],
  },
];

export function getTourBySlug(slug: string): TourData | undefined {
  return TOURS_DATA.find((t) => t.slug === slug);
}
