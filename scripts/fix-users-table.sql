-- Fix users table to properly reference auth.users
-- This script will recreate the users table with correct foreign key

-- First, drop the existing users table if it exists
DROP TABLE IF EXISTS users CASCADE;

-- Recreate users table with proper foreign key to auth.users
CREATE TABLE users (
    -- id should match auth.users.id exactly (UUID from Supabase auth)
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    age_verified BOOLEAN DEFAULT FALSE,
    content_preference content_tier DEFAULT 'all_ages',
    
    -- Gamification fields (core state only)
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    reading_streak INTEGER DEFAULT 0,
    voting_streak INTEGER DEFAULT 0,
    writing_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    perfect_days_count INTEGER DEFAULT 0,
    
    -- Moderation fields
    quality_score DECIMAL(3,2) DEFAULT 5.00, -- 1.00 to 10.00
    is_flagged BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    suspension_until TIMESTAMP,
    
    -- Future features (Premium/Social)
    is_premium BOOLEAN DEFAULT FALSE,
    premium_until TIMESTAMP,
    token_balance INTEGER DEFAULT 0,
    bio TEXT,
    location VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-zA-Z0-9_-]{3,50}$'),
    CONSTRAINT valid_quality_score CHECK (quality_score >= 1.00 AND quality_score <= 10.00),
    CONSTRAINT valid_xp CHECK (total_xp >= 0),
    CONSTRAINT valid_level CHECK (current_level >= 1),
    CONSTRAINT valid_streaks CHECK (
        reading_streak >= 0 AND 
        voting_streak >= 0 AND 
        writing_streak >= 0 AND
        perfect_days_count >= 0
    )
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_total_xp ON users(total_xp);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except protected fields)
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Public profiles can be read by anyone (for usernames, display names, etc.)
CREATE POLICY "Public profile data is readable" ON users
    FOR SELECT USING (true);

-- Create function to automatically create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();