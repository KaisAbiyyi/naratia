-- This file can be run in Supabase SQL Editor or via CLI
-- Run the automatic profile creation migration

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert new user profile with default values
  INSERT INTO public.users (
    id,
    email,
    username,
    display_name,
    total_xp,
    current_level,
    stories_created,
    contributions_made,
    votes_cast,
    content_tier_preference,
    reading_streak_current,
    reading_streak_best,
    writing_streak_current,
    writing_streak_best,
    voting_streak_current,
    voting_streak_best,
    account_created_at,
    is_active,
    preferred_genres
  )
  VALUES (
    new.id,
    new.email,
    -- Generate a default username from email if not provided
    COALESCE(
      new.raw_user_meta_data->>'username',
      SPLIT_PART(new.email, '@', 1)
    ),
    -- Use display_name from metadata or fall back to email prefix
    COALESCE(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      SPLIT_PART(new.email, '@', 1)
    ),
    0, -- total_xp
    1, -- current_level
    0, -- stories_created
    0, -- contributions_made
    0, -- votes_cast
    'general', -- content_tier_preference
    0, -- reading_streak_current
    0, -- reading_streak_best
    0, -- writing_streak_current
    0, -- writing_streak_best
    0, -- voting_streak_current
    0, -- voting_streak_best
    now(), -- account_created_at
    true, -- is_active
    '{}' -- preferred_genres (empty array)
  );
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- User profile already exists, do nothing
    RETURN new;
  WHEN OTHERS THEN
    -- Log error but don't prevent auth user creation
    RAISE LOG 'Error creating user profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;

-- Create trigger to automatically create user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON public.users TO supabase_auth_admin;

-- Create policy to allow the trigger to insert user profiles
DROP POLICY IF EXISTS "Enable auth admin to create profiles" ON users;
CREATE POLICY "Enable auth admin to create profiles" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;