'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getProfileRedirectUrl } from '@/utils/auth-redirect'
import { BirthDateModal } from '@/components/auth/BirthDateModal'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

function OAuthHandlerContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, loading } = useAuth()
  const [showBirthDateModal, setShowBirthDateModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    // Check if we have OAuth callback parameters
    const hasOAuthParams = searchParams.has('code') || searchParams.has('access_token') || searchParams.has('refresh_token')
    
    if (!hasOAuthParams || loading) {
      return
    }

    const handleOAuthCallback = async () => {
      if (isProcessing) return
      
      setIsProcessing(true)
      setStatus('Processing OAuth authentication...')

      try {
        if (user && profile) {
          // User is authenticated and has a profile
          console.log('OAuthHandler - profile check:', { 
            birth_date: profile.birth_date, 
            hasBirthDate: !!profile.birth_date,
            shouldShowModal: !profile.birth_date 
          })
          
          if (!profile.birth_date) {
            // Show birth date modal for OAuth users who don't have it set
            console.log('OAuthHandler - showing birth date modal')
            setStatus('Profile setup required...')
            setShowBirthDateModal(true)
          } else {
            // User has birth_date, redirect to homepage
            console.log('OAuthHandler - redirecting to homepage')
            setStatus('Redirecting to homepage...')
            router.push('/')
          }
        } else if (user && !profile) {
          // User authenticated but no profile yet, wait for it to be created
          setStatus('Setting up your profile...')
          // The AuthContext will handle profile creation via trigger/fallback
          setTimeout(() => {
            // Refresh the page to let AuthContext complete the profile creation
            window.location.reload()
          }, 2000)
        }
      } catch (error) {
        console.error('OAuth callback error:', error)
        setStatus('Authentication failed. Redirecting...')
        setTimeout(() => {
          router.push('/login?error=oauth_error')
        }, 2000)
      } finally {
        setIsProcessing(false)
      }
    }

    if (user !== null) { // Wait for auth state to be determined
      handleOAuthCallback()
    }
  }, [user, profile, loading, searchParams, router, isProcessing])

  const handleBirthDateComplete = async () => {
    setShowBirthDateModal(false)
    if (user) {
      setStatus('Redirecting to your profile...')
      const supabase = createClient()
      const redirectUrl = await getProfileRedirectUrl(user.id, supabase)
      router.push(redirectUrl)
    }
  }

  // Only show the handler if we have OAuth params and are processing
  const hasOAuthParams = searchParams.has('code') || searchParams.has('access_token') || searchParams.has('refresh_token')
  
  if (!hasOAuthParams || (!isProcessing && !status && !showBirthDateModal)) {
    return null
  }

  return (
    <>
      {(isProcessing || status) && !showBirthDateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <h1 className="text-2xl font-semibold">Welcome back!</h1>
            <p className="text-muted-foreground">
              {status || 'Completing your sign in...'}
            </p>
          </div>
        </div>
      )}
      
      <BirthDateModal
        isOpen={showBirthDateModal}
        onClose={handleBirthDateComplete}
      />
    </>
  )
}

export function OAuthHandler() {
  return (
    <Suspense fallback={null}>
      <OAuthHandlerContent />
    </Suspense>
  )
}