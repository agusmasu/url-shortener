import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, Search } from "lucide-react"
import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <GlassCard className="max-w-md w-full p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">404 - Not Found</h1>
          <p className="text-muted-foreground">
            The shortened URL you're looking for doesn't exist or may have been removed.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <h3 className="font-medium mb-3 text-red-400">Possible reasons:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                The URL slug is incorrect
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                The shortened URL has expired
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                The URL was deleted by its creator
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Link href="/" className="flex items-center justify-center">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-white/10 border-white/20 hover:bg-white/20">
              <Link href="/dashboard" className="flex items-center justify-center">
                <Search className="h-4 w-4 mr-2" />
                View All URLs
              </Link>
            </Button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
