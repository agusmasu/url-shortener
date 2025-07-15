"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Link, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { UserMenu } from "@/components/auth/user-menu"
import { authService } from "@/lib/auth"
import { GlassCard } from "@/components/ui/glass-card"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  slug: string
  createdAt: string
  visits: number
  userId?: string
}

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { isAuthenticated, user } = useAuth()

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate URL
    if (!validateUrl(url)) {
      setError("Please enter a valid URL (including http:// or https://)")
      setIsLoading(false)
      return
    }

    try {
      if (isAuthenticated) {
        // Make authenticated API call
        const response = await authService.authenticatedFetch("/api/urls/shorten", {
          method: "POST",
          body: JSON.stringify({
            originalUrl: url,
            customSlug: customSlug || undefined,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to shorten URL")
        }

        const data = await response.json()
        setShortenedUrl(data)
      } else {
        // Simulate API call for non-authenticated users
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const slug = customSlug || Math.random().toString(36).substring(2, 8)
        const newShortenedUrl: ShortenedUrl = {
          id: Date.now().toString(),
          originalUrl: url,
          shortUrl: `https://short.ly/${slug}`,
          slug,
          createdAt: new Date().toISOString(),
          visits: 0,
          userId: user?.id,
        }

        setShortenedUrl(newShortenedUrl)

        // Save to localStorage for demo purposes
        const existingUrls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]")
        existingUrls.push(newShortenedUrl)
        localStorage.setItem("shortenedUrls", JSON.stringify(existingUrls))
      }
    } catch (err) {
      setError("Failed to shorten URL. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied! ✨",
        description: "Shortened URL copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setUrl("")
    setCustomSlug("")
    setShortenedUrl(null)
    setError("")
  }

  return (
    <div className="min-h-screen gradient-bg py-12 px-4 relative">
      <div className="max-w-2xl mx-auto">
        {/* Header with user menu */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex-1">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 gradient-text float">URL Shortener</h1>
              <p className="text-xl text-muted-foreground">Transform long URLs into short, shareable links ✨</p>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                <a href="/auth">Sign In</a>
              </Button>
            )}
          </div>
        </div>

        {/* Authentication notice for non-authenticated users */}
        {!isAuthenticated && (
          <GlassCard className="mb-8">
            <div className="text-center p-6">
              <p className="text-lg text-muted-foreground mb-4">Sign in to save and manage your shortened URLs</p>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <a href="/auth">Sign In / Sign Up</a>
              </Button>
            </div>
          </GlassCard>
        )}

        <GlassCard className="mb-8">
          <Card className="bg-transparent border-0 shadow-none">
            <CardHeader className="text-center pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl mb-2">
                <Link className="h-6 w-6" />
                Shorten Your URL
              </CardTitle>
              <CardDescription className="text-lg">
                Enter a long URL to get a shortened version that's easy to share
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    type="url"
                    placeholder="https://example.com/very/long/url/path"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="text-lg h-14 bg-white/5 border-white/20 focus:border-purple-400 focus:ring-purple-400"
                  />

                  {isAuthenticated && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Custom slug (optional)"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                        className="text-lg h-12 bg-white/5 border-white/20 focus:border-blue-400 focus:ring-blue-400"
                      />
                      <p className="text-sm text-muted-foreground mt-2">Leave empty for auto-generated slug</p>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
                  disabled={isLoading || !url}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Shortening...
                    </div>
                  ) : (
                    "Shorten URL"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </GlassCard>

        {shortenedUrl && (
          <GlassCard variant="green" className="mb-8 pulse-slow">
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader className="text-center pb-6">
                <CardTitle className="flex items-center justify-center gap-2 text-green-400 text-xl">
                  <CheckCircle className="h-6 w-6" />
                  URL Shortened Successfully! 🎉
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Original URL:</label>
                      <div className="text-sm break-all bg-white/5 p-3 rounded-lg border border-white/10">
                        {shortenedUrl.originalUrl}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground block mb-2">Shortened URL:</label>
                      <div className="flex items-center gap-3">
                        <Input
                          value={shortenedUrl.shortUrl}
                          readOnly
                          className="bg-white/10 border-white/20 font-mono text-sm"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(shortenedUrl.shortUrl)}
                          className="bg-white/10 border-white/20 hover:bg-white/20 h-10 w-10 flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="bg-white/10 border-white/20 hover:bg-white/20 flex-1"
                    >
                      Shorten Another URL
                    </Button>
                    {isAuthenticated && (
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 flex-1"
                      >
                        <a href="/dashboard">View Dashboard</a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlassCard>
        )}

        <div className="text-center">
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">Want to see all your shortened URLs?</p>
              <Button variant="outline" size="lg" asChild className="bg-white/10 border-white/20 hover:bg-white/20">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">Sign in to save and manage your URLs</p>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <a href="/auth">Get Started</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
