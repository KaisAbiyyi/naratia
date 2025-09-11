# Technical Architecture Document (TAD) - Naratia MVP

## Architecture Overview
Naratia follows a modern web application architecture with real-time capabilities, designed for scalability and user engagement through gamified collaborative storytelling.

### High-Level Architecture
```
Frontend (Web App) ←→ Backend API ←→ Database
     ↓                    ↓            ↓
Mobile PWA         Authentication   PostgreSQL
                   Real-time Sync    + Views
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety and developer experience
- **Styling**: TailwindCSS + shadcn/ui component library
- **State Management**: React hooks + Zustand for global state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Real-time**: Supabase real-time subscriptions
- **Form Handling**: React Hook Form with Zod validation
- **Animation**: Framer Motion for smooth transitions

### Backend & Infrastructure
- **Backend-as-a-Service**: Supabase
  - Authentication & user management
  - PostgreSQL database with Row Level Security
  - Real-time subscriptions
  - Edge functions for complex business logic
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Hosting**: Vercel for frontend deployment
- **CDN**: Vercel Edge Network for global performance

### Database
- **Primary**: PostgreSQL via Supabase
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Query Optimization**: TanStack Query for client-side caching and synchronization
- **Real-time**: Supabase subscriptions with TanStack Query integration
- **Migrations**: Drizzle migrations with Supabase deployment

### Mobile Strategy
- **Approach**: Progressive Web App (PWA) with Next.js 15 optimizations
- **Benefits**: Single codebase, app-like experience, offline capabilities
- **Performance**: TanStack Query caching for smooth mobile experience
- **UI**: shadcn/ui components optimized for touch interfaces
- **Future**: React Native conversion path with shared business logic

---

## API Architecture

### Data Fetching Strategy (TanStack Query)
```typescript
// Optimistic updates for real-time feel
const useVoteContribution = () => {
  return useMutation({
    mutationFn: voteOnContribution,
    onMutate: async (newVote) => {
      await queryClient.cancelQueries(['contributions', storyId])
      const previousData = queryClient.getQueryData(['contributions', storyId])
      
      // Optimistically update
      queryClient.setQueryData(['contributions', storyId], old => 
        updateVoteCount(old, newVote)
      )
      
      return { previousData }
    },
    onError: (err, newVote, context) => {
      queryClient.setQueryData(['contributions', storyId], context.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['contributions', storyId])
    }
  })
}

// Infinite query for story timeline
const useStoryTimeline = (storyId) => {
  return useInfiniteQuery({
    queryKey: ['story', storyId, 'timeline'],
    queryFn: ({ pageParam = 0 }) => fetchStoryParagraphs(storyId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 30 * 1000, // 30 seconds for active stories
  })
}
```

### Authentication Flow
```
User Registration/Login → Supabase Auth → JWT Token → RLS Policies
```

### Core API Endpoints

#### Authentication
- `POST /auth/signup` - User registration with email verification
- `POST /auth/signin` - User login with email/password or OAuth
- `POST /auth/signout` - User logout and token invalidation
- `GET /auth/user` - Current user profile and preferences

#### Stories Management
- `GET /api/stories` - List stories with filtering (genre, status, popularity)
- `POST /api/stories` - Create new story (title + opening paragraph)
- `GET /api/stories/{id}` - Get story details with full timeline
- `PUT /api/stories/{id}` - Update story metadata (creator only)

#### Contributions & Voting
- `POST /api/stories/{id}/contributions` - Submit paragraph contribution
- `GET /api/stories/{id}/contributions` - Get pending contributions for voting
- `POST /api/contributions/{id}/vote` - Cast vote on contribution
- `GET /api/contributions/{id}/branches` - Get branch options (premium)

#### User Management
- `GET /api/users/profile` - User profile with achievements and stats
- `PUT /api/users/profile` - Update user preferences and settings
- `GET /api/users/achievements` - User achievement progress
- `POST /api/users/notifications/read` - Mark notifications as read

#### Analytics (Internal)
- `POST /api/analytics/reading-session` - Track reading behavior
- `POST /api/analytics/engagement` - Track user interactions

### Real-time Events
```typescript
// Story updates
'story:contribution:new' - New contribution submitted
'story:voting:started' - Voting round started
'story:voting:ended' - Voting completed, winner selected
'story:completed' - Story reached ending

// User events
'user:achievement:unlocked' - Achievement progression
'user:notification:new' - New notification received
'user:streak:updated' - Streak milestone reached
```

---

## Database Architecture

### Key Design Principles
- **Normalized Structure**: No redundant data, derived metrics via views
- **Self-Referencing**: story_contributions table handles branching
- **Row Level Security**: Supabase RLS for data access control
- **Performance**: Strategic indexing for complex queries

### Core Tables
- `users` - User accounts and gamification state
- `genres` - Master genre data
- `stories` - Story metadata only
- `story_genres` - Many-to-many story-genre relationships
- `story_contributions` - All story content including opening paragraphs
- `votes` - Voting records with fraud prevention
- `user_achievements` - Achievement progress tracking
- `reading_sessions` - Analytics for engagement metrics

### Derived Data Strategy
- `story_metrics` view - Real-time story statistics
- `user_metrics` view - User analytics and progress
- `contribution_metrics` view - Voting and engagement data

---

## Security Architecture

### Authentication & Authorization
- **Supabase Auth**: JWT-based authentication with refresh tokens
- **Row Level Security**: PostgreSQL RLS policies for data isolation
- **API Security**: Rate limiting and request validation
- **Content Moderation**: Automated flagging + community reporting

### Data Protection
- **Encryption**: TLS 1.3 for data in transit
- **Database**: Encrypted at rest via Supabase
- **Privacy**: GDPR-compliant data handling
- **Audit**: Comprehensive logging for security events

### Anti-Abuse Measures
- **Multi-account Detection**: IP tracking and behavioral analysis
- **Vote Manipulation**: Rate limiting and duplicate vote prevention
- **Content Spam**: Character limits, cooldowns, quality scoring
- **User Suspension**: Automated flagging with manual review

---

## Performance Architecture

### Frontend Optimization
- **Next.js 15 Features**: Enhanced App Router with improved streaming and caching
- **UI Components**: shadcn/ui for consistent, performant component library
- **Data Loading**: TanStack Query with background refetching and optimistic updates
- **Code Splitting**: Automatic route-based splitting + manual component lazy loading
- **Image Optimization**: Next.js Image component with automatic WebP/AVIF conversion
- **Caching Strategy**: 
  - Static generation for public story listings
  - ISR (Incremental Static Regeneration) for story content
  - TanStack Query client-side caching with smart invalidation

### Backend Performance
- **Database ORM**: Drizzle for optimized SQL generation and type safety
- **Connection Pooling**: Supabase connection management with Drizzle integration
- **Query Optimization**: 
  - Strategic database indexes for story and contribution queries
  - Materialized views for complex aggregations
  - Query batching with TanStack Query
- **Edge Functions**: Serverless functions for business logic with global distribution

### Real-time Optimization
- **Selective Subscriptions**: Subscribe only to active story updates with TanStack Query integration
- **Event Batching**: Group related real-time events to reduce re-renders
- **Optimistic Updates**: Immediate UI feedback with automatic rollback on errors
- **Background Sync**: TanStack Query background refetching for stale data

---

## Deployment Architecture

### Environment Strategy
```
Development → Staging → Production
     ↓           ↓         ↓
  Local DB   → Test DB → Prod DB
  (Supabase)   (Branch)  (Main)
```

### CI/CD Pipeline
1. **Code Push** → GitHub repository
2. **Automated Testing** → Unit tests, integration tests
3. **Build Process** → Next.js build with type checking
4. **Deployment** → Vercel automatic deployment
5. **Database Migration** → Drizzle migration runner
6. **Monitoring** → Error tracking and performance metrics

### Infrastructure
- **Frontend**: Vercel serverless deployment
- **Database**: Supabase managed PostgreSQL
- **Monitoring**: Vercel Analytics + Supabase logs
- **Error Tracking**: Built-in Next.js error boundaries

---

## Scalability Considerations

### Database Scaling
- **Read Replicas**: Supabase automatic read scaling
- **Connection Pooling**: Drizzle with Supabase connection management
- **Query Optimization**: Views and indexes for complex queries
- **Horizontal Scaling**: Microservice extraction path available

### Application Scaling
- **Serverless Architecture**: Auto-scaling Vercel functions
- **Static Generation**: Cached content for popular stories
- **CDN Distribution**: Global edge network
- **Progressive Enhancement**: Core functionality works without JS

### Future Migration Paths
- **Database**: PostgreSQL compatibility enables migration flexibility
- **Backend**: Modular design supports microservice extraction
- **Frontend**: React foundation supports multiple deployment targets
- **Mobile**: PWA to React Native conversion pathway

---

## Development Workflow

### Project Structure (SOLID Principles)
```
my-nextjs-app/
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── .env.local
├── .gitignore
│
├── public/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── src/
│   ├── app/                          # App Router (Next.js 13+)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── (auth)/                   # Route Groups
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── users/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   │
│   │   └── api/                      # API Routes
│   │       ├── auth/
│   │       │   └── route.ts
│   │       └── users/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   │
│   ├── components/                   # UI Components (Interface Segregation)
│   │   ├── ui/                       # Base UI Components
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── button.types.ts
│   │   │   │   └── button.test.tsx
│   │   │   ├── input/
│   │   │   ├── modal/
│   │   │   └── index.ts              # Barrel exports
│   │   │
│   │   ├── forms/                    # Form Components
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── register-form.tsx
│   │   │   └── user/
│   │   │       ├── user-form.tsx
│   │   │       └── user-profile-form.tsx
│   │   │
│   │   ├── layout/                   # Layout Components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── navigation.tsx
│   │   │
│   │   └── features/                 # Feature-specific Components
│   │       ├── auth/
│   │       ├── dashboard/
│   │       └── users/
│   │
│   ├── lib/                          # Core Libraries & Utilities
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── env.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── utils/                    # Pure Utility Functions
│   │   │   ├── format.ts
│   │   │   ├── validation.ts
│   │   │   ├── date.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── validations/              # Schema Validations
│   │   │   ├── auth.schema.ts
│   │   │   ├── user.schema.ts
│   │   │   └── index.ts
│   │   │
│   │   └── providers/                # Context Providers
│   │       ├── auth-provider.tsx
│   │       ├── theme-provider.tsx
│   │       └── query-provider.tsx
│   │
│   ├── hooks/                        # Custom React Hooks (Single Responsibility)
│   │   ├── auth/
│   │   │   ├── use-auth.ts
│   │   │   └── use-login.ts
│   │   ├── api/
│   │   │   ├── use-users.ts
│   │   │   └── use-user.ts
│   │   └── ui/
│   │       ├── use-modal.ts
│   │       └── use-toast.ts
│   │
│   ├── services/                     # External Service Integrations (Dependency Inversion)
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   ├── migrations/
│   │   │   └── seeds/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.service.ts
│   │   │   └── password.service.ts
│   │   │
│   │   └── external/
│   │       ├── email.service.ts
│   │       ├── storage.service.ts
│   │       └── analytics.service.ts
│   │
│   ├── stores/                       # State Management (Single Responsibility)
│   │   ├── auth.store.ts
│   │   ├── user.store.ts
│   │   ├── ui.store.ts
│   │   └── index.ts
│   │
│   ├── types/                        # TypeScript Type Definitions
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   ├── database.types.ts
│   │   └── index.ts
│   │
│   ├── constants/                    # Application Constants
│   │   ├── routes.ts
│   │   ├── api-endpoints.ts
│   │   ├── messages.ts
│   │   └── index.ts
│   │
│   └── middleware.ts                 # Next.js Middleware
│
├── tests/                            # Test Files
│   ├── __mocks__/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── setup.ts
│
├── docs/                             # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
└── scripts/                          # Build & Deployment Scripts
    ├── build.sh
    ├── deploy.sh
    └── db-migrate.sh
```

### Code Standards
- **TypeScript**: Strict mode with comprehensive typing via Drizzle
- **UI Components**: shadcn/ui for consistent design system
- **Form Validation**: Zod schemas with React Hook Form integration
- **Data Fetching**: TanStack Query patterns with error boundaries
- **Database**: Drizzle migrations with type-safe queries
- **Linting**: ESLint + Prettier with Next.js 15 optimized rules

### Migration Strategy
- **Database**: Drizzle migration files with rollback support
- **Schema Changes**: Additive changes only in production
- **Feature Flags**: Environment-based feature toggles
- **Zero Downtime**: Blue-green deployment capability

---

## Monitoring & Analytics

### Application Monitoring
- **Performance**: Vercel Web Vitals tracking
- **Errors**: Automatic error reporting and alerting
- **Uptime**: Health checks and availability monitoring
- **Database**: Query performance and connection metrics

### Business Analytics
- **User Engagement**: Reading sessions and interaction tracking
- **Story Performance**: Completion rates and voting patterns
- **Feature Usage**: Achievement unlocks and streak maintenance
- **Growth Metrics**: User acquisition and retention analysis

### Privacy-Compliant Analytics
- **Anonymization**: No PII in analytics pipelines
- **Consent Management**: GDPR-compliant data collection
- **Data Retention**: Automatic cleanup of old analytics data
- **User Control**: Opt-out mechanisms for tracking