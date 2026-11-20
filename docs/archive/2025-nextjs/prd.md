# Naratia MVP - Product Requirements Document

## Overview
Naratia is a collaborative storytelling platform where users build narratives together, paragraph by paragraph. The community votes on the best continuation, creating dynamic stories through collective decision-making.

**Hidden Goal**: Stealth education platform that improves reading comprehension through gamified storytelling without users realizing they're learning.

## Target Users
- Amateur writers seeking practice
- Active readers who want to influence story direction  
- Creative communities interested in collaboration
- Global audience (US, Finland, Japan, Indonesia focus)

## Core MVP Features

### 1. User Authentication
- Email/password registration via Supabase Auth
- Google OAuth integration
- Age verification for content filtering

### 2. Story Creation
- Simple form: title, genre, opening paragraph
- Character limit per paragraph
- All stories are public and community-owned
- Users can create maximum 2 active stories (free tier)

### 3. Story Reading & Discovery
- Display complete story with all selected paragraphs
- Simple genre filtering and search
- Homepage algorithm prioritizes active stories
- Mobile-optimized responsive design

### 4. Paragraph Contribution
- Maximum 5 pending drafts per story
- Character limit validation
- Must connect logically to previous paragraph

### 5. Voting System
- One vote per user per story round
- Cannot vote on own contributions
- Vote counts hidden during voting period
- Automatic closure when time limit reached OR minimum votes achieved
- Winner selection: highest votes (tie-breaker: earliest submission)
- Winning paragraph automatically added to main story

### 6. Gamification (Stealth Learning)
- **Reading Streak**: Daily story reading habit
- **Voting Streak**: Daily voting participation  
- **Writing Streak**: Weekly contribution submissions
- **Perfect Day Combo**: All three activities in one day
- XP system with achievement badges
- Progress tracking without obvious "educational" labeling

### 7. User Profile
- Display contributed stories and win/loss status
- Reading time analytics and voting patterns
- Achievement showcase
- Join date and basic stats

### 8. Content Moderation
- Three-tier system: All Ages / Mature (13+) / Explicit (18+)
- Auto-detection keywords + community reporting
- User preference settings for content filtering

## Story Archive System
#### Categories:
- **Completed**: Ended by community/natural conclusion
- **Length-Limited**: Hit 50 paragraph maximum
- **Abandoned**: Inactive but preserved (like GitHub repos)

#### Features:
- Searchable library of all stories
- Contributor portfolios showcase completed stories
- "Classic" badges for popular archived stories
- Reading bookmarks and favorites

### 11. Re-engagement & Notifications
- "Story you contributed to needs votes!"
- "Story you're following is almost complete!"  
- "Your writing streak is about to break!"
- Featured dormant stories on homepage rotation
- "Adopt a story" revival challenges

## Technical Requirements
- **Frontend**: Modern web framework with server-side rendering capabilities
- **Backend**: Authentication service, real-time database, and API infrastructure
- **Database**: PostgreSQL-compatible with real-time subscriptions support
- **Hosting**: Platform supporting serverless deployment and edge functions
- **Mobile**: Progressive Web App (PWA) architecture for cross-platform compatibility

## Success Metrics
- Complete user loop: register → read → contribute → vote → continue
- 70% of registered users perform at least one vote
- 50+ completed stories through all ending mechanisms
- Daily active user retention >40%
- Average reading time >5 minutes per session

## MVP Constraints
- **No monetization features** (completely free until 1000+ users)
- No social features (following, comments, direct messaging)
- No private stories or branching
- No content export or advanced analytics
- No AI assistance or story recommendations
- No voting power differences or premium advantages

## Future Features (Post-MVP)
### Phase 2 (After 1000+ Users):
- Story branching system (token-based)
- Private collaborative stories
- Advanced analytics dashboard
- Token-based monetization system

### Phase 3 (Long-term):
- Story marketplace with revenue sharing
- Mobile native app
- Multi-language support expansion
- Creator reward programs

## Content Guidelines
- **Community ownership**: Stories become community property after publication
- **No individual copyright** claims on public collaborative stories
- **Democratic voting**: All votes equal weight, no pay-to-win mechanics
- **Quality over quantity**: Encourage thoughtful contributions
- **Inclusive community**: Respect for all contributors regardless of skill level

## Development Timeline
- **Week 1-2**: Authentication, basic story CRUD, anti-spam measures
- **Week 3-4**: Contribution system, triple voting mechanism, ending system
- **Week 5-6**: Gamification, achievements, streak system, tutorial flow
- **Week 7-8**: Content moderation, user profiles, archive system
- **Week 9**: UI polish, mobile optimization, testing, deployment

## Risk Mitigation
- **Multi-account abuse**: IP tracking, rate limiting, account age requirements
- **Content spam**: Character minimums, cooldowns, community flagging
- **Story stagnation**: Multiple ending mechanisms, fallback voting
- **Voting manipulation**: Equal vote weights, detection algorithms
- **Community toxicity**: Content filtering, reporting system, moderation tools

## Monetization Strategy (Future)
- **Launch strategy**: Completely free to build user base and validate concept
- **Trigger point**: Introduce monetization after 1000+ active users OR 6 months
- **Model**: Token-based system for premium features (branching, private stories)
- **Pricing**: Conservative approach with A/B testing
- **Revenue streams**: Premium features, story marketplace, advanced analytics