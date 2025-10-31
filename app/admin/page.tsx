"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  inventory: number
  image?: string
}

interface FormData {
  name: string
  slug: string
  description: string
  price: string
  category: string
  inventory: string
  image: string
}

const ADMIN_KEY = "demo-admin-key-12345"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    price: "",
    category: "Electronics",
    inventory: "",
    image: "",
  })

  const categories = ["Electronics", "Fashion", "Home", "Sports", "Books"]

  // Handle authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey === ADMIN_KEY) {
      setIsAuthenticated(true)
      setAdminKey("")
      fetchProducts()
    } else {
      alert("Invalid admin key")
    }
  }

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      alert("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug || !formData.description || !formData.price || !formData.inventory) {
      alert("Please fill in all fields")
      return
    }

    try {
      setLoading(true)

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        category: formData.category,
        inventory: Number.parseInt(formData.inventory),
        image: formData.image,
      }

      if (editingId) {
        // Update existing product
        const response = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY,
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          alert("Product updated successfully")
          fetchProducts()
          resetForm()
        } else {
          alert("Failed to update product")
        }
      } else {
        // Create new product
        const response = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": ADMIN_KEY,
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          alert("Product created successfully")
          fetchProducts()
          resetForm()
        } else {
          alert("Failed to create product")
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error submitting form")
    } finally {
      setLoading(false)
    }
  }

  // Handle edit
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      inventory: product.inventory.toString(),
      image: product.image || "",
    })
    setEditingId(product._id)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      setLoading(true)
      const response = await fetch(`/api/products/${slug}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": ADMIN_KEY,
        },
      })

      if (response.ok) {
        alert("Product deleted successfully")
        fetchProducts()
      } else {
        alert("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: "",
      category: "Electronics",
      inventory: "",
      image: "",
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="card-base">
            <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
            <p className="text-text-muted mb-8">Enter your admin key to access the admin panel</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Admin Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                  className="input-base"
                />
                <p className="text-xs text-text-muted mt-2">Demo key: demo-admin-key-12345</p>
              </div>

              <button type="submit" className="btn-primary w-full">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container-custom flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-primary-foreground/80">Manage your product inventory</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 bg-primary-foreground text-primary rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

         {/* Product Form */}
        {showForm && (
          <div className="card-base mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={resetForm} className="p-2 hover:bg-surface rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="product-slug"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="input-base">
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Inventory</label>
                  <input
                    type="number"
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="input-base"
                  />
                  <p className="text-xs text-text-muted mt-1">Enter the full image URL</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={4}
                  className="input-base"
                />
              </div>

              {formData.image && (
                <div className="border-2 border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3">Image Preview:</p>
                  <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={formData.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 flex-1">
                  <Save className="w-5 h-5" />
                  {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-border rounded-lg font-medium hover:bg-surface transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Products Table */}
        <div className="card-base">
          <h2 className="text-2xl font-bold mb-6">Products</h2>

          {loading && !showForm ? (
            <div className="text-center py-8">
              <p className="text-text-muted">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Category</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Stock</th>
                    <th className="text-center py-3 px-4 font-semibold text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-border hover:bg-surface transition-colors">
                      <td className="py-4 px-4 font-medium">{product.name}</td>
                      <td className="py-4 px-4 text-text-muted">{product.category}</td>
                      <td className="py-4 px-4 text-right font-semibold">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right font-bold">{product.inventory}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.slug)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-error"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
