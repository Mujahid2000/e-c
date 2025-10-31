"use client"

import Link from "next/link"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface ProductCardProps {
  _id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviews: number
  inventory: number
}

export default function ProductCard({_id, slug, name, price, image, rating, reviews, inventory }: ProductCardProps) {

  console.log(image)
  return (
    <Link href={`/products/${slug}`}>
      <div className="card-base cursor-pointer group">
        <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {inventory < 10 && inventory > 0 && (
            <div className="absolute top-3 right-3 bg-warning text-primary px-3 py-1 rounded-full text-sm font-semibold">
              Low Stock
            </div>
          )}
          {inventory === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2  transition-colors">{name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-gray-600"}`}
              />
            ))}
          </div>
          <span className="text-sm text-black">({reviews})</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-black">${price.toFixed(2)}</span>
          <button
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-light transition-colors"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
