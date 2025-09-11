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

-- Drop existing policies if they exist (for re-running script)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Genres are viewable by all authenticated users" ON genres;
DROP POLICY IF EXISTS "Story genres are viewable by all" ON story_genres;
DROP POLICY IF EXISTS "Public stories are viewable by all" ON stories;
DROP POLICY IF EXISTS "Private stories viewable by participants" ON stories;
DROP POLICY IF EXISTS "Contributions viewable for story participants" ON story_contributions;
DROP POLICY IF EXISTS "Users can vote on public stories" ON votes;
DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own content flags" ON content_flags;
DROP POLICY IF EXISTS "Users can view their own reading sessions" ON reading_sessions;
DROP POLICY IF EXISTS "Users can view their own genre preferences" ON user_genre_preferences;
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON user_subscriptions;

-- User policies - users can only access their own data
CREATE POLICY "Users can view their own data" ON users 
FOR ALL USING (auth.uid() = id);

-- Genre policies - genres are public for authenticated users
CREATE POLICY "Genres are viewable by all authenticated users" ON genres 
FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);

-- Story genre junction table - viewable by all authenticated users
CREATE POLICY "Story genres are viewable by authenticated users" ON story_genres 
FOR SELECT USING (auth.role() = 'authenticated');

-- Story policies - public stories viewable by all, private by participants only
CREATE POLICY "Public stories are viewable by all" ON stories 
FOR SELECT USING (NOT is_private AND auth.role() = 'authenticated');

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

-- Story contribution policies
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
FOR INSERT WITH CHECK (contributor_id = auth.uid());

CREATE POLICY "Users can update their own contributions" ON story_contributions 
FOR UPDATE USING (contributor_id = auth.uid());

-- Vote policies - users can vote on public stories
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

-- User achievement policies - users can only see their own achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements 
FOR ALL USING (user_id = auth.uid());

-- Notification policies - users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications 
FOR ALL USING (user_id = auth.uid());

-- Content flag policies - users can flag content and see their own flags
CREATE POLICY "Users can view their own content flags" ON content_flags 
FOR SELECT USING (flagger_id = auth.uid());

CREATE POLICY "Users can create content flags" ON content_flags 
FOR INSERT WITH CHECK (flagger_id = auth.uid());

-- Reading session policies - users can only see their own reading data
CREATE POLICY "Users can view their own reading sessions" ON reading_sessions 
FOR ALL USING (user_id = auth.uid());

-- User genre preference policies - users can manage their own preferences
CREATE POLICY "Users can view their own genre preferences" ON user_genre_preferences 
FOR ALL USING (user_id = auth.uid());

-- User subscription policies - users can only see their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions 
FOR ALL USING (user_id = auth.uid());