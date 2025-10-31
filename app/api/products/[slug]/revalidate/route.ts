import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"

// POST /api/products/[slug]/revalidate - On-demand ISR revalidation
export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const adminKey = request.headers.get("x-admin-key")
    if (adminKey !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params

    // Revalidate the product detail page
    revalidatePath(`/products/${slug}`)
    // Also revalidate home page since it shows products
    revalidatePath("/")

    return NextResponse.json({ success: true, message: "Revalidation triggered" }, { status: 200 })
  } catch (error) {
    console.error("Error revalidating:", error)
    return NextResponse.json({ success: false, error: "Failed to revalidate" }, { status: 500 })
  }
}
