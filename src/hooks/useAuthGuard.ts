'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface AuthGuardOptions {
  requireAuth?: boolean
  requireBirthDate?: boolean
  redirectTo?: string
  redirectUnauthenticated?: string
}

export function useAuthGuard({
  requireAuth = true,
  requireBirthDate = false,
  redirectTo = '/auth/login',
  redirectUnauthenticated = '/auth/login',
}: AuthGuardOptions = {}) {
  const { user, profile, loading } = useAuth()
  const [showBirthDateModal, setShowBirthDateModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !user) {
      router.push(redirectUnauthenticated)
      return
    }

    // Check birth date requirement
    if (requireBirthDate && user && profile) {
      if (!profile.birth_date) {
        setShowBirthDateModal(true)
        return
      }
    }

    // If user is authenticated but shouldn't be (e.g., on login page)
    if (!requireAuth && user) {
      router.push(redirectTo)
      return
    }

  }, [user, profile, loading, requireAuth, requireBirthDate, redirectTo, redirectUnauthenticated, router])

  const closeBirthDateModal = () => {
    setShowBirthDateModal(false)
  }

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    hasBirthDate: !!profile?.birth_date,
    showBirthDateModal,
    closeBirthDateModal,
  }
}