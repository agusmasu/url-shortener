export interface User {
  id: string
  email: string
  name?: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}
