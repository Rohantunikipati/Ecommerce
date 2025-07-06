"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Heart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/types"
import { useCart } from "@/hooks/use-cart"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export default function ProductCard({ product, viewMode }: ProductCardProps) {
  const { addItem, getItemCount } = useCart()
  const [isLiked, setIsLiked] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "")
  const [isAdding, setIsAdding] = useState(false)

  const currentQuantity = getItemCount(product.id, selectedColor, selectedSize)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!product.inStock) return

    setIsAdding(true)

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))

    addItem(product, {
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    })

    toast.success(`${product.name} added to cart!`, {
      description:
        `${selectedColor ? `Color: ${selectedColor}` : ""} ${selectedSize ? `Size: ${selectedSize}` : ""}`.trim(),
    })

    setIsAdding(false)
  }

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
    toast.success(isLiked ? "Removed from wishlist" : "Added to wishlist")
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <Link href={`/products/${product.id}`}>
          <div className="flex">
            <div className="relative w-48 h-48 flex-shrink-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
              {!product.inStock && <Badge className="absolute top-2 left-2 bg-gray-500">Out of Stock</Badge>}
            </div>
            <CardContent className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleLike}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">({product.reviews} reviews)</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

              {/* Variant Selection */}
              <div className="flex space-x-4 mb-4">
                {product.colors && product.colors.length > 0 && (
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAdding}
                  className="flex items-center space-x-2 min-w-[120px]"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding...</span>
                    </>
                  ) : currentQuantity > 0 ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>In Cart ({currentQuantity})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && <Badge className="absolute top-2 left-2 bg-red-500">Sale</Badge>}
          {!product.inStock && <Badge className="absolute top-2 left-2 bg-gray-500">Out of Stock</Badge>}
          {currentQuantity > 0 && (
            <Badge className="absolute top-2 right-12 bg-green-500">In Cart ({currentQuantity})</Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleLike}
            className="absolute top-2 right-2 text-white hover:text-red-500 bg-black/20 hover:bg-white/90 transition-all"
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h3>

          <div className="flex items-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Variant Selection for Grid View */}
          <div className="space-y-2 mb-3">
            {product.colors && product.colors.length > 0 && (
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {product.colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="w-full flex items-center justify-center space-x-2 h-9"
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : currentQuantity > 0 ? (
              <>
                <Check className="h-4 w-4" />
                <span>In Cart ({currentQuantity})</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </>
            )}
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}
