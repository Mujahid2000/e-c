import type React from "react"

import { Product } from "@/lib/product"
import { TrendingUp, AlertTriangle, Package, DollarSign } from "lucide-react"
import { dbConnect } from "@/lib/db"

export const revalidate = 0

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  trend?: string
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  return (
    <div className="card-base">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-text-muted text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && <p className="text-sm text-success mt-2">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  try {
    await dbConnect()

    // Fetch all products
    const products = await Product.find({}).lean()

    // Calculate statistics
    const totalProducts = products.length
    const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0)
    const lowStockProducts = products.filter((p) => p.inventory < 10 && p.inventory > 0)
    const outOfStockProducts = products.filter((p) => p.inventory === 0)
    const averagePrice = products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0
    const totalValue = products.reduce((sum, p) => sum + p.price * p.inventory, 0)

    // Get top products by inventory
    const topProducts = [...products].sort((a, b) => b.inventory - a.inventory).slice(0, 5)

    // Get low stock products
    const criticalProducts = products
      .filter((p) => p.inventory < 5 && p.inventory > 0)
      .sort((a, b) => a.inventory - b.inventory)
      .slice(0, 5)

    return (
      <div className="bg-background">
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-12">
          <div className="container-custom">
            <h1 className="text-4xl font-bold mb-2">Inventory Dashboard</h1>
            <p className="text-primary-foreground/80">Real-time inventory statistics and product management overview</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container-custom py-12">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              title="Total Products"
              value={totalProducts}
              icon={<Package className="w-6 h-6 text-primary" />}
              color="bg-blue-100"
              trend="All active products"
            />
            <StatCard
              title="Total Inventory"
              value={totalInventory}
              icon={<TrendingUp className="w-6 h-6 text-primary" />}
              color="bg-green-100"
              trend={`${totalInventory} units in stock`}
            />
            <StatCard
              title="Low Stock Items"
              value={lowStockProducts.length}
              icon={<AlertTriangle className="w-6 h-6 text-primary" />}
              color="bg-yellow-100"
              trend={`${lowStockProducts.length} products need restocking`}
            />
            <StatCard
              title="Inventory Value"
              value={`$${totalValue.toFixed(2)}`}
              icon={<DollarSign className="w-6 h-6 text-primary" />}
              color="bg-purple-100"
              trend={`Avg price: $${averagePrice.toFixed(2)}`}
            />
          </div>

          {/* Critical Alerts */}
          {outOfStockProducts.length > 0 && (
            <div className="mb-12 p-6 bg-red-50 border-l-4 border-error rounded-lg">
              <h3 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Out of Stock Alert
              </h3>
              <p className="text-text-muted mb-4">
                {outOfStockProducts.length} product(s) are currently out of stock and need immediate attention.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {outOfStockProducts.map((product) => (
                  <div key={String(product._id)} className="bg-white p-4 rounded-lg border border-error/20">
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <p className="text-sm text-text-muted mt-1">{product.category}</p>
                    <p className="text-sm font-bold text-error mt-2">Out of Stock</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Top Products by Inventory */}
            <div className="card-base">
              <h2 className="text-2xl font-bold mb-6">Top Products by Inventory</h2>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={String(product._id)}
                    className="flex items-center justify-between pb-4 border-b border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-accent text-primary font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-text-muted">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{product.inventory}</p>
                      <p className="text-sm text-text-muted">units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Stock Levels */}
            <div className="card-base">
              <h2 className="text-2xl font-bold mb-6">Critical Stock Levels</h2>
              {criticalProducts.length > 0 ? (
                <div className="space-y-4">
                  {criticalProducts.map((product) => (
                    <div
                      key={String(product._id)}
                      className="flex items-center justify-between p-4 bg-yellow-50 border border-warning/20 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-text-muted">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-warning">{product.inventory}</p>
                        <p className="text-xs text-text-muted">units left</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-center py-8">All products have healthy stock levels</p>
              )}
            </div>
          </div>

          {/* Detailed Product Table */}
          <div className="mt-12 card-base">
            <h2 className="text-2xl font-bold mb-6">All Products Inventory</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Product Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Stock</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Value</th>
                    <th className="text-center py-3 px-4 font-semibold text-text-muted">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={String(product._id)} className="border-b border-border hover:bg-surface transition-colors">
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4 text-text-muted">{product.category}</td>
                      <td className="py-4 px-4 text-right font-semibold">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-bold">{product.inventory}</td>
                      <td className="py-4 px-4 text-right font-semibold">
                        ${(product.price * product.inventory).toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {product.inventory === 0 ? (
                          <span className="inline-block px-3 py-1 bg-red-100 text-error rounded-full text-xs font-semibold">
                            Out of Stock
                          </span>
                        ) : product.inventory < 10 ? (
                          <span className="inline-block px-3 py-1 bg-yellow-100 text-warning rounded-full text-xs font-semibold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 bg-green-100 text-success rounded-full text-xs font-semibold">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-base text-center">
              <p className="text-text-muted mb-2">Average Inventory per Product</p>
              <p className="text-4xl font-bold text-accent">{(totalInventory / totalProducts).toFixed(1)}</p>
            </div>
            <div className="card-base text-center">
              <p className="text-text-muted mb-2">Stock Turnover Rate</p>
              <p className="text-4xl font-bold text-accent">
                {((outOfStockProducts.length / totalProducts) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="card-base text-center">
              <p className="text-text-muted mb-2">Average Product Price</p>
              <p className="text-4xl font-bold text-accent">${averagePrice.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading dashboard:", error)
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <p className="text-xl text-error">Error loading dashboard data</p>
        </div>
      </div>
    )
  }
}
