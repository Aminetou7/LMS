export type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  sizes: string[] | null
}

export const MAX_PER_LINE = 5
export const MAX_PER_ORDER = 15

export const products: Product[] = [
  {
    id: 'hoodie',
    name: 'Survivor Hoodie',
    description: 'Heavy charcoal hoodie with the owl & thorn crest.',
    price: 65,
    image: '/images/shop-hoodie.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'tshirt',
    name: 'Storm Tee',
    description: 'Sand tee printed with branches and lightning.',
    price: 30,
    image: '/images/shop-tshirt.png',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'bottle',
    name: 'Supply Bottle',
    description: 'Matte black steel bottle, engraved crest. 750ml.',
    price: 35,
    image: '/images/shop-bottle.png',
    sizes: null,
  },
  {
    id: 'kit',
    name: 'Drop Kit',
    description: 'Tote, cap, bracelet, notebook and enamel pin.',
    price: 80,
    image: '/images/shop-kit.png',
    sizes: null,
  },
]
