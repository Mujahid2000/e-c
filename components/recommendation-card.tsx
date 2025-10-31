"use client"

import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { useState } from "react"


interface RecommendationCardProps {
    product: {
    _id: string
    name: string
    slug: string
    price: number
    image: string
    rating: number
    reviews: number
    inventory: number
  }
  badge?: string
}

export default function RecommendationCard({ product }: RecommendationCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="card-base cursor-pointer  h-full flex flex-col">
        {/* Image Container */}
        <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
          />

      
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-error text-error" : "text-gray-400"}`} />
          </button>

          {/* Stock Status */}
          {product.inventory === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-black transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-orange-600 text-orange-500" : "text-black"}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-xs text-black">({product.reviews})</span>
          </div>

          {/* Price and Button */}
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
            <span className="text-2xl font-bold text-black">${product.price.toFixed(2)}</span>
            <button
              onClick={(e) => {
                e.preventDefault()
              }}
              disabled={product.inventory === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                product.inventory > 0
                  ? "bg-primary text-primary-foreground hover:bg-primary-light"
                  : "bg-black text-black cursor-not-allowed"
              }`}
            >
              {product.inventory > 0 ? "Add" : "Out"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
