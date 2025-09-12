-- Migration: 0003_automatic_profile_creation.sql
-- Description: Add database trigger to automatically create user profiles on authentication

-- Function to create user profile when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert new user profile with default values (matching schema.ts structure)
  INSERT INTO public.users (
    id,
    email,
    username,
    display_name,
    avatar_url,
    content_preference,
    total_xp,
    current_level,
    reading_streak,
    voting_streak,
    writing_streak
    -- created_at and updated_at will be handled by DEFAULT NOW()
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
    -- Extract avatar URL from OAuth metadata
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    ),
    'general', -- content_preference (matching schema.ts enum)
    0, -- total_xp
    1, -- current_level
    0, -- reading_streak
    0, -- voting_streak
    0  -- writing_streak
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
CREATE POLICY "Enable auth admin to create profiles" ON users
  FOR INSERT 
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;