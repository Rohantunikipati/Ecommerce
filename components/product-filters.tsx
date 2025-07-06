"use client"

import { useState } from "react"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void
}

export default function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const categories = ["Electronics", "Clothing", "Accessories", "Home & Garden", "Sports"]
  const ratings = [5, 4, 3, 2, 1]

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category)
    setSelectedCategories(updated)
    onFiltersChange({ categories: updated, priceRange, ratings: selectedRatings })
  }

  const handleRatingChange = (rating: number, checked: boolean) => {
    const updated = checked ? [...selectedRatings, rating] : selectedRatings.filter((r) => r !== rating)
    setSelectedRatings(updated)
    onFiltersChange({ categories: selectedCategories, priceRange, ratings: updated })
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
    onFiltersChange({ categories: selectedCategories, priceRange: value, ratings: selectedRatings })
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">Price Range</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-4">
          <Slider value={priceRange} onValueChange={handlePriceChange} max={1000} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Categories */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">Categories</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Ratings */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold">Rating</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-4">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={selectedRatings.includes(rating)}
                onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
              />
              <Label htmlFor={`rating-${rating}`} className="text-sm font-normal">
                {rating} stars & up
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block w-64 space-y-6">
        <FilterContent />
      </div>

      {/* Mobile Filters */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>Filter products by your preferences</SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
