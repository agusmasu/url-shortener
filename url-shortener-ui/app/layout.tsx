import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { AnimatedBackground } from "@/components/ui/animated-background"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "URL Shortener - Modern Link Management",
  description: "Transform long URLs into short, shareable links with advanced analytics and user management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AnimatedBackground />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
