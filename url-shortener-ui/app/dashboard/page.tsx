"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Copy, ExternalLink, Search, ArrowLeft, Trash2, BarChart3, TrendingUp, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
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

function DashboardContent() {
  const [urls, setUrls] = useState<ShortenedUrl[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUrls, setFilteredUrls] = useState<ShortenedUrl[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { user } = useAuth()

  useEffect(() => {
    loadUrls()
  }, [])

  const loadUrls = async () => {
    setIsLoading(true)
    try {
      // Try to fetch from API first
      const response = await authService.authenticatedFetch("/api/urls")

      if (response.ok) {
        const data = await response.json()
        setUrls(data)
        setFilteredUrls(data)
      } else {
        // Fallback to localStorage for demo
        const savedUrls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]")
        // Filter URLs for current user if userId exists
        const userUrls = user?.id ? savedUrls.filter((url: ShortenedUrl) => url.userId === user.id) : savedUrls
        setUrls(userUrls)
        setFilteredUrls(userUrls)
      }
    } catch (error) {
      // Fallback to localStorage
      const savedUrls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]")
      setUrls(savedUrls)
      setFilteredUrls(savedUrls)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Filter URLs based on search term
    const filtered = urls.filter(
      (url) =>
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUrls(filtered)
  }, [searchTerm, urls])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied! ✨",
        description: "URL copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      })
    }
  }

  const deleteUrl = async (id: string) => {
    try {
      // Try API call first
      const response = await authService.authenticatedFetch(`/api/urls/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setUrls(urls.filter((url) => url.id !== id))
        toast({
          title: "Deleted ✨",
          description: "URL has been deleted successfully",
        })
      } else {
        // Fallback to localStorage
        const updatedUrls = urls.filter((url) => url.id !== id)
        setUrls(updatedUrls)

        // Update localStorage
        const allUrls = JSON.parse(localStorage.getItem("shortenedUrls") || "[]")
        const filteredAllUrls = allUrls.filter((url: ShortenedUrl) => url.id !== id)
        localStorage.setItem("shortenedUrls", JSON.stringify(filteredAllUrls))

        toast({
          title: "Deleted ✨",
          description: "URL has been deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete URL",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalVisits = urls.reduce((sum, url) => sum + url.visits, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-xl text-muted-foreground">Welcome back, {user?.name || user?.email}! ✨</p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button asChild variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <UserMenu />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <GlassCard variant="purple" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total URLs</p>
                <p className="text-3xl font-bold text-purple-400">{urls.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </GlassCard>

          <GlassCard variant="blue" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                <p className="text-3xl font-bold text-blue-400">{totalVisits}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </GlassCard>

          <GlassCard variant="green" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Visits</p>
                <p className="text-3xl font-bold text-green-400">
                  {urls.length > 0 ? Math.round(totalVisits / urls.length) : 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-400" />
            </div>
          </GlassCard>
        </div>

        {/* URLs Table */}
        <GlassCard className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your Shortened URLs</h2>
            <p className="text-muted-foreground">Search and manage all your shortened URLs</p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search URLs or slugs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-white/5 border-white/20 focus:border-purple-400 focus:ring-purple-400"
            />
          </div>

          {filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl text-muted-foreground mb-2">
                {urls.length === 0 ? "No URLs shortened yet" : "No URLs match your search"}
              </p>
              <p className="text-muted-foreground mb-6">
                {urls.length === 0 ? "Create your first short URL to get started" : "Try adjusting your search terms"}
              </p>
              {urls.length === 0 && (
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Link href="/">Create Your First Short URL</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-muted-foreground">Original URL</TableHead>
                    <TableHead className="text-muted-foreground">Short URL</TableHead>
                    <TableHead className="text-muted-foreground">Visits</TableHead>
                    <TableHead className="text-muted-foreground">Created</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUrls.map((url) => (
                    <TableRow key={url.id} className="border-white/10 hover:bg-white/5">
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate font-medium">{url.originalUrl}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <code className="bg-white/10 px-3 py-1 rounded-lg text-sm font-mono">{url.slug}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(url.shortUrl)}
                            className="hover:bg-white/10"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {url.visits}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(url.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(url.originalUrl, "_blank")}
                            className="hover:bg-white/10"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteUrl(url.id)}
                            className="hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
