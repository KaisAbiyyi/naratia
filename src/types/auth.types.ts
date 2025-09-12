export interface UserProfile {
  id: string
  username: string | null
  display_name: string | null
  email: string | null
  birth_date: string | null
  bio: string | null
  avatar_url: string | null
  total_xp: number
  current_level: number
  content_preference: 'general' | 'teen' | 'mature' | 'adult'
  reading_streak: number
  voting_streak: number
  writing_streak: number
  perfect_days_count: number
  last_activity_date: string | null
  created_at: string
  updated_at: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  username: string
  displayName: string
}

export interface AuthError {
  message: string
  code?: string
}