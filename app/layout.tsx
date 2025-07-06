import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopHub - Premium E-commerce Store",
  description: "Discover amazing products with our premium e-commerce experience",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <footer className="border-t bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold mb-4">ShopHub</h3>
                <p className="text-sm text-muted-foreground">
                  Your premium destination for quality products and exceptional shopping experience.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>All Products</li>
                  <li>Electronics</li>
                  <li>Clothing</li>
                  <li>Accessories</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Contact Us</li>
                  <li>FAQ</li>
                  <li>Shipping Info</li>
                  <li>Returns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibool mb-4">Account</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Sign In</li>
                  <li>Register</li>
                  <li>Order History</li>
                  <li>Wishlist</li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2024 ShopHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
