"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { Search } from "lucide-react"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  image: string
  rating: number
  reviews: number
  inventory: number
  category: string;
  description: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  const categories = ["All", "Electronics", "Fashion", "Home", "Sports", "Books"]

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
          setFilteredProducts(data.data)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Discover Premium Products</h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Browse our curated collection of high-quality products across multiple categories. Find exactly what you
            need with our advanced search and filtering.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-surface text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-surface border-b border-border sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container-custom py-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-muted">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h2>
              <p className="text-text-muted">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} {...product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-text-muted mb-4">No products found</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-surface border-t border-border py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ProductHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">✓</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-text-muted">
                All products are carefully selected and verified for quality and authenticity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-text-muted">
                Quick and reliable shipping to get your products to you as fast as possible.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
              <p className="text-text-muted">Your data is protected with industry-leading security and encryption.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
