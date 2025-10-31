

import { dbConnect } from "@/lib/db"
import { Product } from "@/lib/product"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let query = {}
    if (category) {
      query = { category }
    }

    const products = await Product.find(query).limit(limit).lean()

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products.length,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - Create a new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key")
    // console.log(adminKey)
    if (adminKey !== process.env.ADMIN_TOKEN) {
      console.log(process.env.ADMIN_TOKEN)
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const body = await request.json()

    // Validate required fields
    const {name, slug, description, price, category, inventory, image} = body
console.log(name, slug, description, price, category, inventory, image)
    if (!name || !slug || !description || price === undefined || !category || !image) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json({ success: false, error: "Product with this slug already exists" }, { status: 409 })
    }

    const product = new Product({
      name,
      image,
      slug,
      description,
      price,
      category,
      inventory: inventory || 0,
      lastUpdated: new Date(),
    })

    await product.save()

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
