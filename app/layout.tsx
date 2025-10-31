import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

const geistSans = Geist({ subsets: ["latin"] })
// const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProductHub - Professional E-Commerce",
  description: "Browse and manage products with advanced inventory management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} bg-background text-foreground`}>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
