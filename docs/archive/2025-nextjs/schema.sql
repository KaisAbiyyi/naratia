-- Naratia Database Schema - Ultra-Clean Design
-- PostgreSQL (Supabase)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom types for better data integrity
CREATE TYPE content_tier AS ENUM ('all_ages', 'mature', 'explicit');
CREATE TYPE story_status AS ENUM ('active', 'completed', 'length_limited', 'abandoned');
CREATE TYPE contribution_status AS ENUM ('pending', 'selected', 'rejected', 'flagged');
CREATE TYPE vote_type AS ENUM ('paragraph', 'ending', 'flag');
CREATE TYPE achievement_type AS ENUM ('reading', 'voting', 'writing', 'completion', 'streak', 'special');
CREATE TYPE notification_type AS ENUM ('vote_needed', 'story_update', 'streak_warning', 'achievement', 'system');

-- Users table (Clean - only essential data)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
    last_login TIMESTAMP WITH TIME ZONE,
    ip_address INET, -- For multi-account detection
    
    -- Constraints
    CONSTRAINT valid_quality_score CHECK (quality_score >= 1.00 AND quality_score <= 10.00),
    CONSTRAINT valid_streaks CHECK (reading_streak >= 0 AND voting_streak >= 0 AND writing_streak >= 0)
);

-- Genres table (Simplified)
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color_hex VARCHAR(7), -- For UI theming
    icon_name VARCHAR(50), -- Icon identifier for UI
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Content tier restrictions
    min_content_tier content_tier DEFAULT 'all_ages',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stories table (Pure metadata only)
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT, -- Future feature
    
    -- Creator info
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status and content tier
    status story_status DEFAULT 'active',
    content_tier content_tier DEFAULT 'all_ages',
    
    -- Voting configuration (business rules)
    voting_duration_hours INTEGER DEFAULT 48,
    min_votes_required INTEGER DEFAULT 5,
    max_pending_contributions INTEGER DEFAULT 5,
    
    -- Future features
    is_private BOOLEAN DEFAULT FALSE, -- Premium feature
    access_code VARCHAR(50), -- For private stories
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    
    -- Monetization (Future)
    is_premium BOOLEAN DEFAULT FALSE,
    price_tokens INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_voting_config CHECK (voting_duration_hours > 0 AND min_votes_required > 0)
);

-- Story genres (Many-to-many relationship)
CREATE TABLE story_genres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    
    -- For ordering genres (primary genre first)
    display_order INTEGER DEFAULT 1,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate genre assignments
    UNIQUE(story_id, genre_id)
);

-- Story contributions (paragraphs) - Clean version
CREATE TABLE story_contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    contributor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_contribution_id UUID REFERENCES story_contributions(id), -- Self-reference for branching
    
    -- Content (core data only)
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    is_ending BOOLEAN DEFAULT FALSE,
    is_opening BOOLEAN DEFAULT FALSE, -- Flag for opening paragraph
    
    -- Status and selection
    status contribution_status DEFAULT 'pending',
    is_selected BOOLEAN DEFAULT FALSE,
    
    -- Ordering system (with fallback for tie-breaking)
    selected_at TIMESTAMP WITH TIME ZONE,
    sequence_number SERIAL, -- Auto-incrementing backup for ordering
    
    -- Branching metadata
    branch_name VARCHAR(100), -- "Left Path", "Right Path", etc.
    branch_description TEXT,
    branch_depth INTEGER DEFAULT 0, -- Depth from main story line
    
    -- Quality metrics (AI-generated, not derived)
    reading_time_estimate INTEGER, -- Estimated seconds to read
    complexity_score DECIMAL(3,2), -- Future AI analysis
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_word_count CHECK (word_count > 0),
    CONSTRAINT valid_content_length CHECK (char_length(content) >= 50 AND char_length(content) <= 2000),
    -- Opening paragraph constraints
    CONSTRAINT opening_no_parent CHECK (NOT (is_opening = TRUE AND parent_contribution_id IS NOT NULL)),
    CONSTRAINT opening_auto_selected CHECK (NOT (is_opening = TRUE AND is_selected = FALSE)),
    CONSTRAINT valid_branch_depth CHECK (branch_depth >= 0 AND branch_depth <= 10)
);

-- Votes table (Pure voting data)
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    voter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES story_contributions(id) ON DELETE CASCADE,
    
    -- Vote details
    vote_type vote_type NOT NULL DEFAULT 'paragraph',
    is_ending_vote BOOLEAN DEFAULT FALSE, -- Voting to end story
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET, -- For fraud detection
    
    -- Prevent duplicate votes
    UNIQUE(story_id, voter_id, contribution_id, vote_type)
);

-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Achievement details
    achievement_key VARCHAR(100) NOT NULL, -- e.g., 'page_turner', 'master_storyteller'
    achievement_type achievement_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Progress tracking
    current_progress INTEGER DEFAULT 0,
    required_progress INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    
    -- Rewards
    xp_reward INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Prevent duplicate achievements
    UNIQUE(user_id, achievement_key)
);

-- Content flags/reports (Pure flagging data)
CREATE TABLE content_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flagger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES story_contributions(id) ON DELETE CASCADE,
    
    -- Flag details
    reason VARCHAR(100) NOT NULL, -- 'spam', 'inappropriate', 'off_topic', etc.
    description TEXT,
    
    -- Status
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id),
    resolution_note TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Prevent duplicate flags
    UNIQUE(flagger_id, story_id, contribution_id)
);

-- User reading sessions (Pure analytics data)
CREATE TABLE reading_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES story_contributions(id) ON DELETE CASCADE, -- Track per paragraph
    
    -- Session details
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Reading engagement metrics
    scroll_percentage INTEGER DEFAULT 0, -- How much of content was scrolled
    focus_time_seconds INTEGER DEFAULT 0, -- Time with tab active
    return_visits INTEGER DEFAULT 1, -- How many times returned to read this
    
    -- Device info
    device_type VARCHAR(50), -- 'mobile', 'desktop', 'tablet'
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_scroll CHECK (scroll_percentage >= 0 AND scroll_percentage <= 100)
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type notification_type NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    contribution_id UUID REFERENCES story_contributions(id) ON DELETE CASCADE,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- User genre preferences (Future feature for recommendations)
CREATE TABLE user_genre_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    
    -- Preference scoring
    interest_level INTEGER DEFAULT 5, -- 1-10 scale
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicates
    UNIQUE(user_id, genre_id),
    
    -- Constraints
    CONSTRAINT valid_interest_level CHECK (interest_level >= 1 AND interest_level <= 10)
);

-- Future features tables

-- User subscriptions (Future monetization)
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Subscription details
    plan_name VARCHAR(50) NOT NULL,
    price_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Timeline
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Payment tracking
    stripe_subscription_id VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Views for derived metrics (replaces all removed redundant fields)

-- User metrics view
CREATE VIEW user_metrics AS
SELECT 
    u.id,
    u.username,
    u.display_name,
    -- Derived analytics from other tables
    COALESCE(SUM(rs.duration_seconds) / 60, 0) as total_reading_time_minutes,
    COUNT(DISTINCT rs.story_id) as total_stories_read,
    COUNT(DISTINCT sc.id) as total_contributions,
    COUNT(DISTINCT v.id) as total_votes_cast,
    COUNT(sc.id) FILTER (WHERE sc.is_selected = TRUE) as contribution_wins,
    -- Current streaks and XP from users table (maintained)
    u.reading_streak,
    u.voting_streak, 
    u.writing_streak,
    u.total_xp,
    u.current_level
FROM users u
LEFT JOIN reading_sessions rs ON rs.user_id = u.id
LEFT JOIN story_contributions sc ON sc.contributor_id = u.id
LEFT JOIN votes v ON v.voter_id = u.id
GROUP BY u.id, u.username, u.display_name, u.reading_streak, u.voting_streak, u.writing_streak, u.total_xp, u.current_level;

-- Story metrics view
CREATE VIEW story_metrics AS
SELECT 
    s.id,
    s.title,
    s.status,
    s.creator_id,
    -- Derived metrics from story_contributions
    COUNT(sc.id) FILTER (WHERE sc.is_selected = TRUE) as paragraph_count,
    COUNT(DISTINCT sc.contributor_id) as total_contributors,
    MAX(sc.created_at) as last_contribution_at,
    MIN(sc.selected_at) FILTER (WHERE sc.is_ending = TRUE AND sc.is_selected = TRUE) as completed_at,
    COUNT(sc.id) FILTER (WHERE sc.status = 'pending') as pending_contributions,
    -- Engagement metrics from other tables
    COUNT(DISTINCT rs.user_id) as total_readers,
    COUNT(DISTINCT v.voter_id) as total_voters,
    COALESCE(SUM(rs.duration_seconds), 0) as total_reading_time,
    -- Branch analysis
    COUNT(sc.id) FILTER (WHERE EXISTS (
        SELECT 1 FROM story_contributions child 
        WHERE child.parent_contribution_id = sc.id
    )) as branch_points
FROM stories s
LEFT JOIN story_contributions sc ON sc.story_id = s.id
LEFT JOIN reading_sessions rs ON rs.story_id = s.id  
LEFT JOIN votes v ON v.story_id = s.id
GROUP BY s.id, s.title, s.status, s.creator_id;

-- Contribution metrics view
CREATE VIEW contribution_metrics AS
SELECT
    sc.id,
    sc.story_id,
    sc.contributor_id,
    sc.content,
    sc.status,
    sc.is_selected,
    -- Derived metrics
    COUNT(v.id) as vote_count,
    COUNT(cf.id) as flag_count,
    COALESCE(SUM(rs.duration_seconds), 0) as total_reading_time,
    COUNT(DISTINCT rs.user_id) as unique_readers,
    -- Original fields
    sc.word_count,
    sc.is_ending,
    sc.is_opening,
    sc.branch_name,
    sc.selected_at,
    sc.created_at
FROM story_contributions sc
LEFT JOIN votes v ON v.contribution_id = sc.id
LEFT JOIN content_flags cf ON cf.contribution_id = sc.id
LEFT JOIN reading_sessions rs ON rs.contribution_id = sc.id
GROUP BY sc.id, sc.story_id, sc.contributor_id, sc.content, sc.status, sc.is_selected, 
         sc.word_count, sc.is_ending, sc.is_opening, sc.branch_name, sc.selected_at, sc.created_at;

-- Utility functions

-- Function to get story timeline (selected contributions in order)
CREATE OR REPLACE FUNCTION get_story_timeline(target_story_id UUID)
RETURNS TABLE (
    contribution_id UUID,
    content TEXT,
    contributor_name VARCHAR,
    selected_at TIMESTAMP WITH TIME ZONE,
    sequence_number INTEGER,
    is_branch_point BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE story_path AS (
        -- Start with opening paragraph
        SELECT 
            sc.id,
            sc.content,
            u.display_name,
            sc.selected_at,
            sc.sequence_number,
            EXISTS(SELECT 1 FROM story_contributions child WHERE child.parent_contribution_id = sc.id AND child.is_selected = TRUE) as has_branches,
            1 as depth,
            ARRAY[sc.sequence_number] as path
        FROM story_contributions sc
        LEFT JOIN users u ON u.id = sc.contributor_id
        WHERE sc.story_id = target_story_id 
        AND sc.is_opening = TRUE
        
        UNION ALL
        
        -- Follow the main selected path (take first branch if multiple)
        SELECT 
            sc.id,
            sc.content,
            u.display_name,
            sc.selected_at,
            sc.sequence_number,
            EXISTS(SELECT 1 FROM story_contributions child WHERE child.parent_contribution_id = sc.id AND child.is_selected = TRUE),
            sp.depth + 1,
            sp.path || sc.sequence_number
        FROM story_contributions sc
        LEFT JOIN users u ON u.id = sc.contributor_id
        JOIN story_path sp ON sc.parent_contribution_id = sp.contribution_id
        WHERE sc.is_selected = TRUE
        AND sc.story_id = target_story_id
        AND sp.depth < 50 -- Prevent infinite recursion
        ORDER BY sc.selected_at LIMIT 1 -- Take first selected branch
    )
    SELECT 
        story_path.contribution_id,
        story_path.content,
        story_path.contributor_name,
        story_path.selected_at,
        story_path.sequence_number,
        story_path.has_branches
    FROM story_path
    ORDER BY array_length(path, 1), path;
END;
$$ LANGUAGE plpgsql;

-- Function for advanced tie-breaking (future implementation)
CREATE OR REPLACE FUNCTION resolve_voting_tie(target_story_id UUID)
RETURNS UUID AS $$
DECLARE
    winner_id UUID;
BEGIN
    -- Advanced tie-breaking logic using engagement metrics from views
    SELECT cm.id INTO winner_id
    FROM contribution_metrics cm
    JOIN users u ON u.id = cm.contributor_id
    WHERE cm.story_id = target_story_id 
    AND cm.status = 'pending'
    AND cm.vote_count = (
        SELECT MAX(vote_count) 
        FROM contribution_metrics 
        WHERE story_id = target_story_id AND status = 'pending'
    )
    ORDER BY 
        -- Weighted scoring system
        (cm.vote_count * 10) + 
        (cm.total_reading_time / 60) + 
        (cm.unique_readers * 2) + 
        u.quality_score DESC,
        cm.created_at ASC,
        cm.id ASC -- Final tie-breaker
    LIMIT 1;
    
    RETURN winner_id;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_story_genres_story ON story_genres(story_id);
CREATE INDEX idx_story_genres_genre ON story_genres(genre_id);
CREATE INDEX idx_story_genres_display_order ON story_genres(story_id, display_order);
CREATE INDEX idx_genres_active ON genres(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_user_genre_preferences_user ON user_genre_preferences(user_id);
CREATE INDEX idx_stories_active ON stories(status, created_at) WHERE status = 'active';

-- Story contributions indexes (Critical for performance)
CREATE INDEX idx_contributions_story_status ON story_contributions(story_id, status);
CREATE INDEX idx_contributions_pending ON story_contributions(story_id, created_at) WHERE status = 'pending';
CREATE INDEX idx_contributions_selected ON story_contributions(story_id, selected_at) WHERE is_selected = TRUE;
CREATE INDEX idx_contributions_parent ON story_contributions(parent_contribution_id);
CREATE INDEX idx_contributions_opening ON story_contributions(story_id) WHERE is_opening = TRUE;
CREATE INDEX idx_contributions_sequence ON story_contributions(story_id, sequence_number);
CREATE INDEX idx_contributions_branch_depth ON story_contributions(story_id, branch_depth);

-- Performance indexes for complex queries
CREATE INDEX idx_votes_story_user ON votes(story_id, voter_id);
CREATE INDEX idx_votes_contribution ON votes(contribution_id);
CREATE INDEX idx_users_last_activity ON users(last_activity_date);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_reading_sessions_contribution ON reading_sessions(contribution_id, user_id);
CREATE INDEX idx_reading_sessions_story_user ON reading_sessions(story_id, user_id);
CREATE INDEX idx_content_flags_contribution ON content_flags(contribution_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_genres_updated_at BEFORE UPDATE ON genres FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_genre_preferences_updated_at BEFORE UPDATE ON user_genre_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_genres ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be expanded based on requirements)
CREATE POLICY "Users can view their own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Genres are viewable by all authenticated users" ON genres FOR SELECT USING (auth.role() = 'authenticated' AND is_active = TRUE);
CREATE POLICY "Story genres are viewable by all" ON story_genres FOR SELECT USING (TRUE);
CREATE POLICY "Public stories are viewable by all" ON stories FOR SELECT USING (NOT is_private);
CREATE POLICY "Private stories viewable by participants" ON stories FOR SELECT USING (is_private AND (creator_id = auth.uid() OR EXISTS (SELECT 1 FROM story_contributions WHERE story_id = stories.id AND contributor_id = auth.uid())));
CREATE POLICY "Contributions viewable for story participants" ON story_contributions FOR SELECT USING (EXISTS (SELECT 1 FROM stories WHERE id = story_id AND (NOT is_private OR creator_id = auth.uid())));
CREATE POLICY "Users can vote on public stories" ON votes FOR ALL USING (EXISTS (SELECT 1 FROM stories WHERE id = story_id AND NOT is_private));
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users can view their own notifications" ON notifications FOR ALL USING (user_id = auth.uid());