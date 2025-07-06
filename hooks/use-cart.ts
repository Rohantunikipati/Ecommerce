"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, Product } from "@/types"

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, options?: { color?: string; size?: string }) => void
  removeItem: (id: string, color?: string, size?: string) => void
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItemCount: (id: string, color?: string, size?: string) => number
  setCartOpen: (open: boolean) => void
  toggleCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, options = {}) => {
        const items = get().items
        const itemKey = `${product.id}-${options.color || ""}-${options.size || ""}`
        const existingItem = items.find(
          (item) =>
            item.id === product.id && item.selectedColor === options.color && item.selectedSize === options.size,
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedColor === options.color && item.selectedSize === options.size
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                quantity: 1,
                selectedColor: options.color,
                selectedSize: options.size,
              },
            ],
          })
        }

        // Auto-open cart when item is added
        set({ isOpen: true })

        // Auto-close cart after 3 seconds
        setTimeout(() => {
          set({ isOpen: false })
        }, 3000)
      },
      removeItem: (id, color, size) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === id && item.selectedColor === color && item.selectedSize === size),
          ),
        })
      },
      updateQuantity: (id, quantity, color, size) => {
        if (quantity <= 0) {
          get().removeItem(id, color, size)
          return
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.selectedColor === color && item.selectedSize === size ? { ...item, quantity } : item,
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      getItemCount: (id, color, size) => {
        const item = get().items.find(
          (item) => item.id === id && item.selectedColor === color && item.selectedSize === size,
        )
        return item ? item.quantity : 0
      },
      setCartOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    },
  ),
)
