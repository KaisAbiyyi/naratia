-- =============================================================================
-- FIX PUBLIC PROFILE ACCESS - RLS POLICY UPDATE
-- =============================================================================
-- This script fixes the issue where profile pages return 404 when accessed 
-- without authentication by updating RLS policies to allow public read access
-- to safe user profile fields.

-- Drop the existing restrictive policy that requires authentication
DROP POLICY IF EXISTS "Public user profiles viewable by all" ON users;

-- Create new policy for public access to basic profile information
-- This allows anonymous users to view public profile data (username, display_name, etc.)
-- while keeping sensitive fields protected through application-level filtering
CREATE POLICY "Public profile data viewable by anonymous users" ON users 
FOR SELECT USING (true);

-- Note: The server-side getUserProfile function will need to be updated to:
-- 1. Use service role client for public data access, OR
-- 2. Handle both authenticated and anonymous requests appropriately
-- 
-- Sensitive fields (email, birth_date) should be filtered out at the application 
-- level when serving to anonymous users, while authenticated users get full access.

-- The existing "Users can view their own data" policy remains for authenticated 
-- users to access their own private data through different endpoints.