"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/contexts/auth-context"
import { GlassCard } from "@/components/ui/glass-card"

export default function AuthPage() {

  // State to toggle between login and register forms:
  const [isLogin, setIsLogin] = useState(true)
  
  // State to check if the user is authenticated:
  const { isAuthenticated } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      // If the user is authenticated, redirect to the home page:
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
