import { dbConnect } from "@/lib/db"
import { Product } from "@/lib/product"
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export interface ProductType {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  image: string
  rating: number
  reviews: number
  inventory: number
  lastUpdated: Date
}

export const revalidate = 60

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    await dbConnect()
    const products = await Product.find({}, { slug: 1 }).lean<ProductType[]>()
    return products.map((p) => ({ slug: p.slug }))
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  try {
    await dbConnect()
    const product = await Product.findOne({ slug }).lean<ProductType | null>()

    if (!product) {
      return { title: "Product Not Found" }
    }

    return {
      title: `${product.name} | ProductHub`,
      description: product.description,
    }
  } catch (error) {
    console.log(error)
    return { title: "Product | ProductHub" }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  let product: ProductType | null = null
  let relatedProducts: ProductType[] = []

  try {
    await dbConnect()
    product = await Product.findOne({ slug }).lean<ProductType | null>()
    if (!product) {
      notFound()
    }

    relatedProducts = await Product.find(
      { category: product!.category, slug: { $ne: slug } },
      { name: 1, slug: 1, price: 1, image: 1, rating: 1 }
    )
      .limit(4)
      .lean<ProductType[]>()
  } catch (error) {
    console.error("Error loading product:", error)
    notFound()
  }

  if (!product) return null

  return (
    <div className="bg-background">
      {/* Breadcrumb */}
      <div className="container-custom py-4 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-foreground transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Details */}
      <section className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center bg-surface rounded-lg p-8 border border-border">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-accent text-primary rounded-full text-sm font-semibold mb-4">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-orange-500 text-accent"
                          : "text-orange-500"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-text-muted">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl font-bold text-black">
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-8">
                {product.inventory > 10 ? (
                  <p className="text-success font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    In Stock ({product.inventory} available)
                  </p>
                ) : product.inventory > 0 ? (
                  <p className="text-warning font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-warning rounded-full"></span>
                    Low Stock ({product.inventory} available)
                  </p>
                ) : (
                  <p className="text-error font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-error rounded-full"></span>
                    Out of Stock
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                disabled={product.inventory === 0}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
                  product.inventory > 0
                    ? "bg-primary text-primary-foreground hover:bg-primary-light"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-6 h-6" />
                {product.inventory > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <div className="flex gap-4">
                <button className="flex-1 py-3 border-2 border-border rounded-lg font-semibold hover:bg-surface transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="flex-1 py-3 border-2 border-border rounded-lg font-semibold hover:bg-surface transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="container-custom py-12 border-t border-border">
        <h2 className="text-3xl font-bold mb-8">Product Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-base">
            <h3 className="font-semibold text-lg mb-4">Specifications</h3>
            <ul className="space-y-3 text-text-muted">
              <li className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium text-foreground">
                  {product.category}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Price:</span>
                <span className="font-medium text-foreground">
                  ${product.price.toFixed(2)}
                </span>
              </li>
              <li className="flex justify-between">
                <span>Stock:</span>
                <span className="font-medium text-foreground">
                  {product.inventory} units
                </span>
              </li>
              <li className="flex justify-between">
                <span>Last Updated:</span>
                <span className="font-medium text-foreground">
                  {new Date(product.lastUpdated).toLocaleDateString()}
                </span>
              </li>
            </ul>
          </div>

          <div className="card-base">
            <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{product.rating}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-accent text-accent"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-text-muted text-sm">
                  {product.reviews} customer reviews
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container-custom py-12 border-t border-border">
          <h2 className="text-3xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct._id}
                href={`/products/${relatedProduct.slug}`}
              >
                <div className="card-base cursor-pointer group">
                  <div className="h-48 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      width={100}
                      height={100}
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-accent transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-accent">
                      ${relatedProduct.price.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="text-sm font-semibold">
                        {relatedProduct.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
