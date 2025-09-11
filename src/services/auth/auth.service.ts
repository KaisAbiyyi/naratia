// Authentication Service following Single Responsibility Principle
import { supabase } from '@/lib/supabase/client'
import type { LoginForm, RegisterForm, User } from '@/types'

export interface AuthService {
  signUp(credentials: RegisterForm): Promise<{ user: User | null; error: any }>
  signIn(credentials: LoginForm): Promise<{ user: User | null; error: any }>
  signOut(): Promise<{ error: any }>
  getCurrentUser(): Promise<{ user: User | null; error: any }>
  signInWithGoogle(): Promise<{ user: User | null; error: any }>
}

class SupabaseAuthService implements AuthService {
  async signUp(credentials: RegisterForm) {
    const { data, error } = await supabase.auth.signUp({
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    return {
      user: data.user ? this.mapSupabaseUser(data.user) : null,
      error,
    }
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    return {
      user: data.user ? this.mapSupabaseUser(data.user) : null,
      error,
    }
  }

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    return {
      user: null, // OAuth doesn't return user immediately, handled by callback
      error,
    }
  }

  private mapSupabaseUser(supabaseUser: any): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
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

export const authService = new SupabaseAuthService()