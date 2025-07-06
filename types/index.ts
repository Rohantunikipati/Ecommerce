export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
  description: string
  inStock: boolean
  colors?: string[]
  sizes?: string[]
}

export interface CartItem extends Product {
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}
