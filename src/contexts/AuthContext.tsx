'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/types/auth.types'

// Tipe AuthContext tetap sama
interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUpWithEmail: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  // 1. Buat client di dalam komponen, bukan dari import statis
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Enhanced fetchProfile with email-based check and creation
  const fetchProfile = useCallback(async (userId: string, userEmail?: string): Promise<UserProfile | null> => {
    console.log('🔍 Fetching profile for user:', userId, 'email:', userEmail)
    
    try {
      // Step 1: Try to find profile by userId first
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        console.log('✅ Profile found by userId:', data)
        return data
      }

      // Step 2: If not found by userId but we have email, check by email
      if (error?.code === 'PGRST116' && userEmail) {
        console.log('👤 Profile not found by userId, checking by email:', userEmail)
        
        const { data: emailProfile } = await supabase
          .from('users')
          .select('*')
          .eq('email', userEmail)
          .single()

        if (emailProfile) {
          console.log('✅ Profile found by email, updating userId:', emailProfile)
          
          // Update the existing profile with the new userId from auth.users
          const { data: updatedProfile, error: updateError } = await supabase
            .from('users')
            .update({ id: userId })
            .eq('email', userEmail)
            .select('*')
            .single()
            
          if (updateError) {
            console.error('❌ Failed to update profile userId:', updateError)
            return emailProfile // Return the old profile anyway
          }
          
          console.log('✅ Profile userId updated successfully:', updatedProfile)
          return updatedProfile
        }
      }

      // Step 3: If no profile exists, create a new one
      if (error?.code === 'PGRST116' && userEmail) {
        console.log('🆕 Creating new profile for:', userEmail)
        
        // Get username from email (before @ symbol)
        const defaultUsername = userEmail.split('@')[0]
        
        const newProfile = {
          id: userId,
          email: userEmail,
          username: defaultUsername,
          display_name: defaultUsername,
          total_xp: 0,
          current_level: 1,
          content_preference: 'general',
          reading_streak: 0,
          voting_streak: 0,
          writing_streak: 0,
          // Don't set created_at - let database handle it with DEFAULT NOW()
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('users')
          .insert(newProfile)
          .select('*')
          .single()

        if (createError) {
          console.error('❌ Failed to create new profile:', createError)
          return null
        }

        console.log('✅ New profile created successfully:', createdProfile)
        return createdProfile
      }

      console.error('❌ Profile fetch error:', error)
      return null
    } catch (err) {
      console.error('❌ Unexpected error in fetchProfile:', err)
      return null
    }
  }, [supabase])

  // 2. Sederhanakan useEffect, cukup andalkan onAuthStateChange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔔 Auth event: ${event}`, { hasSession: !!session, userId: session?.user?.id })
        
        if (session?.user) {
          // Event: INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED
          setSession(session)
          setUser(session.user)
          
          // ALWAYS check and create profile for any login method
          console.log(`👤 Checking/creating profile for user: ${session.user.id}`)
          const profileData = await fetchProfile(session.user.id, session.user.email || undefined)
          setProfile(profileData)
        } else {
          // Event: SIGNED_OUT
          console.log('🚪 User signed out, clearing state')
          setSession(null)
          setUser(null)
          setProfile(null)
        }
        
        // Pengecekan awal selesai, loading bisa di-set ke false
        setLoading(false)
      }
    )

    // Unsubscribe saat komponen di-unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])


  // --- Fungsi-fungsi otentikasi ---
  // Tidak perlu diubah karena mereka sudah menggunakan variabel 'supabase'
  // yang sekarang sudah benar.

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUpWithEmail = async (email: string, password: string, userData: Partial<UserProfile>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` }
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    // State akan di-clear oleh onAuthStateChange secara otomatis
    return { error }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in')
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (!error && data) {
      setProfile(data)
    }
    
    return { error }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}