
import { dbConnect } from "@/lib/db"
import { Product } from "@/lib/product"
import { NextResponse } from "next/server"

// GET /api/stats - Fetch inventory statistics (for dashboard)
export async function GET() {
  try {
    await dbConnect()

    const totalProducts = await Product.countDocuments()
    const lowStockProducts = await Product.countDocuments({ inventory: { $lt: 10, $gt: 0 } })
    const outOfStockProducts = await Product.countDocuments({ inventory: 0 })
    const totalInventory = await Product.aggregate([{ $group: { _id: null, total: { $sum: "$inventory" } } }])

    const stats = {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventory: totalInventory[0]?.total || 0,
      averagePrice: await Product.aggregate([{ $group: { _id: null, avg: { $avg: "$price" } } }]).then(
        (result) => result[0]?.avg || 0,
      ),
    }

    return NextResponse.json({ success: true, data: stats }, { status: 200 })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch statistics" }, { status: 500 })
  }
}
