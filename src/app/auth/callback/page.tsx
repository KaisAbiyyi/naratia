'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=callback_error')
          return
        }

        if (data.session) {
          // Check if user profile exists
          const { data: profile } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.session.user.id)
            .single()

          if (!profile) {
            // Create profile for OAuth users
            const userData = {
              id: data.session.user.id,
              email: data.session.user.email,
              username: data.session.user.user_metadata?.preferred_username || 
                       data.session.user.email?.split('@')[0],
              display_name: data.session.user.user_metadata?.full_name || 
                           data.session.user.user_metadata?.name,
              avatar_url: data.session.user.user_metadata?.avatar_url,
              age_verified: false,
              content_tier_preference: 'general' as const,
            }

            await supabase.from('users').insert([userData])
          }

          router.push('/dashboard')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}