"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, isOpen, setCartOpen, clearCart } = useCart()
  const [isClearing, setIsClearing] = useState(false)

  const handleRemoveItem = (id: string, color?: string, size?: string) => {
    removeItem(id, color, size)
    toast.success("Item removed from cart")
  }

  const handleUpdateQuantity = (id: string, quantity: number, color?: string, size?: string) => {
    updateQuantity(id, quantity, color, size)
    if (quantity === 0) {
      toast.success("Item removed from cart")
    }
  }

  const handleClearCart = async () => {
    setIsClearing(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate loading
    clearCart()
    setIsClearing(false)
    toast.success("Cart cleared")
  }

  const shippingThreshold = 100
  const shippingCost = getTotalPrice() >= shippingThreshold ? 0 : 9.99
  const remainingForFreeShipping = Math.max(0, shippingThreshold - getTotalPrice())

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Shopping Cart</SheetTitle>
              <SheetDescription>
                {getTotalItems() === 0
                  ? "Your cart is empty"
                  : `${getTotalItems()} ${getTotalItems() === 1 ? "item" : "items"} in your cart`}
              </SheetDescription>
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-muted-foreground hover:text-destructive"
              >
                {isClearing ? "Clearing..." : "Clear All"}
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mb-6">Add some items to get started</p>
                <Button onClick={() => setCartOpen(false)}>Continue Shopping</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Free Shipping Progress */}
              {remainingForFreeShipping > 0 && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Free Shipping Progress</span>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      ${remainingForFreeShipping.toFixed(2)} to go
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (getTotalPrice() / shippingThreshold) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => {
                    const itemKey = `${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`
                    return (
                      <div key={itemKey} className="flex space-x-4 p-3 rounded-lg border bg-card">
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">{item.name}</h4>
                          <div className="flex flex-col space-y-1 mb-2">
                            {item.selectedColor && (
                              <span className="text-xs text-muted-foreground">Color: {item.selectedColor}</span>
                            )}
                            {item.selectedSize && (
                              <span className="text-xs text-muted-foreground">Size: {item.selectedSize}</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                    item.selectedColor,
                                    item.selectedSize,
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 bg-transparent"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    item.selectedColor,
                                    item.selectedSize,
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveItem(item.id, item.selectedColor, item.selectedSize)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4 bg-background">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${(getTotalPrice() + shippingCost).toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/cart" onClick={() => setCartOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Full Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setCartOpen(false)}>
                    <Button className="w-full">Checkout • ${(getTotalPrice() + shippingCost).toFixed(2)}</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
