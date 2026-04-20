export type ServiceData = {
  slug: string;
  label: string;
  image: string;
  tagline: string;
  description: string;
  includes: string[];
  extra?: string;
};

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: "transfer-aeroporto",
    label: "Transfer Aeroporto",
    image: "/transfer-aeroporto.jpg",
    tagline: "Chegadas e partidas sem stress, 24 horas por dia.",
    description:
      "O nosso serviço de transfer para o Aeroporto de Lisboa garante pontualidade absoluta e total tranquilidade na sua chegada ou partida. Monitorizamos o seu voo em tempo real e adaptamos o horário automaticamente a qualquer atraso ou adiantamento.",
    includes: [
      "Monitorização de voo em tempo real",
      "Meet & greet personalizado no terminal",
      "Assistência com bagagem",
      "Wi-Fi a bordo",
      "Água e amenities",
      "Disponível 24h, todos os dias do ano",
    ],
  },
  {
    slug: "transfer-executivo",
    label: "Transfer Executivo & Corporativo",
    image: "/transfer-executivo.jpg",
    tagline: "Mobilidade premium para executivos e equipas empresariais.",
    description:
      "Transporte dedicado para profissionais que exigem fiabilidade, discrição e conforto. Os nossos motoristas bilíngues (PT/EN) têm formação em protocolo empresarial e garantem um ambiente focado na produtividade.",
    includes: [
      "Motoristas bilíngues PT/EN",
      "Viaturas de alta gama",
      "Gestão de contas empresariais",
      "Faturação mensal",
      "Planeamento de rotas personalizadas",
      "Acompanhamento de agendas",
    ],
  },
  {
    slug: "transfer-ponto-a-ponto",
    label: "Transfer Ponto a Ponto",
    image: "/transfer-ponto-a-ponto.jpeg",
    tagline: "Viagens privadas entre cidades, preço fixo, sem surpresas.",
    description:
      "Transporte privado de longa distância entre qualquer ponto de Portugal. Aeroportos, hotéis, portos de cruzeiro, estações ferroviárias — chegamos onde precisar, com conforto e pontualidade garantidos.",
    includes: [
      "Cobertura em todo o território português",
      "Lisboa, Porto, Algarve, Alentejo e mais",
      "Preço fixo acordado antecipadamente",
      "Possibilidade de paragens intermédias",
      "Viatura privada e exclusiva",
      "Reserva rápida online",
    ],
  },
  {
    slug: "chauffeur-disposicao",
    label: "Chauffeur à Disposição",
    image: "/chauffeur-disposicao.jpeg",
    tagline: "O seu motorista dedicado, pelo tempo que precisar.",
    description:
      "Contrate a nossa viatura com motorista pelo tempo que necessitar — horas, meio dia ou dia completo. Ideal para dias com múltiplos compromissos, eventos ou para explorar a cidade ao seu ritmo, sem preocupações.",
    includes: [
      "Motorista exclusivo pelo tempo contratado",
      "Itinerário 100% flexível",
      "Ajuste de rotas em tempo real",
      "Ideal para eventos, compras ou reuniões",
      "Meio dia ou dia completo",
      "Reserva com antecedência ou de última hora",
    ],
  },
  {
    slug: "tours-privados",
    label: "Tours Privados em Portugal",
    image: "/tours-privados.jpg",
    tagline: "Experiências exclusivas, desenhadas à sua medida.",
    description:
      "Descubra Portugal com total privacidade e conforto. Os nossos tours privados incluem roteiros à medida, motoristas locais experientes e total flexibilidade de horário. De Lisboa a Sintra, dos vinhos do Alentejo às praias do Algarve.",
    includes: [
      "Lisboa Privada — meio dia ou dia completo",
      "Sintra & Cascais — Palácio da Pena, Quinta da Regaleira, Cascais, Cabo da Roca",
      "Alentejo & Vinhos — Évora, Monsaraz, prova de vinhos, almoço típico",
      "Roteiro personalizado à escolha",
      "Motorista local com conhecimento aprofundado",
      "Total flexibilidade de horário",
    ],
  },
  {
    slug: "eventos-especiais",
    label: "Eventos & Ocasiões Especiais",
    image: "/eventos-especiais.jpg",
    tagline: "Cada ocasião merece um serviço à sua altura.",
    description:
      "Transporte dedicado para os momentos mais importantes: casamentos, jantares de gala, eventos corporativos e experiências exclusivas. Garantimos uma apresentação impecável, total discrição e um serviço memorável do início ao fim.",
    includes: [
      "Casamentos e cerimónias",
      "Jantares de gala e eventos privados",
      "Eventos corporativos e lançamentos",
      "Motoristas com formação em protocolo",
      "Apresentação profissional e impecável",
      "Total confidencialidade",
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}
