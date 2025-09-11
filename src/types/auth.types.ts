export interface UserProfile {
  id: string
  username: string | null
  display_name: string | null
  email: string | null
  age_verified: boolean
  bio: string | null
  avatar_url: string | null
  total_xp: number
  current_level: number
  stories_created: number
  contributions_made: number
  votes_cast: number
  content_tier_preference: 'general' | 'teen' | 'mature' | 'adult'
  reading_streak_current: number
  reading_streak_best: number
  writing_streak_current: number
  writing_streak_best: number
  voting_streak_current: number
  voting_streak_best: number
  last_activity_date: string | null
  account_created_at: string
  is_active: boolean
  preferred_genres: string[]
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
  ageVerified: boolean
  contentTierPreference: 'general' | 'teen' | 'mature' | 'adult'
}

export interface AuthError {
  message: string
  code?: string
}