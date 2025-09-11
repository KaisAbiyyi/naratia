'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardOptions {
  requireAuth?: boolean
  requireVerifiedAge?: boolean
  redirectTo?: string
  redirectUnauthenticated?: string
}

export function useAuthGuard({
  requireAuth = true,
  requireVerifiedAge = false,
  redirectTo = '/auth/login',
  redirectUnauthenticated = '/auth/login',
}: AuthGuardOptions = {}) {
  const { user, profile, loading } = useAuth()
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !user) {
      router.push(redirectUnauthenticated)
      return
    }

    // Check age verification requirement
    if (requireVerifiedAge && user && profile) {
      if (!profile.age_verified) {
        setShowAgeVerification(true)
        return
      }
    }

    // If user is authenticated but shouldn't be (e.g., on login page)
    if (!requireAuth && user) {
      router.push(redirectTo)
      return
    }

  }, [user, profile, loading, requireAuth, requireVerifiedAge, redirectTo, redirectUnauthenticated, router])

  const closeAgeVerification = () => {
    setShowAgeVerification(false)
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAgeVerified: profile?.age_verified || false,
    showAgeVerification,
    closeAgeVerification,
  }
}