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

### 2. Task Management and Progress Tracking
- **ALWAYS** maintain a checklist for everything outlined in `docs/plan.md`
- Cross-reference completed tasks against the development plan
- Mark tasks as completed only when they fully meet the plan requirements
- Update progress tracking tools (TodoWrite) to reflect plan.md task status

### 3. Package Management Rules
- **ALWAYS** use `bun` for package installation and management
- **NEVER** use `npm install` - use `bun add [package-name]` instead
- **NEVER** use `npm remove` - use `bun remove [package-name]` instead
- For development dependencies: `bun add -d [package-name]`
- For global packages: `bun add -g [package-name]`

### 4. Technology Stack Management
- **MANDATORY**: When changing any technology in the stack, update `docs/tech.md` immediately
- Technology changes must be reflected in both implementation and documentation
- Ensure all team members are aware of tech stack changes through proper documentation
- Validate that new technology choices align with project requirements in `docs/prd.md`

### 5. Project Structure Compliance
- **STRICTLY FOLLOW**: The folder and file structure blueprint defined in `docs/tech.md`
- **DO NOT** deviate from the established src/ directory structure
- All new files and folders must conform to the architecture outlined in tech.md
- Maintain consistency with the SOLID principles structure defined in the blueprint

### 6. Post-Completion Code Review
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
2. **Development Server**: Start the dev server (`bun run dev` or equivalent)
3. **Automated Review**: Use available MCP tools (Playwright) to review the implementation
4. **User Flow Testing**: Follow actual user workflows to validate functionality

### 7. Technology Learning
When uncertain about any tech stack usage:
- **ALWAYS** use Context7 MCP to learn and understand the proper implementation
- Research best practices and patterns for the specific technology
- Apply learned patterns consistently throughout the project

### 8. UI Development Rules

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

### 9. Development Quality Assurance

#### Before Marking Tasks Complete
- [ ] Code follows SOLID principles
- [ ] Build completes successfully (`bun run build`)
- [ ] Development server runs without errors (`bun run dev`)
- [ ] MCP Playwright review completed (when applicable)
- [ ] UI follows established patterns (flex, gap, shadcn components)
- [ ] All functionality tested through user workflows
- [ ] Task completion verified against `docs/plan.md` requirements
- [ ] Project structure adheres to `docs/tech.md` blueprint
- [ ] All packages installed using `bun add` commands

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