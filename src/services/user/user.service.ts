import { supabase } from '@/lib/supabase/client'
import { UserProfile } from '@/types/auth.types'

export interface UserService {
  getUserProfile(username: string): Promise<UserProfile>
  getUserProfileById(userId: string): Promise<UserProfile>
}

class SupabaseUserService implements UserService {
  async getUserProfile(username: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error) {
      throw new Error(`User not found: ${error.message}`)
    }

    if (!data) {
      throw new Error('User not found')
    }

    // Get user's preferred genres (if the table exists)
    const preferredGenres: string[] = data.preferred_genres || []

    return {
      id: data.id,
      username: data.username,
      display_name: data.display_name,
      email: data.email,
      birth_date: data.birth_date,
      bio: data.bio,
      avatar_url: data.avatar_url,
      total_xp: data.total_xp || 0,
      current_level: data.current_level || 1,
      stories_created: data.stories_created || 0,
      contributions_made: data.contributions_made || 0,
      votes_cast: data.votes_cast || 0,
      content_tier_preference: data.content_tier_preference || 'general',
      reading_streak_current: data.reading_streak_current || 0,
      reading_streak_best: data.reading_streak_best || 0,
      writing_streak_current: data.writing_streak_current || 0,
      writing_streak_best: data.writing_streak_best || 0,
      voting_streak_current: data.voting_streak_current || 0,
      voting_streak_best: data.voting_streak_best || 0,
      last_activity_date: data.last_activity_date,
      account_created_at: data.account_created_at,
      is_active: data.is_active,
      preferred_genres: preferredGenres
    }
  }

  async getUserProfileById(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single()

    if (error || !data?.username) {
      throw new Error('User not found')
    }

    return this.getUserProfile(data.username)
  }
}

export const userService = new SupabaseUserService()

// Server-side function for use in server components
export async function getUserProfile(username: string): Promise<UserProfile> {
  return userService.getUserProfile(username)
}

export async function getUserProfileById(userId: string): Promise<UserProfile> {
  return userService.getUserProfileById(userId)
}