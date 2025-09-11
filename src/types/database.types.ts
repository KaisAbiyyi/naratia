export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
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
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          email?: string | null
          age_verified?: boolean
          bio?: string | null
          avatar_url?: string | null
          total_xp?: number
          current_level?: number
          stories_created?: number
          contributions_made?: number
          votes_cast?: number
          content_tier_preference?: 'general' | 'teen' | 'mature' | 'adult'
          reading_streak_current?: number
          reading_streak_best?: number
          writing_streak_current?: number
          writing_streak_best?: number
          voting_streak_current?: number
          voting_streak_best?: number
          last_activity_date?: string | null
          account_created_at?: string
          is_active?: boolean
          preferred_genres?: string[]
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          email?: string | null
          age_verified?: boolean
          bio?: string | null
          avatar_url?: string | null
          total_xp?: number
          current_level?: number
          stories_created?: number
          contributions_made?: number
          votes_cast?: number
          content_tier_preference?: 'general' | 'teen' | 'mature' | 'adult'
          reading_streak_current?: number
          reading_streak_best?: number
          writing_streak_current?: number
          writing_streak_best?: number
          voting_streak_current?: number
          voting_streak_best?: number
          last_activity_date?: string | null
          account_created_at?: string
          is_active?: boolean
          preferred_genres?: string[]
        }
        Relationships: []
      }
      stories: {
        Row: {
          id: string
          title: string
          initial_paragraph: string
          creator_id: string
          is_private: boolean
          content_tier: 'general' | 'teen' | 'mature' | 'adult'
          max_contributors: number | null
          voting_deadline_hours: number
          is_completed: boolean
          completion_reason: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          initial_paragraph: string
          creator_id: string
          is_private?: boolean
          content_tier?: 'general' | 'teen' | 'mature' | 'adult'
          max_contributors?: number | null
          voting_deadline_hours?: number
          is_completed?: boolean
          completion_reason?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          initial_paragraph?: string
          creator_id?: string
          is_private?: boolean
          content_tier?: 'general' | 'teen' | 'mature' | 'adult'
          max_contributors?: number | null
          voting_deadline_hours?: number
          is_completed?: boolean
          completion_reason?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "stories_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      genres: {
        Row: {
          id: string
          name: string
          description: string | null
          color_code: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color_code?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color_code?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_tier: 'general' | 'teen' | 'mature' | 'adult'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}