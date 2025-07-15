import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

class AuthService {
  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("accessToken")
  }

  private setStoredToken(token: string): void {
    localStorage.setItem("accessToken", token)
  }

  private removeStoredToken(): void {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
  }

  private getStoredUser() {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  private setStoredUser(user: any): void {
    localStorage.setItem("user", JSON.stringify(user))
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      const data: AuthResponse = await response.json()

      // Store token and user data
      this.setStoredToken(data.accessToken)
      this.setStoredUser(data.user)

      return data
    } catch (error) {
      // For demo purposes, simulate successful login
      if (credentials.email === "demo@example.com" && credentials.password === "password") {
        const mockResponse: AuthResponse = {
          user: {
            id: "1",
            email: credentials.email,
            name: "Demo User",
            createdAt: new Date().toISOString(),
          },
          accessToken: "mock-jwt-token-" + Date.now(),
        }

        this.setStoredToken(mockResponse.accessToken)
        this.setStoredUser(mockResponse.user)

        return mockResponse
      }

      throw error
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      const data: AuthResponse = await response.json()

      // Store token and user data
      this.setStoredToken(data.accessToken)
      this.setStoredUser(data.user)

      return data
    } catch (error) {
      // For demo purposes, simulate successful registration
      const mockResponse: AuthResponse = {
        user: {
          id: Date.now().toString(),
          email: userData.email,
          name: userData.name || "New User",
          createdAt: new Date().toISOString(),
        },
        accessToken: "mock-jwt-token-" + Date.now(),
      }

      this.setStoredToken(mockResponse.accessToken)
      this.setStoredUser(mockResponse.user)

      return mockResponse
    }
  }

  logout(): void {
    this.removeStoredToken()
  }

  getToken(): string | null {
    return this.getStoredToken()
  }

  getUser() {
    return this.getStoredUser()
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }

  // Helper method to make authenticated API calls
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getStoredToken()

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }
}

export const authService = new AuthService()
