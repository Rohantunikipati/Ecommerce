"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart()

  const shippingThreshold = 100
  const shippingCost = getTotalPrice() >= shippingThreshold ? 0 : 9.99
  const tax = getTotalPrice() * 0.08
  const finalTotal = getTotalPrice() + shippingCost + tax
  const remainingForFreeShipping = Math.max(0, shippingThreshold - getTotalPrice())

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

  const handleClearCart = () => {
    clearCart()
    toast.success("Cart cleared")
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/">
            <Button size="lg" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Link href="/">
            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              <span>Continue Shopping</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {remainingForFreeShipping > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                🚚 Add ${remainingForFreeShipping.toFixed(2)} more for FREE shipping!
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (getTotalPrice() / shippingThreshold) * 100)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const itemKey = `${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`
            return (
              <Card key={itemKey} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            {item.selectedColor && (
                              <Badge variant="secondary" className="text-xs">
                                Color: {item.selectedColor}
                              </Badge>
                            )}
                            {item.selectedSize && (
                              <Badge variant="secondary" className="text-xs">
                                Size: {item.selectedSize}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id, item.selectedColor, item.selectedSize)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1, item.selectedColor, item.selectedSize)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-lg min-w-[30px] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1, item.selectedColor, item.selectedSize)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}>
                      {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <RotateCcw className="h-4 w-4 text-orange-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
