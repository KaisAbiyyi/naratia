'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-states'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean // true = requires authentication, false = requires NO authentication
  redirectTo?: string // where to redirect if condition not met
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/' 
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Wait for auth state to load
    
    if (requireAuth && !user) {
      // Page requires auth but user is not logged in
      console.log('🔒 AuthGuard: Redirecting unauthenticated user to:', redirectTo)
      router.push(redirectTo)
    } else if (!requireAuth && user) {
      // Page requires NO auth but user is logged in (login/register pages)
      console.log('🔒 AuthGuard: Redirecting authenticated user to:', redirectTo)
      router.push(redirectTo)
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If requireAuth=true and no user, don't render children (will redirect)
  if (requireAuth && !user) {
    return null
  }

  // If requireAuth=false and user exists, don't render children (will redirect)  
  if (!requireAuth && user) {
    return null
  }

  // All conditions met, render the protected content
  return <>{children}</>
}