"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ExternalLink, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  slug: string
  createdAt: string
  visits: number
}

const GlassCard = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 ${className}`}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 mix-blend-overlay"></div>
      </div>
      <div className="relative p-6">{children}</div>
    </div>
  )
}

export default function RedirectPage() {
  const params = useParams()
  const router = useRouter()
  const [url, setUrl] = useState<ShortenedUrl | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const slug = params.slug as string

    // Load URLs from localStorage
    const savedUrls: ShortenedUrl[] = JSON.parse(localStorage.getItem("shortenedUrls") || "[]")
    const foundUrl = savedUrls.find((u) => u.slug === slug)

    if (foundUrl) {
      setUrl(foundUrl)

      // Update visit count
      const updatedUrls = savedUrls.map((u) => (u.slug === slug ? { ...u, visits: u.visits + 1 } : u))
      localStorage.setItem("shortenedUrls", JSON.stringify(updatedUrls))

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            window.location.href = foundUrl.originalUrl
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    } else {
      // URL not found, redirect to 404
      router.push("/404")
    }

    setIsLoading(false)
  }, [params.slug, router])

  const redirectNow = () => {
    if (url) {
      window.location.href = url.originalUrl
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!url) {
    return null // Will redirect to 404
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Redirecting...</h1>
          <p className="text-muted-foreground">You will be redirected in {countdown} seconds</p>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Destination:</p>
            <p className="font-medium break-all text-sm">{url.originalUrl}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={redirectNow}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Go Now
            </Button>

            <Button variant="outline" asChild className="w-full bg-white/10 border-white/20 hover:bg-white/20">
              <Link href="/" className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
