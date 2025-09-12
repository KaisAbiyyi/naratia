-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_genre_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- SIMPLE AND SAFE USER PROFILE CREATION SYSTEM
-- =============================================================================

-- Drop ALL existing triggers and functions to start clean
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_metadata_update();
DROP FUNCTION IF EXISTS public.ensure_user_profile_exists();
DROP FUNCTION IF EXISTS public.handle_new_user_comprehensive();
DROP FUNCTION IF EXISTS public.handle_user_metadata_update_comprehensive();
DROP FUNCTION IF EXISTS public.ensure_comprehensive_user_profile();

-- Simple function to create user profile ONLY (no complex logic)
CREATE OR REPLACE FUNCTION public.create_user_profile_simple(
  user_id uuid,
  user_email text DEFAULT NULL,
  user_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean AS $$
DECLARE
  username_val varchar(50);
  display_name_val varchar(100);
  avatar_url_val text;
BEGIN
  -- Check if profile already exists - if yes, skip
  IF EXISTS(SELECT 1 FROM public.users WHERE id = user_id) THEN
    RETURN true;
  END IF;
  
  -- Simple username generation with fallbacks
  username_val := COALESCE(
    user_metadata->>'username',
    user_metadata->>'preferred_username',
    split_part(COALESCE(user_email, 'user@example.com'), '@', 1),
    'user_' || substr(user_id::text, 1, 8)
  );
  
  -- Simple display name extraction
  display_name_val := COALESCE(
    user_metadata->>'full_name',
    user_metadata->>'name',
    user_metadata->>'display_name'
  );
  
  -- Simple avatar URL extraction
  avatar_url_val := COALESCE(
    user_metadata->>'avatar_url',
    user_metadata->>'picture'
  );
  
  -- Simple INSERT with minimal error handling (matching schema.ts structure)
  BEGIN
    INSERT INTO public.users (
      id, username, email, display_name, avatar_url,
      content_preference, total_xp, current_level,
      reading_streak, voting_streak, writing_streak
      -- created_at and updated_at will be handled by DEFAULT NOW()
    ) VALUES (
      user_id,
      username_val,
      user_email,
      display_name_val,
      avatar_url_val,
      'general', -- content_preference matching schema.ts enum
      0, -- total_xp
      1, -- current_level  
      0, -- reading_streak
      0, -- voting_streak
      0  -- writing_streak
    );
    
    RETURN true;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log error but DON'T fail the auth process
    RAISE LOG 'Failed to create user profile for %: %', user_id, SQLERRM;
    RETURN false;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- VERY simple trigger function that won't interfere with auth
CREATE OR REPLACE FUNCTION public.handle_new_user_simple()
RETURNS TRIGGER AS $$
BEGIN
  -- Just try to create profile, don't fail if it doesn't work
  PERFORM public.create_user_profile_simple(
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data
  );
  
  -- ALWAYS return NEW to not interfere with auth process
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to ensure user profile exists (for both new and existing users)
CREATE OR REPLACE FUNCTION public.ensure_user_profile_exists(user_id uuid, user_email text, user_metadata jsonb DEFAULT '{}'::jsonb)
RETURNS boolean AS $$
DECLARE
  profile_exists boolean;
BEGIN
  -- Simple check and create
  SELECT EXISTS(SELECT 1 FROM public.users WHERE id = user_id) INTO profile_exists;
  
  IF NOT profile_exists THEN
    -- Use the simple creation function
    RETURN public.create_user_profile_simple(user_id, user_email, user_metadata);
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create ONLY the essential trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_simple();

-- Remove the update trigger completely to avoid conflicts
-- Users can manually sync profile if needed

-- Function to manually ensure all existing auth users have profiles
CREATE OR REPLACE FUNCTION public.sync_existing_users()
RETURNS integer AS $$
DECLARE
  user_record RECORD;
  created_count integer := 0;
BEGIN
  -- Loop through auth users that don't have profiles
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data 
    FROM auth.users au
    WHERE au.id NOT IN (SELECT pu.id FROM public.users pu)
  LOOP
    IF public.create_user_profile_simple(
      user_record.id, 
      user_record.email, 
      user_record.raw_user_meta_data
    ) THEN
      created_count := created_count + 1;
    END IF;
  END LOOP;
  
  RETURN created_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "System can insert user profiles" ON users;
DROP POLICY IF EXISTS "Public user profiles viewable by all" ON users;
DROP POLICY IF EXISTS "Genres are viewable by all authenticated users" ON genres;
DROP POLICY IF EXISTS "Story genres are viewable by all" ON story_genres;
DROP POLICY IF EXISTS "Public stories are viewable by all" ON stories;
DROP POLICY IF EXISTS "Private stories viewable by participants" ON stories;
DROP POLICY IF EXISTS "Users can create stories" ON stories;
DROP POLICY IF EXISTS "Creators can update their own stories" ON stories;
DROP POLICY IF EXISTS "Contributions viewable for story participants" ON story_contributions;
DROP POLICY IF EXISTS "Users can vote on public stories" ON votes;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own content flags" ON content_flags;
DROP POLICY IF EXISTS "Users can view their own reading sessions" ON reading_sessions;
DROP POLICY IF EXISTS "Users can view their own genre preferences" ON user_genre_preferences;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;

-- User policies - comprehensive access control
CREATE POLICY "Users can view their own data" ON users 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users 
FOR UPDATE USING (auth.uid() = id);

-- Allow system/triggers to insert user profiles
CREATE POLICY "System can insert user profiles" ON users 
FOR INSERT WITH CHECK (true);

-- Public user data (username, display_name, avatar) viewable by authenticated users
CREATE POLICY "Public user profiles viewable by all" ON users 
FOR SELECT USING (auth.role() = 'authenticated');

-- Genre policies - genres are public for authenticated users
CREATE POLICY "Genres are viewable by all authenticated users" ON genres 
FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

CREATE POLICY "Admins can manage genres" ON genres 
FOR ALL USING (
    auth.uid() IN (
        SELECT id FROM users WHERE is_premium = true -- Or create admin role
    )
);

-- Story genre junction table - viewable by all authenticated users
CREATE POLICY "Story genres are viewable by authenticated users" ON story_genres 
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Story creators can manage story genres" ON story_genres 
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM stories 
        WHERE id = story_id AND creator_id = auth.uid()
    )
);

-- Story policies - comprehensive story access control
CREATE POLICY "Public stories are viewable by all" ON stories 
FOR SELECT USING (
    NOT is_private AND 
    auth.role() = 'authenticated'
);

CREATE POLICY "Private stories viewable by participants" ON stories 
FOR SELECT USING (
    is_private AND (
        creator_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM story_contributions 
            WHERE story_id = stories.id AND contributor_id = auth.uid()
        )
    )
);

CREATE POLICY "Users can create stories" ON stories 
FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own stories" ON stories 
FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their own stories" ON stories 
FOR DELETE USING (creator_id = auth.uid());

-- Story contribution policies - comprehensive contribution access
CREATE POLICY "Contributions viewable for story participants" ON story_contributions 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM stories 
        WHERE id = story_id AND (
            NOT is_private OR 
            creator_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM story_contributions sc 
                WHERE sc.story_id = stories.id AND sc.contributor_id = auth.uid()
            )
        )
    )
);

CREATE POLICY "Users can create contributions" ON story_contributions 
FOR INSERT WITH CHECK (
    contributor_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM stories 
        WHERE id = story_id AND status = 'active'
    )
);

CREATE POLICY "Users can update their own contributions" ON story_contributions 
FOR UPDATE USING (
    contributor_id = auth.uid() AND 
    status = 'pending'
);

CREATE POLICY "Story creators can manage contributions" ON story_contributions 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM stories 
        WHERE id = story_id AND creator_id = auth.uid()
    )
);

-- Vote policies - comprehensive voting system
CREATE POLICY "Users can vote on accessible stories" ON votes 
FOR ALL USING (
    voter_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM stories 
        WHERE id = story_id AND (
            NOT is_private OR 
            creator_id = auth.uid() OR
            EXISTS (
                SELECT 1 FROM story_contributions 
                WHERE story_id = stories.id AND contributor_id = auth.uid()
            )
        )
    )
);

-- User achievement policies - gamification system
CREATE POLICY "Users can view their own achievements" ON user_achievements 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can award achievements" ON user_achievements 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their achievement display settings" ON user_achievements 
FOR UPDATE USING (user_id = auth.uid());

-- Notification policies - user notification system
CREATE POLICY "Users can view their own notifications" ON notifications 
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON notifications 
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own notifications" ON notifications 
FOR DELETE USING (user_id = auth.uid());

-- Content flag policies - content moderation system
CREATE POLICY "Users can view their own content flags" ON content_flags 
FOR SELECT USING (flagger_id = auth.uid());

CREATE POLICY "Users can create content flags" ON content_flags 
FOR INSERT WITH CHECK (flagger_id = auth.uid());

CREATE POLICY "Moderators can view all flags" ON content_flags 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND is_premium = true -- Or create moderator role
    )
);

-- Reading session policies - analytics and progress tracking
CREATE POLICY "Users can view their own reading sessions" ON reading_sessions 
FOR ALL USING (user_id = auth.uid());

-- User genre preference policies - personalization
CREATE POLICY "Users can view their own genre preferences" ON user_genre_preferences 
FOR ALL USING (user_id = auth.uid());

-- User subscription policies - premium features
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions 
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "System can manage subscriptions" ON user_subscriptions 
FOR INSERT WITH CHECK (true);

-- =============================================================================
-- RPC FUNCTIONS FOR CLIENT-SIDE PROFILE MANAGEMENT
-- =============================================================================

-- Simple RPC function to get or create current user profile
CREATE OR REPLACE FUNCTION public.get_current_user_profile()
RETURNS jsonb AS $$
DECLARE
  current_user_id uuid;
  user_profile RECORD;
  auth_user RECORD;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Try to get existing profile
  SELECT * INTO user_profile FROM public.users WHERE id = current_user_id;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'profile', row_to_json(user_profile)
    );
  ELSE
    -- Profile doesn't exist, try to create it
    SELECT id, email, raw_user_meta_data INTO auth_user 
    FROM auth.users WHERE id = current_user_id;
    
    IF FOUND THEN
      -- Create profile
      IF public.create_user_profile_simple(
        auth_user.id,
        auth_user.email,
        COALESCE(auth_user.raw_user_meta_data, '{}'::jsonb)
      ) THEN
        -- Return newly created profile
        SELECT * INTO user_profile FROM public.users WHERE id = current_user_id;
        RETURN jsonb_build_object(
          'success', true,
          'profile', row_to_json(user_profile)
        );
      ELSE
        RETURN jsonb_build_object('success', false, 'error', 'Failed to create profile');
      END IF;
    ELSE
      RETURN jsonb_build_object('success', false, 'error', 'Auth user not found');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Simple RPC function to get user by username
CREATE OR REPLACE FUNCTION public.get_user_by_username(username_param text)
RETURNS jsonb AS $$
DECLARE
  user_profile RECORD;
BEGIN
  SELECT id, username, display_name, avatar_url, total_xp, current_level,
         reading_streak, voting_streak, writing_streak, created_at
  INTO user_profile
  FROM public.users 
  WHERE username = username_param;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'profile', row_to_json(user_profile)
    );
  ELSE
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;