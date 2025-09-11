# CLAUDE.md - Development Rules and Guidelines

## Primary Task
**ALWAYS** read all files in the `docs/` directory at the beginning of any development session to understand the project requirements and architecture.

## Development Workflow Rules

### 1. Pre-Development Reading
- **MANDATORY**: Read all files in `docs/` folder before starting any work
- Understand the PRD (`docs/prd.md`) for product requirements
- Review the database schema (`docs/schema.sql`) for data structure
- Check the development plan (`docs/plan.md`) for task organization
- Study the technical architecture (`docs/tech.md`) for implementation guidelines

### 2. Post-Completion Code Review
After completing any user prompt and finishing all related tasks:

#### SOLID Principle Review
- **Single Responsibility**: Each class/function should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Derived classes must be substitutable for base classes
- **Interface Segregation**: Clients shouldn't depend on interfaces they don't use
- **Dependency Inversion**: Depend on abstractions, not concretions

Review all new/modified code to ensure SOLID compliance.

#### Build and Test Process
1. **Build**: Always run the build command to ensure no compilation errors
2. **Development Server**: Start the dev server (`npm run dev` or equivalent)
3. **Automated Review**: Use available MCP tools (Playwright) to review the implementation
4. **User Flow Testing**: Follow actual user workflows to validate functionality

### 3. Technology Learning
When uncertain about any tech stack usage:
- **ALWAYS** use Context7 MCP to learn and understand the proper implementation
- Research best practices and patterns for the specific technology
- Apply learned patterns consistently throughout the project

### 4. UI Development Rules

#### Layout Preferences
- **ALWAYS** use `flex flex-col` with `gap-*` classes
- **NEVER** use `space-y-*` utilities
- **NEVER** use `max-w-*` classes for width constraints

#### Component Architecture
- **ALWAYS** use shadcn/ui as the base component library
- **MANDATORY**: Check `components/ui/` folder before creating any UI component
- **NEVER** create "shadcn-style" components manually
- **ALWAYS** use the official shadcn CLI: `bunx shadcn@latest add [component-name]`

#### Component Installation Process
1. Check if component exists in `components/ui/`
2. If not present, install via CLI: `bunx shadcn@latest add [component-name]`
3. Import and use the installed component
4. Customize through composition, not modification

### 5. Development Quality Assurance

#### Before Marking Tasks Complete
- [ ] Code follows SOLID principles
- [ ] Build completes successfully
- [ ] Development server runs without errors
- [ ] MCP Playwright review completed (when applicable)
- [ ] UI follows established patterns (flex, gap, shadcn components)
- [ ] All functionality tested through user workflows

#### Error Resolution
- If MCP Context7 is available, use it to research solutions
- Follow tech stack documentation and best practices
- Maintain consistency with existing codebase patterns

## Architecture Compliance

### Database Operations
- Use Drizzle ORM for all database interactions
- Follow the schema defined in `docs/schema.sql`
- Implement proper Row Level Security (RLS) policies

### State Management
- Use TanStack Query for server state
- Use Zustand for client-side global state
- Implement optimistic updates for real-time feel

### API Design
- Follow RESTful conventions
- Implement proper error handling
- Use TypeScript for type safety

### Real-time Features
- Use Supabase subscriptions with TanStack Query integration
- Implement optimistic updates for immediate feedback
- Handle connection states and errors gracefully

## Project-Specific Rules

### Naratia MVP Requirements
Based on the documentation in `docs/`, ensure compliance with:
- Collaborative storytelling mechanics
- Voting system implementation
- Gamification features (XP, achievements, streaks)
- Content moderation system
- Mobile-first responsive design
- Progressive Web App (PWA) capabilities

### Security Requirements
- Implement proper authentication with Supabase Auth
- Follow Row Level Security policies
- Prevent multi-account abuse
- Content filtering and moderation
- Rate limiting for API endpoints

### Performance Standards
- Mobile-optimized loading times
- Efficient database queries with proper indexing
- Client-side caching with TanStack Query
- Progressive enhancement for core functionality

## Testing Standards

### Automated Testing
- Use Playwright MCP for end-to-end testing when available
- Test critical user journeys
- Validate real-time features functionality
- Ensure mobile responsiveness

### Manual Testing Checklist
- [ ] User registration and authentication flow
- [ ] Story creation and reading experience
- [ ] Contribution and voting mechanics
- [ ] Real-time updates and notifications
- [ ] Mobile interface and touch interactions
- [ ] Achievement and gamification systems

## Deployment Rules

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Build successful
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Performance metrics acceptable
- [ ] Security review completed

### Production Monitoring
- Monitor error rates and performance
- Track user engagement metrics
- Validate real-time feature stability
- Ensure database performance remains optimal

---

**Remember**: This document should be referenced at the start of every development session and after completing any major task to ensure consistency and quality.