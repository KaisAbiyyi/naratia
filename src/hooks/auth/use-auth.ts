// Authentication Hook following Single Responsibility Principle
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services'
import type { User, LoginForm, RegisterForm } from '@/types'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

interface AuthActions {
  signIn: (credentials: LoginForm) => Promise<void>
  signUp: (credentials: RegisterForm) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      // Actions
      signIn: async (credentials: LoginForm) => {
        set({ isLoading: true, error: null })
        try {
          const { user, error } = await authService.signIn(credentials)
          if (error) throw error
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Sign in failed', 
            isLoading: false 
          })
        }
      },

      signUp: async (credentials: RegisterForm) => {
        set({ isLoading: true, error: null })
        try {
          const { user, error } = await authService.signUp(credentials)
          if (error) throw error
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Sign up failed', 
            isLoading: false 
          })
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        try {
          const { error } = await authService.signOut()
          if (error) throw error
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Sign out failed', 
            isLoading: false 
          })
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null })
        try {
          const { user, error } = await authService.signInWithGoogle()
          if (error) throw error
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Google sign in failed', 
            isLoading: false 
          })
        }
      },

      checkAuth: async () => {
        set({ isLoading: true })
        try {
          const { user, error } = await authService.getCurrentUser()
          if (error && error.name !== 'AuthApiError') throw error
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Auth check failed', 
            isLoading: false,
            user: null,
            isAuthenticated: false
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

// Custom hook for easier usage
export const useAuth = () => {
  const store = useAuthStore()
  
  return {
    user: store.user,
    isLoading: store.isLoading,
    isAuthenticated: store.isAuthenticated,
    error: store.error,
    signIn: store.signIn,
    signUp: store.signUp,
    signOut: store.signOut,
    signInWithGoogle: store.signInWithGoogle,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
  }
}