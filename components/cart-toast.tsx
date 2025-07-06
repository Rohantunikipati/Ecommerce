"use client"

import { useEffect } from "react"
import { useCart } from "@/hooks/use-cart"

export default function CartToast() {
  const { items } = useCart()

  useEffect(() => {
    // This component can be used for global cart notifications
    // Currently handled in individual components
  }, [items])

  return null
}
