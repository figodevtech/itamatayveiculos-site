import {
  ShieldCheck,
  Coins,
  Compass,
  Car,
  Flame,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  Award,
  Headphones,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface InsuranceBenefit {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface InsuranceCoverage {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status: "sample" | "confirmed";
  tag: string;
}

export interface InsuranceDifferential {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface InsuranceStep {
  number: string;
  title: string;
  description: string;
}

export interface InsuranceFaqItem {
  question: string;
  answer: string;
}

export const INSURANCE_CONTACT = {
  // Configurable contact phone number, with fallback to primary Itamatay commercial line
  phone: process.env.NEXT_PUBLIC_INSURANCE_WHATSAPP_PHONE || "5583981415579",
  defaultMessage:
    "Olá! Conheci a oferta de Seguro Auto pelo site da Itamatay e gostaria de saber mais sobre as opções e solicitar uma cotação.",
};

export const INSURANCE_MESSAGES = {
  hero: "Olá! Conheci a oferta de Seguro Auto pelo site da Itamatay e gostaria de saber mais sobre as opções e solicitar uma cotação.",
  benefits:
    "Olá! Vi os benefícios do Seguro Auto no site da Itamatay e gostaria de solicitar uma cotação para o meu veículo.",
  coverages:
    "Olá! Gostaria de consultar as coberturas disponíveis no Seguro Auto e solicitar uma cotação personalizada.",
  differentials:
    "Olá! Gostaria de entender melhor as opções de proteção veicular oferecidas pela Itamatay.",
  steps:
    "Olá! Gostaria de iniciar minha cotação de Seguro Auto com a equipe da Itamatay.",
  callout:
    "Olá! Gostaria de falar com um consultor sobre as opções de Seguro Auto para proteger meu carro.",
  faq: "Olá! Estive lendo o FAQ de Seguro Auto no site da Itamatay e ainda tenho algumas dúvidas para solicitar minha cotação.",
  final:
    "Olá! Vim da página de Seguro Auto da Itamatay e gostaria de solicitar uma cotação para o meu veículo.",
  mobileBar:
    "Olá! Gostaria de solicitar uma cotação rápida de Seguro Auto pelo site da Itamatay.",
};

export function getInsuranceWhatsAppUrl(
  message: string = INSURANCE_CONTACT.defaultMessage
): string {
  const phone = INSURANCE_CONTACT.phone.replace(/\D/g, "");
  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;
}

export const insuranceBenefits: InsuranceBenefit[] = [
  {
    id: "finance",
    title: "Menor exposição financeira",
    description:
      "Auxilia na redução de custos imprevistos com reparos ou indenizações em caso de acidentes e sinistros cobertos pela apólice.",
    icon: Coins,
  },
  {
    id: "peace-of-mind",
    title: "Mais tranquilidade no dia a dia",
    description:
      "Dirija na cidade ou na estrada com o conforto e a segurança de contar com uma retaguarda pensada para você e sua família.",
    icon: ShieldCheck,
  },
  {
    id: "assistance",
    title: "Assistência quando precisar",
    description:
      "Possibilidade de acionar suporte emergencial como reboque, socorro mecânico e chaveiro, conforme as condições contratadas.",
    icon: Compass,
  },
  {
    id: "patrimony",
    title: "Proteção do seu patrimônio",
    description:
      "Ajuda a preservar o valor do seu bem conquistado contra adversidades cotidianas, de acordo com o plano contratado.",
    icon: Car,
  },
];

export const insuranceCoverages: InsuranceCoverage[] = [
  {
    id: "collision",
    title: "Colisão e acidentes",
    description:
      "Proteção para danos parciais ou integrais decorrentes de batidas, abalroamentos ou capotamento, conforme limites estipulados na apólice.",
    icon: Car,
    status: "sample",
    tag: "Sob consulta",
  },
  {
    id: "theft",
    title: "Roubo e furto",
    description:
      "Cobertura para subtração total ou danos causados por tentativa de roubo ou furto do veículo elegível nos termos do plano contratado.",
    icon: Flame,
    status: "sample",
    tag: "Sob consulta",
  },
  {
    id: "third-party",
    title: "Danos a terceiros (RCF-V)",
    description:
      "Proteção para indenização de danos materiais e corporais involuntários causados a terceiros em acidentes de trânsito.",
    icon: Users,
    status: "sample",
    tag: "Sob consulta",
  },
  {
    id: "assistance-24h",
    title: "Assistência 24 horas",
    description:
      "Serviços de socorro emergencial como guincho com raio de km definido, troca de pneus, carga de bateria e chaveiro emergencial.",
    icon: Clock,
    status: "sample",
    tag: "Sob consulta",
  },
  {
    id: "glass",
    title: "Cobertura de vidros e faróis",
    description:
      "Possibilidade de reparo ou troca de para-brisa, vidros laterais, traseiros, retrovisores, faróis e lanternas conforme cobertura contratada.",
    icon: Sparkles,
    status: "sample",
    tag: "Sob consulta",
  },
  {
    id: "replacement-car",
    title: "Carro reserva",
    description:
      "Disponibilização de veículo temporário de locadora parceira pelo período estipulado enquanto seu veículo passa por reparos cobertos.",
    icon: RefreshCw,
    status: "sample",
    tag: "Sob consulta",
  },
];

export const itamatayDifferentials: InsuranceDifferential[] = [
  {
    id: "consultative",
    title: "Atendimento consultivo e transparente",
    description:
      "Nossa equipe ouve suas necessidades e explica com clareza as características de cada cobertura para que você tome a melhor decisão.",
    icon: Headphones,
  },
  {
    id: "speed",
    title: "Praticidade e contato direto via WhatsApp",
    description:
      "Sem burocracias ou formulários longos para dar o primeiro passo: converse em tempo real com consultores prontos para ajudar.",
    icon: CheckCircle2,
  },
  {
    id: "market-knowledge",
    title: "Conhecimento do segmento automotivo",
    description:
      "Entendemos profundamente sobre modelos, custos de manutenção e perfis de veículos para orientar uma proteção condizente.",
    icon: Award,
  },
  {
    id: "convenience",
    title: "Conveniência e segurança de marca",
    description:
      "A facilidade de se informar sobre a proteção veicular com a mesma seriedade e credibilidade que você já conhece na Itamatay Veículos.",
    icon: FileCheck,
  },
];

export const insuranceSteps: InsuranceStep[] = [
  {
    number: "01",
    title: "Entre em contato",
    description:
      "Clique no botão de WhatsApp e inicie uma conversa com a nossa equipe comercial sem compromisso.",
  },
  {
    number: "02",
    title: "Conheça as opções",
    description:
      "Receba informações claras sobre as coberturas disponíveis, franquias, assistências e valores estimados de cotação.",
  },
  {
    number: "03",
    title: "Escolha sua proteção",
    description:
      "Avalie as condições com calma e prossiga para a formalização da proposta pelos canais autorizados caso decida contratar.",
  },
];

export const insuranceFaq: InsuranceFaqItem[] = [
  {
    question: "Por que contratar um seguro automotivo?",
    answer:
      "O seguro automotivo é a maneira mais eficiente de proteger seu investimento e seu orçamento contra imprevistos de trânsito, roubo, furto ou danos causados a terceiros. Em vez de arcar sozinho com despesas não planejadas de grande porte, você conta com o suporte financeiro e assistencial contratado na apólice.",
  },
  {
    question: "Quais coberturas estão disponíveis?",
    answer:
      "As coberturas variam conforme a proposta e a seguradora parceira contratada. Entre as mais comuns estão colisão, roubo e furto, responsabilidade civil por danos a terceiros, assistência 24 horas (guincho, chaveiro, socorro mecânico), proteção para vidros e carro reserva. Consulte nossa equipe para ver as opções detalhadas para seu veículo.",
  },
  {
    question: "Como posso solicitar uma cotação?",
    answer:
      "O processo é simples e rápido: clique em qualquer um dos botões desta página para falar com nossos consultores pelo WhatsApp. Basta informar os dados básicos do seu veículo (marca, modelo, ano) e algumas informações de perfil de condução para receber orientações e estimativas de valores.",
  },
  {
    question: "O que influencia o preço do seguro?",
    answer:
      "O cálculo do prêmio é feito pelas seguradoras com base em critérios técnicos e estatísticos: modelo e ano do veículo, índice de sinistralidade da região, perfil do condutor principal (idade, estado civil), histórico de sinistros anteriores e finalidade de uso do automóvel (lazer, deslocamento diário ou comercial).",
  },
  {
    question: "Como funciona a franquia?",
    answer:
      "A franquia é a coparticipação financeira estipulada em contrato paga pelo segurado apenas em casos de sinistro com perda parcial (por exemplo, quando o carro sofre um conserto de lataria). Em sinistros de indenização integral (perda total ou roubo sem recuperação), não há cobrança de franquia.",
  },
  {
    question: "Como funciona a assistência em caso de imprevisto?",
    answer:
      "Se sua apólice incluir assistência 24 horas, você poderá acionar a central da seguradora a qualquer hora do dia ou da noite para serviços emergenciais, como envio de guincho, socorro mecânico ou elétrico, chaveiro e troca de pneu, conforme as regras de raio e limites da apólice contratada.",
  },
  {
    question:
      "O seguro pode ser contratado para um veículo que não foi comprado na Itamatay?",
    answer:
      "Sim! A apresentação da solução e a solicitação de cotação de Seguro Auto podem ser feitas tanto para veículos adquiridos recentemente na Itamatay Veículos quanto para veículos que você já possui em sua garagem ou comprou em outro local. Converse com nossos consultores para cotar.",
  },
];

export const INSURANCE_LEGAL_NOTE =
  "Coberturas, valores, franquias, assistências e condições sujeitos ao produto contratado e às condições da apólice emitida por seguradora autorizada pela SUSEP.";

export const INSURANCE_LEGAL_DISCLAIMER =
  "A Itamatay Veículos atua na divulgação e facilitação do contato comercial para soluções de seguro automotivo junto a parceiros do mercado. A aceitação do risco, emissão de apólice e liquidação de sinistros são de responsabilidade exclusiva da entidade seguradora legalmente autorizada.";

/**
 * Informações comerciais pendentes de validação comercial:
 * 1. Razão social e número de registro SUSEP da corretora/seguradora parceira oficial.
 * 2. Número de WhatsApp exclusivo do setor de seguros (atualmente operando com a linha comercial oficial Itamatay como fallback).
 * 3. Lista homologada de seguradoras parceiras (ex: Porto Seguro, Allianz, Tokio Marine, Azul Seguros).
 * 4. Condições de parcerias exclusivas ou benefícios adicionais para clientes que compraram veículos na loja.
 */
