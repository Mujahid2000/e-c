
import { dbConnect } from "@/lib/db"
import { Product } from "@/lib/product"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/products/[slug] - Fetch a single product
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await dbConnect()
    const { slug } = await params

    const product = await Product.findOne({ slug }).lean()

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

// PUT /api/products/[slug] - Update a product (Admin only)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const { slug } = await params
    const body = await request.json()

    const product = await Product.findOneAndUpdate({ slug }, { ...body, lastUpdated: new Date() }, { new: true })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

// DELETE /api/products/[slug] - Delete a product (Admin only)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const { slug } = await params

    const product = await Product.findOneAndDelete({ slug })

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
