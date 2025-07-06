"use client"

import { useState } from "react"
import { Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCard from "@/components/product-card"
import ProductFilters from "@/components/product-filters"
import { mockProducts } from "@/lib/mock-data"
import type { Product } from "@/types"

export default function HomePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    ratings: [],
  })

  const filteredProducts = mockProducts.filter((product: Product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false
    }

    // Price filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false
    }

    // Rating filter
    if (filters.ratings.length > 0 && !filters.ratings.some((rating) => product.rating >= rating)) {
      return false
    }

    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id.localeCompare(a.id)
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Products</h1>
        <p className="text-xl text-muted-foreground mb-8">Find everything you need with our curated collection</p>
        <div className="max-w-md mx-auto">
          <Input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-center"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <ProductFilters onFiltersChange={setFilters} />

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">{sortedProducts.length} products found</span>
            </div>

            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setFilters({ categories: [], priceRange: [0, 1000], ratings: [] })
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
