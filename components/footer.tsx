import Link from "next/link"
import { Mail, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">ProductHub</h3>
            <p className="text-primary-foreground/70">
              Professional e-commerce platform demonstrating modern Next.js rendering strategies.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-accent transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-accent transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <Mail className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
              <Github className="w-5 h-5 cursor-pointer hover:text-accent transition-colors" />
            </div>
          </div>
        </div>
        <div className="border-t border-primary-light pt-8 text-center text-primary-foreground/60">
          <p>&copy; 2025 ProductHub. All rights reserved. | Full-Stack E-Commerce Demo</p>
        </div>
      </div>
    </footer>
  )
}
