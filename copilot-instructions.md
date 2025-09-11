# GitHub Copilot Instructions for Naratia Project

## Project Overview
Naratia is a collaborative storytelling platform built with Next.js 15, focusing on gamified community-driven narrative creation. This document provides guidelines for GitHub Copilot to assist with code generation that aligns with our project standards.

## Core Development Rules

### Documentation-First Approach
- **ALWAYS** reference `docs/` directory for project requirements:
  - `docs/prd.md` - Product requirements and features
  - `docs/schema.sql` - Database structure and relationships  
  - `docs/plan.md` - Development tasks and timeline
  - `docs/tech.md` - Technical architecture and project structure

### Task Management
- Cross-reference all generated code against `docs/plan.md` task requirements
- Ensure code completion aligns with specific task objectives
- Follow the branch-based development strategy outlined in the plan

### Package Management
- **EXCLUSIVELY** use `bun` for package operations:
  - Installation: `bun add [package-name]`
  - Dev dependencies: `bun add -d [package-name]`
  - Removal: `bun remove [package-name]`
  - Scripts: `bun run [script-name]`
- **NEVER** suggest `npm` or `yarn` commands

### Technology Stack Compliance
- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS v4
- **UI Components**: shadcn/ui (install via `bunx shadcn@latest add [component]`)
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Database**: Drizzle ORM with Supabase PostgreSQL
- **Authentication**: Supabase Auth with Row Level Security
- **Deployment**: Vercel with edge functions

### Project Structure Adherence
Follow the exact folder structure defined in `docs/tech.md`:

```
src/
├── app/                    # Next.js App Router
├── components/             # UI Components
│   ├── ui/                # shadcn/ui base components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── features/          # Feature-specific components
├── lib/                   # Core libraries & utilities
│   ├── config/            # Configuration
│   ├── utils/             # Pure utility functions
│   ├── validations/       # Schema validations
│   ├── providers/         # Context providers
│   ├── database/          # Drizzle schema & connection
│   └── supabase/          # Supabase client & server
├── hooks/                 # Custom React hooks
│   ├── auth/              # Authentication hooks
│   ├── api/               # API hooks
│   └── ui/                # UI-related hooks
├── services/              # External service integrations
│   ├── api/               # API client
│   ├── auth/              # Auth services
│   └── [feature]/         # Feature-specific services
├── stores/                # Zustand stores
├── types/                 # TypeScript definitions
└── constants/             # Application constants
```

## Code Generation Guidelines

### SOLID Principles
Generate code following SOLID principles:
- **Single Responsibility**: One purpose per class/function
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes substitutable for base
- **Interface Segregation**: Focused, specific interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

### UI Development Standards
- **Layout**: Use `flex flex-col` with `gap-*` classes
- **AVOID**: `space-y-*`, `max-w-*` classes
- **Components**: Always check `components/ui/` before creating new components
- **shadcn/ui**: Install components via CLI, don't create manually

### TypeScript Standards
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Leverage Drizzle ORM types for database operations
- Implement proper error handling with typed exceptions

### Database Operations
- Use Drizzle ORM for all database interactions
- Follow schema definitions from `docs/schema.sql`
- Implement proper relationships and constraints
- Use TanStack Query for data fetching with proper caching

### Authentication Patterns
```typescript
// Use established auth patterns
import { useAuth } from '@/hooks/auth/use-auth'
import { authService } from '@/services'

// Component example
const { user, isAuthenticated, signIn } = useAuth()
```

### API Integration
```typescript
// Follow service layer pattern
import { storyService } from '@/services'
import { useStories } from '@/hooks/api/use-stories'

// Hook usage in components
const { data: stories, isLoading, error } = useStories({ genre: 'fantasy' })
```

### Error Handling
```typescript
// Use error boundaries and proper error types
import { PageErrorBoundary, ComponentErrorBoundary } from '@/components/ui/error-boundary'
import { LoadingWrapper } from '@/components/ui/loading-states'
```

## Feature-Specific Guidelines

### Collaborative Storytelling
- Implement real-time updates with Supabase subscriptions
- Use optimistic updates for voting mechanisms
- Handle concurrent user interactions gracefully

### Gamification System
- Track user progress with XP, levels, and achievements
- Implement streak calculations and milestone rewards
- Use Zustand for game state management

### Content Moderation
- Implement content tier filtering
- Use Row Level Security for access control
- Add community reporting mechanisms

## Quality Assurance
- Generate code that passes TypeScript strict checks
- Include proper error boundaries and loading states
- Implement responsive design with mobile-first approach
- Follow accessibility best practices

## Testing Considerations
- Write testable code with proper dependency injection
- Consider integration testing for user flows
- Implement proper mocking for external services

---

**Technology Change Protocol**: If suggesting technology changes, always mention the need to update `docs/tech.md` to reflect the modifications and ensure team alignment.