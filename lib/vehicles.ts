export interface Vehicle {
  id: string
  brand: string
  model: string
  version: string
  year: number
  yearModel: number
  price: number
  fipe: number
  mileage?: number
  fuel: string
  transmission: string
  color: string
  doors: number
  bodyType: string
  image: string
  images: string[]
  city: string
  state: string
  seller: string
  sellerType: "concessionaria" | "loja" | "particular"
  features: string[]
  description: string
  engineSize?: string
  horsepower?: number
  isNew?: boolean
  message?: String

}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Yaris",
    version: "1.3 flex manual",
    year: 2019,
    yearModel: 2019,
    price: 62999,
    fipe: 72999,
    // mileage: 12000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco pérola",
    doors: 4,
    bodyType: "Hatch",
    image: "/images/vehicles/1/2.jpg",
    images: [
      "/images/vehicles/1/1a.jpg",
      "/images/vehicles/1/2.jpg",
      "/images/vehicles/1/3.jpg",
      "/images/vehicles/1/4.jpg",
      "/images/vehicles/1/5.jpg",
      "/images/vehicles/1/6.jpg",
      "/images/vehicles/1/7.jpg",
      "/images/vehicles/1/8.jpg",
    ],
    city: "João Pessoa",
    state: "PB",
    seller: "Alan Car",
    sellerType: "loja",
    features: [
      "Sem Sinistro",
      "Envio para todo o Brasil",
      "Ipva 2026 pago sem débitos",
      "Vidros eletricos",
      "Aceita financiamento",
      "Travas eletricas",
      "Airbag duplo",
      "Freios ABS",
      "Bancos em couro",
    ],
    description:
      "Yaris 1.3 manual 2019 em perfeito estado de conservação. Único dono, todas as revisões feitas na concessionária. IPVA 2026 pago sem débitos. Pneus novos.",
    engineSize: "1.3",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Toyota%20Yaris%201.3%20manual%20-%202019/2019"
  },
  {
    id: "2",
    brand: "Jeep",
    model: "Compass",
    version: "Longitude 2.0 Diesel aut + couro",
    year: 2019,
    yearModel: 2019,
    price: 88999,
    fipe: 105000,
    mileage: 90000,
    fuel: "Diesel",
    transmission: "Automatico",
    color: "Branco pérola",
    doors: 4,
    bodyType: "SUV",
    image: "/images/vehicles/2/1.jpg",
    images: [
      "/images/vehicles/2/1.jpg",
      // "/images/vehicles/2/2.jpg",
      "/images/vehicles/2/3.jpg",
      "/images/vehicles/2/4.jpg",
      "/images/vehicles/2/5.jpg",
      "/images/vehicles/2/6.jpg",
      "/images/vehicles/2/7.jpg",
      "/images/vehicles/2/8.jpg",
      "/images/vehicles/2/9.jpg",
    ],
    city: "João Pessoa",
    state: "PB",
    seller: "Alan Car",
    sellerType: "loja",
    features: [
      "Veículo com passagem em leilão",
      "Garantia de motor e câmbio",
      "Ar condicionado Digital Dual Zone",
      "Direção elétrica",
      "Central Multimídia",
      "Câmera de ré",
      "Sensor de estacionamento",
      "Controle de estabilidade",
      "Controle de tração",
      "Bancos em couro",
      "Rodas de liga leve",
      "Tração 4x4",
      "Volante multifuncional",
      "Paddle Shift",
      "Chave presencial",
    ],
    description:
      "Compass Longitude Diesel 2019/2019 com couro. Em perfeito estado de conservação. IPVA 2026 pago sem débitos. Pneus novos. Passagem por leilão",
    engineSize: "2.0",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Jeep%20Compass%20Longitude%20Diesel%202.0%20-%20202019/2019"

  },
  {
    id: "3",
    brand: "Jeep",
    model: "Compass",
    version: "Longitude Diesel com Arla aut + couro",
    year: 2022,
    yearModel: 2022,
    price: 117999,
    fipe: 134000,
    mileage: 39000,
    fuel: "Diesel",
    transmission: "Automatico",
    color: "Azul",
    doors: 4,
    bodyType: "SUV",
    image: "/images/vehicles/3/1.jpg",
    images: [
      "/images/vehicles/3/1.jpg",
      "/images/vehicles/3/2.jpg",
      "/images/vehicles/3/3.jpg",
      "/images/vehicles/3/4.jpg",
      "/images/vehicles/3/5.jpg",
      "/images/vehicles/3/6.jpg",
      "/images/vehicles/3/7.jpg",
      "/images/vehicles/3/8.jpg",
    ],
    city: "João Pessoa",
    state: "PB",
    seller: "Alan Car",
    sellerType: "loja",
    features: [
      "Garantia de motor e câmbio",
      "Ar condicionado Digital Dual Zone",
      "Direção elétrica",
      "Central Multimídia",
      "Câmera de ré",
      "Sensor de estacionamento",
      "Controle de estabilidade",
      "Controle de tração",
      "Bancos em couro",
      "Rodas de liga leve",
      "Tração 4x4",
      "Volante multifuncional",
      "Paddle Shift",
      "Chave presencial",
    ],
    description:
      "Compass Longitude Diesel 2022/2022 com Arla aut + couro. Em perfeito estado de conservação. IPVA 2026 pago sem débitos. Pneus novos. OBS:km baixo teto solar interior branco com manual e revisões na css.. possue sinistro no doc",
    engineSize: "2.0",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Jeep%20Compass%20Longitude%20Diesel%202.0%20-%20202022/2022"

  },
  {
    id: "4",
    brand: "Fiat",
    model: "Fastback",
    version: "Abarth ED 1.3 turbo aut + couro",
    year: 2025,
    yearModel: 2025,
    price: 103999,
    fipe: 133990,
    mileage: 19000,
    fuel: "Flex",
    transmission: "Automatico",
    color: "preto pérola",
    doors: 4,
    bodyType: "SUV",
    image: "/images/vehicles/4/1.jpg",
    images: [
      "/images/vehicles/4/1.jpg",
      "/images/vehicles/4/2.jpg",
      "/images/vehicles/4/3.jpg",
      "/images/vehicles/4/4.jpg",
      "/images/vehicles/4/5.jpg",
      "/images/vehicles/4/6.jpg",
      "/images/vehicles/4/7.jpg",
      "/images/vehicles/4/8.jpg",
      "/images/vehicles/4/9.jpg",
    ],
    city: "João Pessoa",
    state: "PB",
    seller: "Alan Car",
    sellerType: "loja",
    features: [
      "Financiamento junto ao banco",
      "Ipva 2025 pago sem débitos",
      "Garantia de motor e câmbio",
      "Possue sinistro no doc",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Alarme",
      "Central multimídia",
      "Câmera de ré",
      "Sensores de estacionamento",
      "Bancos em couro",
      "Rodas de liga leve",
      "Faróis de LED",
      "Piloto automático",
      "Airbags",
      "Freios ABS",
      "Controle de tração",
      "Controle de estabilidade",
      "Chave presencial",
      "Partida por botão",
    ],
    description:
      "Fiat Fastback Abarth 1.3 turbo 2025/2025 com couro. Em perfeito estado de conservação. IPVA 2026 pago sem débitos. Pneus novos. Passagem por leilão",
    engineSize: "1.3 turbo",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Fiat%20Fastback%20Abarth%20ED%20Flex%201.3%20Turbo%20-%202025/2025"

  },
  {
    id: "5",
    brand: "Volkswagen",
    model: "Nivus",
    version: "Highline Tsi 1.0 aut + couro",
    year: 2024,
    yearModel: 2024,
    price: 96999,
    fipe: 118000,
    mileage: 74000,
    fuel: "Flex",
    transmission: "Automatico",
    color: "preto pérola",
    doors: 4,
    bodyType: "SUV",
    image: "/images/vehicles/5/1.jpg",
    images: [
      "/images/vehicles/5/1.jpg",
      "/images/vehicles/5/2.jpg",
      "/images/vehicles/5/3.jpg",
      "/images/vehicles/5/4.jpg",
      "/images/vehicles/5/5.jpg",
      "/images/vehicles/5/6.jpg",
      "/images/vehicles/5/7.jpg",
      "/images/vehicles/5/8.jpg",
    ],
    city: "Rio de Janeiro",
    state: "RJ",
    seller: "Alan Car",
    sellerType: "loja",
    features: [
      "Veículo com passagem em leilão!",
      "Financiamento junto ao banco.",
      "Sinistro no documento",
      "Garantia do motor e câmbio",
      "Ar condicionado digital",
      "Direção elétrica",
      "Vidros elétricos",
      "Travas elétricas",
      "Alarme",
      "Freios ABS",
      "Airbags frontais, laterais e de cortina",
      "Rodas de liga leve",
      "Bancos de couro",
      "Central multimídia VW Play",
      "Câmera de ré",
      "Sensores de estacionamento dianteiros e traseiros",
      "Controle de tração e estabilidade",
      "Faróis Full LED",
      "Piloto automático adaptativo (ACC)",
      "Frenagem autônoma de emergência",
      "Painel digital Active Info Display",
      "Carregador por indução",
      "Partida por botão",
      "Volante multifuncional",
    ],
    description:
      "Nivus Highline Tsi 1.0 aut 2024/2024 com couro. Em perfeito estado de conservação. IPVA 2026 pago sem débitos. Pneus novos. Versão mais completa com ACC, painel digital e VW Play.",
    engineSize: "1.0",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Volkswagen%20Nivus%20Highline%20TSI%20Flex%201.0%20Turbo%20Aut.%20-%202024/2024"


  },

]

export const brands = [...new Set(vehicles.map((v) => v.brand))].sort()
export const bodyTypes = [...new Set(vehicles.map((v) => v.bodyType))].sort()
export const fuelTypes = [...new Set(vehicles.map((v) => v.fuel))].sort()

export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id)
}

export function formatPrice(price: number): string {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatMileage(mileage: number): string {
  return mileage.toLocaleString("pt-BR") + " km"
}
