import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth"

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

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
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      // If invalid JSON, clear the value and return null
      localStorage.removeItem("user")
      return null
    }
  }

  private setStoredUser(user: any): void {
    localStorage.setItem("user", JSON.stringify(user))
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
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
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
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

    // Map UI routes to backend routes
    let fullUrl = url
    if (url === "/api/urls") {
      fullUrl = `${API_BASE_URL}/admin/url/list`
    } else if (url.startsWith("/api/urls/")) {
      // DELETE or other actions on a specific URL
      const id = url.replace("/api/urls/", "")
      fullUrl = `${API_BASE_URL}/admin/url/${id}`
    } else if (!url.startsWith("http")) {
      fullUrl = `${API_BASE_URL}${url}`
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    })

    if (response.status === 401 && typeof window !== "undefined") {
      this.removeStoredToken()
      // Optionally, also clear user state if you have a context
      window.location.href = "/auth?message=session-expired"
      // Return a rejected promise to halt further processing
      return Promise.reject(new Error("Session expired. Please log in again."))
    }

    return response
  }
}

export const authService = new AuthService()
