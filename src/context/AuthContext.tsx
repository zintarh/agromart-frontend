/**
 * Auth Context - Centralized auth state management
 */

import React, { createContext, useContext, useCallback, useEffect, useState } from "react"
import type { User } from "@/api/types"
import { authService } from "@/services/auth"
import { getUser, isAuthenticated } from "@/utils/storage"

interface AuthContextType {
  // State
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    first_name: string
    last_name: string
    email: string
    password: string
    phone: string
    country_code?: string
  }) => Promise<void>
  verifyEmail: (email: string, token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (email: string, token: string, newPassword: string) => Promise<void>
  completeInvite: (data: {
    token: string
    first_name: string
    last_name: string
    password: string
    phone?: string
    country_code?: string
  }) => Promise<void>
  fetchUserProfile: () => Promise<void>
  logout: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getUser())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const handleError = useCallback((err: any) => {
    const message = err?.message || "An error occurred. Please try again."
    setError(message)
    console.error("Auth error:", err)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      clearError()
      try {
        const response = await authService.login(email, password)
        if (response.data?.user) {
          setUser(response.data.user)
        }
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const register = useCallback(
    async (data: {
      first_name: string
      last_name: string
      email: string
      password: string
      phone: string
      country_code?: string
    }) => {
      setIsLoading(true)
      clearError()
      try {
        await authService.register(data)
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const verifyEmail = useCallback(
    async (email: string, token: string) => {
      setIsLoading(true)
      clearError()
      try {
        const response = await authService.verifyEmail(email, token)
        if (response.data?.user) {
          setUser(response.data.user)
        }
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const resendVerification = useCallback(
    async (email: string) => {
      setIsLoading(true)
      clearError()
      try {
        await authService.resendVerification(email)
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const forgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true)
      clearError()
      try {
        await authService.forgotPassword(email)
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const resetPassword = useCallback(
    async (email: string, token: string, newPassword: string) => {
      setIsLoading(true)
      clearError()
      try {
        await authService.resetPassword(email, token, newPassword)
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const completeInvite = useCallback(
    async (data: {
      token: string
      first_name: string
      last_name: string
      password: string
      phone?: string
      country_code?: string
    }) => {
      setIsLoading(true)
      clearError()
      try {
        const response = await authService.completeInvite(data)
        if (response.data?.user) {
          setUser(response.data.user)
        }
      } catch (err) {
        handleError(err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [clearError, handleError]
  )

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true)
    clearError()
    try {
      const response = await authService.getMe()
      if (response.data) {
        setUser(response.data)
      }
    } catch (err) {
      handleError(err)
      // If 401, user is not authenticated
      if ((err as any)?.statusCode === 401) {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [clearError, handleError])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    clearError()
  }, [clearError])

  // Handle unauthorized event from API interceptor
  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener("unauthorized", handleUnauthorized)
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized)
    }
  }, [logout])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: isAuthenticated() && !!user,
    error,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    completeInvite,
    fetchUserProfile,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
