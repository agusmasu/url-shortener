import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "default" | "purple" | "blue" | "green"
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  const variants = {
    default: "bg-white/10 dark:bg-white/5 border-white/20",
    purple: "bg-purple-500/10 dark:bg-purple-500/5 border-purple-500/20 glow-purple",
    blue: "bg-blue-500/10 dark:bg-blue-500/5 border-blue-500/20 glow-blue",
    green: "bg-green-500/10 dark:bg-green-500/5 border-green-500/20 glow-green",
  }

  return (
    <div className={cn("backdrop-blur-xl border rounded-xl shadow-2xl", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}
