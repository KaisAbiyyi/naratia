// services/auth/auth.service.ts

import type { LoginForm, RegisterForm, User } from '@/types'
import type { SupabaseClient, User as SupabaseUser, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// Interface diperbarui untuk menggunakan AuthError, bukan 'any'
export interface AuthService {
  signUp(credentials: RegisterForm): Promise<{ user: User | null; error: AuthError | null }>
  signIn(credentials: LoginForm): Promise<{ user: User | null; error: AuthError | null }>
  signOut(): Promise<{ error: AuthError | null }>
  getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }>
  signInWithGoogle(): Promise<{ user: User | null; error: AuthError | null }>
}

export class SupabaseAuthService implements AuthService {
  constructor(private supabase: SupabaseClient) {}

  async signUp(credentials: RegisterForm) {
    const { data, error } = await this.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          username: credentials.username,
          age_verified: credentials.ageVerified,
        },
      },
    })

    return {
      user: data.user ? this.mapSupabaseUser(data.user) : null,
      error,
    }
  }

  async signIn(credentials: LoginForm) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    return {
      user: data.user ? this.mapSupabaseUser(data.user) : null,
      error,
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser() {
    const { data, error } = await this.supabase.auth.getUser()
    return {
      user: data.user ? this.mapSupabaseUser(data.user) : null,
      error,
    }
  }

  async signInWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    
    // OAuth doesn't return user immediately, only after redirect
    return { user: null, error }
  }

  // Fungsi ini dilengkapi untuk memenuhi semua properti dari tipe 'User'
  private mapSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      username: supabaseUser.user_metadata?.username || '',
      displayName: supabaseUser.user_metadata?.display_name,
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
      ageVerified: supabaseUser.user_metadata?.age_verified || false,
      contentPreference: supabaseUser.user_metadata?.content_preference || 'all_ages',
      totalXp: supabaseUser.user_metadata?.total_xp || 0,
      currentLevel: supabaseUser.user_metadata?.current_level || 1,
      readingStreak: supabaseUser.user_metadata?.reading_streak || 0,
      votingStreak: supabaseUser.user_metadata?.voting_streak || 0,
      writingStreak: supabaseUser.user_metadata?.writing_streak || 0,
      createdAt: supabaseUser.created_at,
      updatedAt: supabaseUser.updated_at || supabaseUser.created_at,
    }
  }
}

// Export instance
export const authService = new SupabaseAuthService(createClient())