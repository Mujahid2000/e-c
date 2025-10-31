
import { Product } from "@/lib/product"
import RecommendationCard from "@/components/recommendation-card"
import { Star } from "lucide-react"
import { dbConnect } from "@/lib/db"

export const revalidate = 3600

// Server Component to fetch recommendations
async function RecommendationsServer() {
  try {
    await dbConnect()

    // Define the product type
    type ProductType = {
      _id: string
      name: string
      slug: string
      price: number
      image: string
      rating: number
      reviews: number
      inventory: number
    }

    // Fetch top-rated products
    const topRated = await Product.find({}, null, { lean: true }).sort({ rating: -1 }).limit(6) as unknown as ProductType[]

    // Fetch best sellers (by reviews)
    const bestSellers = await Product.find({}, null, { lean: true }).sort({ reviews: -1 }).limit(6) as unknown as ProductType[]

    // Fetch products by category
    const categories = ["Electronics", "Fashion", "Home", "Sports", "Books"]
    const categoryProducts: Record<string, ProductType[]> = {}

    for (const category of categories) {
      const products = await Product.find({ category }, null, { lean: true }).sort({ rating: -1 }).limit(3) as unknown as ProductType[]
      categoryProducts[category] = products
    }

    return { topRated, bestSellers, categoryProducts }
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return { topRated: [], bestSellers: [], categoryProducts: {} }
  }
}

export default async function RecommendationsPage() {
  const { topRated, bestSellers, categoryProducts } = await RecommendationsServer()

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-2">Recommended Products</h1>
          <p className="text-primary-foreground/80">
            Discover our handpicked selection of top-rated and best-selling products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        {/* Top Rated Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Top Rated Products</h2>
            <p className="text-text-muted">Highest rated products based on customer reviews</p>
          </div>

          {topRated.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRated.map((product) => (
                <RecommendationCard key={product._id} product={product} badge="Top Rated" /> //Type 'unknown' is not assignable to type 'Key | null | undefined'.ts(2322) . index.d.ts(250, 9): The expected type comes from property 'key' which is declared here on type 'IntrinsicAttributes & RecommendationCardProps'
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-base">
              <p className="text-text-muted">No products available</p>
            </div>
          )}
        </section>

        {/* Best Sellers Section */}
        <section className="mb-16 border-t border-border pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
            <p className="text-text-muted">Most popular products loved by our customers</p>
          </div>

          {bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bestSellers.map((product) => (
                <RecommendationCard key={product._id} product={product} badge="Best Seller" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-base">
              <p className="text-text-muted">No products available</p>
            </div>
          )}
        </section>

        {/* Category Recommendations */}
        {Object.entries(categoryProducts).map(
          ([category, products]) =>
            products.length > 0 && (
              <section key={category} className="mb-16 border-t border-border pt-12">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2">{category} Recommendations</h2>
                  <p className="text-text-muted">Top picks from our {category.toLowerCase()} collection</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <RecommendationCard key={product._id} product={product} badge={category} />
                  ))}
                </div>
              </section>
            ),
        )}

        {/* Why These Recommendations */}
        <section className="mt-16 border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-8">Why These Recommendations?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-base">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Ratings</h3>
              <p className="text-text-muted">
                We recommend products with the highest customer satisfaction ratings and positive reviews.
              </p>
            </div>

            <div className="card-base">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Popular Choices</h3>
              <p className="text-text-muted">
                Best sellers are products that have been purchased and loved by thousands of customers.
              </p>
            </div>

            <div className="card-base">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-primary">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
              <p className="text-text-muted">
                All recommended products meet our strict quality standards and customer satisfaction criteria.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
