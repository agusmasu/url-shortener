"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/ui/glass-card"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 relative">
      <div className="w-full max-w-md">
        <GlassCard className="p-8">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </GlassCard>
      </div>
    </div>
  )
}
