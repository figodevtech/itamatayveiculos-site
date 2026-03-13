export interface Vehicle {
  id: string
  brand: string
  model: string
  version: string
  year: number
  yearModel: number
  price: number
  fipe?: number
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
  message?: string

}

export const vehicles: Vehicle[] = [
  {
    id: "1",
    brand: "Renault",
    model: "Oroch",
    version: "Expression 1.6",
    year: 2022,
    yearModel: 2022,
    // fipe: 123,
    price: 89900,
    // mileage: 12000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco pérola",
    doors: 4,
    bodyType: "Picape",
    image: "/images/vehicles/oroch/2.jpg",
    images: [
      "/images/vehicles/oroch/1.jpg",
      "/images/vehicles/oroch/2.jpg",
      "/images/vehicles/oroch/3.jpg",
      "/images/vehicles/oroch/4.jpg",
      "/images/vehicles/oroch/5.jpg",
      "/images/vehicles/oroch/6.jpg",
      "/images/vehicles/oroch/7.jpg",
      "/images/vehicles/oroch/8.jpg",
      "/images/vehicles/oroch/9.jpg",
      "/images/vehicles/oroch/10.jpg",
      "/images/vehicles/oroch/11.jpg",
      "/images/vehicles/oroch/12.jpg",
      "/images/vehicles/oroch/13.jpg",
      "/images/vehicles/oroch/14.jpg",
      "/images/vehicles/oroch/15.jpg",
    ],
    city: "Guarabira",
    state: "PB",
    seller: "Itamatay Veículos",
    sellerType: "loja",
    features: [
      "Envio para todo o Brasil",
      "IPVA 2026 pago sem débitos",
      "Vidros elétricos",
      "Alongador de Caçamba",
      "Aceita financiamento",
      "Travas elétricas",
      "Airbag duplo",
      "Freios ABS",
      "Acompanha chave reserva e manual do proprietário",
    ],
    description:
      "De única dona, com pneus novos, alongador de caçamba que chega a destravar um espaço a mais, ultrapassando seus 683 litros, suspensão traseira multilink, e os itens como ar-condicionado, direção eletro-hidráulica, vidros/travas elétricas e som com Bluetooth, tornam a picape ainda mais especial, disponível hoje no pátio, acompanha chave reserva e manual do proprietário !",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Renault%20Oroch%20Expression%201.6%20-%202022/2022"
  },
  {
    id: "2",
    brand: "Fiat",
    model: "Uno",
    version: "Drive 1.0",
    year: 2018,
    yearModel: 2018,
    // fipe: 123,
    price: 49900,
    mileage: 42000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco pérola",
    doors: 4,
    bodyType: "Hatch",
    image: "/images/vehicles/uno/1.jpg",
    images: [
      "/images/vehicles/uno/1.jpg",
      "/images/vehicles/uno/2.jpg",
      "/images/vehicles/uno/3.jpg",
      "/images/vehicles/uno/4.jpg",
      "/images/vehicles/uno/5.jpg",
      "/images/vehicles/uno/6.jpg",
      "/images/vehicles/uno/7.jpg",
      "/images/vehicles/uno/8.jpg",
      "/images/vehicles/uno/9.jpg",
      "/images/vehicles/uno/10.jpg",
      "/images/vehicles/uno/11.jpg",
      "/images/vehicles/uno/12.jpg",
      "/images/vehicles/uno/13.jpg",
      "/images/vehicles/uno/14.jpg",
      "/images/vehicles/uno/15.jpg",
      "/images/vehicles/uno/16.jpg",
      "/images/vehicles/uno/17.jpg",
      "/images/vehicles/uno/18.jpg",
      "/images/vehicles/uno/19.jpg",
      "/images/vehicles/uno/20.jpg",
    ],
    city: "Guarabira",
    state: "PB",
    seller: "Itamatay Veículos",
    sellerType: "loja",
    features: [
      "Envio para todo o Brasil",
      "IPVA 2026 pago sem débitos",
      "Vidros elétricos",
      "Sensor de estacionamento",
      "Aceita financiamento",
      "Travas elétricas",
      "Airbag duplo",
      "Freios ABS",
      "Acompanha chave reserva e manual do proprietário",
    ],
    description:
      "A Fiat é marcada por muitos modelos de sucesso, e sim, entre eles o Uno é o mais duradouro no mercado brasileiro ! Esse em específico entra no pátio com sensor de estacionamento, chave reserva, manual do proprietário, de único dono.",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Fiat%20Uno%20Drive%201.0%20-%202018/2018"
  },
  {
    id: "3",
    brand: "Chevrolet",
    model: "Onix",
    version: "LT 1.4",
    year: 2017,
    yearModel: 2017,
    // fipe: 123,
    price: 61500,
    // mileage: 42000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Vermelho",
    doors: 4,
    bodyType: "Hatch",
    image: "/images/vehicles/onix/1.jpg",
    images: [
      "/images/vehicles/onix/1.jpg",
      "/images/vehicles/onix/2.jpg",
      "/images/vehicles/onix/3.jpg",
      "/images/vehicles/onix/4.jpg",
      "/images/vehicles/onix/5.jpg",
      "/images/vehicles/onix/6.jpg",
      "/images/vehicles/onix/7.jpg",
      "/images/vehicles/onix/8.jpg",
      "/images/vehicles/onix/9.jpg",
      "/images/vehicles/onix/10.jpg",

    ],
    city: "Guarabira",
    state: "PB",
    seller: "Itamatay Veículos",
    sellerType: "loja",
    features: [
      "Envio para todo o Brasil",
      "IPVA 2026 pago sem débitos",
      "Vidros elétricos",
      "Aceita financiamento",
      "Travas elétricas",
      "Airbag duplo",
      "Freios ABS",
      "Acompanha chave reserva e manual do proprietário",
    ],
    description:
      "Um hatch compacto reconhecido pela excelente economia de combustível e baixo custo de manutenção. Disponível hoje no pátio, com chave reserva e manual do proprietário. Fala com a nossa equipe !",
    // horsepower: 177,
    isNew: false,
    message: "Olá,%20me%20interessei%20pelo%20Chevrolet%20Onix%20LT%201.4%20-%202017/2017"
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
