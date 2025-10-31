import { dbConnect } from "./db"
import { Product } from "./product"


const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 299.99,
    category: "Electronics",
    inventory: 45,
    image: "/wireless-headphones.png",
    rating: 4.8,
    reviews: 234,
  },
  {
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-tshirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 49.99,
    category: "Fashion",
    inventory: 120,
    image: "/cotton-tshirt.png",
    rating: 4.6,
    reviews: 89,
  },
  {
    name: "Smart Home Hub",
    slug: "smart-home-hub",
    description: "Control all your smart home devices from one central hub with voice commands.",
    price: 199.99,
    category: "Electronics",
    inventory: 32,
    image: "/smart-home-hub.png",
    rating: 4.7,
    reviews: 156,
  },
  {
    name: "Minimalist Desk Lamp",
    slug: "minimalist-desk-lamp",
    description: "Modern desk lamp with adjustable brightness and USB charging port.",
    price: 79.99,
    category: "Home",
    inventory: 67,
    image: "/modern-desk-lamp.png",
    rating: 4.5,
    reviews: 112,
  },
  {
    name: "Professional Yoga Mat",
    slug: "professional-yoga-mat",
    description: "Non-slip yoga mat made from eco-friendly materials with carrying strap.",
    price: 59.99,
    category: "Sports",
    inventory: 89,
    image: "/rolled-yoga-mat.png",
    rating: 4.9,
    reviews: 203,
  },
  {
    name: "The Art of Code",
    slug: "the-art-of-code",
    description: "A comprehensive guide to writing clean, maintainable code.",
    price: 39.99,
    category: "Books",
    inventory: 150,
    image: "/programming-book.png",
    rating: 4.4,
    reviews: 78,
  },
]

export async function seedDatabase() {
  try {
    await dbConnect()

    // Clear existing products
    await Product.deleteMany({})

    // Insert sample products
    const created = await Product.insertMany(sampleProducts)
    console.log(`Successfully seeded ${created.length} products`)

    return created
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
