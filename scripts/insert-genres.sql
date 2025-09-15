-- Insert sample genres data
INSERT INTO genres (name, description, color_hex, icon_name, min_content_tier, is_active) VALUES
('Fantasy', 'Magical worlds, mythical creatures, and supernatural elements', '#8B5CF6', 'wand-magic-sparkles', 'general', true),
('Science Fiction', 'Future technology, space exploration, and scientific concepts', '#3B82F6', 'rocket', 'general', true),
('Mystery', 'Puzzles, detective work, and suspenseful investigation', '#6B7280', 'magnifying-glass', 'general', true),
('Romance', 'Love stories and romantic relationships', '#EC4899', 'heart', 'teen', true),
('Horror', 'Scary, frightening, and supernatural thriller elements', '#DC2626', 'ghost', 'mature', true),
('Adventure', 'Action-packed journeys and exploration', '#F59E0B', 'map', 'general', true),
('Comedy', 'Humorous and light-hearted storytelling', '#10B981', 'laugh', 'general', true),
('Drama', 'Emotional and character-driven narratives', '#6366F1', 'theater-masks', 'teen', true),
('Thriller', 'High stakes, tension, and suspenseful plots', '#EF4444', 'zap', 'teen', true),
('Historical Fiction', 'Stories set in past time periods', '#92400E', 'scroll', 'general', true)
ON CONFLICT (name) DO NOTHING;

-- Set RLS policy for genres table to allow public read access
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read genres
CREATE POLICY "Public genre access" ON genres
    FOR SELECT USING (true);