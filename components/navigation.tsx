"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-primary text-primary-foreground fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            ProductHub
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-accent transition-colors">
              Products
            </Link>
            <Link href="/dashboard" className="hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="hover:text-accent transition-colors">
              Admin
            </Link>
            <Link href="/recommendations" className="hover:text-accent transition-colors">
              Recommendations
            </Link>
            <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
          </div>

          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-primary/95 backdrop-blur">
            <Link href="/" className="block py-2 hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/products" className="block py-2 hover:text-accent transition-colors">
              Products
            </Link>
            <Link href="/dashboard" className="block py-2 hover:text-accent transition-colors">
              Dashboard
            </Link>
            <Link href="/admin" className="block py-2 hover:text-accent transition-colors">
              Admin
            </Link>
            <Link href="/recommendations" className="block py-2 hover:text-accent transition-colors">
              Recommendations
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
