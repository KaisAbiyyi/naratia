import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { UserProfile } from '@/types/auth.types'

export interface UserService {
  getUserProfile(username: string): Promise<UserProfile>
  getUserProfileById(userId: string): Promise<UserProfile>
}

class SupabaseUserService implements UserService {
  private supabase = createClient()
  
  async getUserProfile(username: string): Promise<UserProfile> {
    console.log('getUserProfile called with username:', username)
    
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    console.log('Supabase query result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(`User not found: ${error.message} (Code: ${error.code})`)
    }

    if (!data) {
      throw new Error('User not found - no data returned')
    }

    const profile: UserProfile = {
      id: data.id,
      username: data.username,
      display_name: data.display_name,
      email: data.email,
      birth_date: data.birth_date,
      bio: data.bio,
      avatar_url: data.avatar_url,
      total_xp: data.total_xp || 0,
      current_level: data.current_level || 1,
      content_preference: data.content_preference || 'general',
      reading_streak: data.reading_streak || 0,
      voting_streak: data.voting_streak || 0,
      writing_streak: data.writing_streak || 0,
      perfect_days_count: data.perfect_days_count || 0,
      last_activity_date: data.last_activity_date,
      created_at: data.created_at,
      updated_at: data.updated_at
    }

    console.log('Returning profile:', profile)
    return profile
  }

  async getUserProfileById(userId: string): Promise<UserProfile> {
    const { data, error } = await this.supabase
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
  console.log('Server-side getUserProfile called with username:', username)
  
  // Use server client for server components to avoid RLS issues
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  console.log('Server-side Supabase query result:', { data, error })

  if (error) {
    console.error('Server-side Supabase error:', error)
    throw new Error(`User not found: ${error.message} (Code: ${error.code})`)
  }

  if (!data) {
    throw new Error('User not found - no data returned')
  }

  const profile: UserProfile = {
    id: data.id,
    username: data.username,
    display_name: data.display_name,
    email: data.email,
    birth_date: data.birth_date,
    bio: data.bio,
    avatar_url: data.avatar_url,
    total_xp: data.total_xp || 0,
    current_level: data.current_level || 1,
    content_preference: data.content_preference || 'general',
    reading_streak: data.reading_streak || 0,
    voting_streak: data.voting_streak || 0,
    writing_streak: data.writing_streak || 0,
    perfect_days_count: data.perfect_days_count || 0,
    last_activity_date: data.last_activity_date,
    created_at: data.created_at,
    updated_at: data.updated_at
  }

  console.log('Server-side returning profile:', profile)
  return profile
}

export async function getUserProfileById(userId: string): Promise<UserProfile> {
  // Use server client for server components
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .single()

  if (error || !data?.username) {
    throw new Error('User not found')
  }

  // Reuse the server-side getUserProfile function
  return getUserProfile(data.username)
}