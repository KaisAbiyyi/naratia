# Naratia

A collaborative storytelling platform where communities build narratives together, paragraph by paragraph, through democratic voting.

## Overview

Naratia enables users to create and develop stories collectively. Writers submit paragraph contributions, and the community votes to determine which continuation becomes part of the official narrative. This democratic approach creates unique, community-driven stories that evolve based on collective creativity and preference.

## Key Features

### Core Functionality
- **Story Creation**: Users initiate stories with titles, genres, and opening paragraphs
- **Collaborative Writing**: Community members contribute paragraph continuations
- **Democratic Voting**: Real-time voting system determines story progression
- **Multiple Endings**: Stories can conclude through various community-driven mechanisms
- **Genre Organization**: Stories categorized and filtered by multiple genres

### User Experience
- **Gamification System**: XP, achievements, and streak tracking for sustained engagement
- **Real-time Updates**: Live voting updates and story progression notifications
- **Mobile Responsive**: Touch-optimized interface for seamless mobile experience
- **Progressive Web App**: App-like experience with offline reading capabilities
- **Interactive Onboarding**: Tutorial system guiding new users through platform mechanics

### Content Management
- **Content Moderation**: Community flagging and automated spam prevention
- **Quality Control**: Character limits, submission cooldowns, and validation
- **Multiple Content Tiers**: Age-appropriate content filtering and preferences

## Technology Stack

### Frontend
- Next.js 15 with App Router
- TypeScript for type safety
- TailwindCSS with shadcn/ui components
- TanStack Query for data fetching and caching
- Zustand for state management
- React Hook Form with Zod validation
- Framer Motion for animations

### Backend & Infrastructure
- Supabase for backend services (Auth, Database, Real-time)
- PostgreSQL with Row Level Security
- Drizzle ORM for type-safe database operations
- Vercel for deployment and hosting

### Mobile & Performance
- Progressive Web App architecture
- Mobile-optimized UI components
- Offline reading capabilities
- Real-time synchronization

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account
- Vercel account (for deployment)

### Installation
```bash
# Clone the repository
git clone https://github.com/KaisAbiyyi/naratia.git
cd naratia

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env.local
# Configure your Supabase and other service keys

# Initialize database
bun run db:migrate
bun run db:seed

# Start development server
bun run dev
```

### Environment Configuration
Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
├── components/       # shadcn/ui components and custom UI
│   ├── ui/           # Base UI components
│   ├── forms/        # Form components
│   ├── layout/       # Layout components
│   └── features/     # Feature-specific components
├── lib/             # Core utilities and configurations
│   ├── db/          # Database schema and connections
│   ├── auth/        # Authentication utilities
│   ├── validations/ # Zod validation schemas
│   └── utils/       # Helper functions
├── hooks/           # Custom React hooks and data fetching
├── services/        # API services and external integrations
├── stores/          # Zustand global state stores
├── types/           # TypeScript type definitions
└── constants/       # Application constants
```

## Development

### Available Scripts
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript compiler
bun run db:migrate   # Run database migrations
bun run db:seed      # Seed database with initial data
```

### Database Management
The project uses Drizzle ORM for database operations:
```bash
# Generate migrations
bun run db:generate

# Push changes to database
bun run db:push

# View database in Drizzle Studio
bun run db:studio
```

## Architecture

### Database Design
- **Normalized Schema**: Clean separation of concerns with derived metrics
- **Self-Referencing Structure**: story_contributions table handles branching logic
- **Row Level Security**: Supabase RLS policies for data access control
- **Performance Optimized**: Strategic indexing and materialized views

### Real-time Features
- Live voting updates using Supabase subscriptions
- Optimistic UI updates with automatic rollback
- Background data synchronization
- Connection status monitoring

### Security
- JWT-based authentication with refresh tokens
- Row Level Security for data isolation
- Content moderation and spam prevention
- Rate limiting and request validation

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch following the naming convention: `feature/branch-name`
3. Make your changes following the established code standards
4. Add tests for new functionality
5. Submit a pull request with a clear description

### Code Standards
- TypeScript strict mode with comprehensive typing
- ESLint and Prettier for code formatting
- React Hook Form with Zod for form validation
- TanStack Query patterns for data fetching
- Component composition following SOLID principles

### Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI interactions
- End-to-end tests for critical user flows

## Deployment

### Vercel Deployment
The application is optimized for Vercel deployment:
```bash
# Deploy to Vercel
vercel --prod

# Environment variables are configured in Vercel dashboard
# Database migrations run automatically on deployment
```

### Database Migrations
Production migrations are handled through Drizzle:
- Migrations are version-controlled and reversible
- Schema changes follow additive-only approach in production
- Backup strategies implemented for data safety

## Roadmap

### Current Version (MVP)
- Core collaborative storytelling functionality
- Real-time voting system
- Basic gamification and achievements
- Mobile-responsive interface
- User onboarding and tutorial system

### Planned Features
- Advanced content moderation tools
- Story branching and alternative paths
- Enhanced analytics and insights
- Social features and user profiles
- Monetization and premium features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, bug reports, or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## Acknowledgments

Built with modern web technologies and best practices for performance, scalability, and user experience. Special thanks to the open source community for the tools and libraries that make this project possible.