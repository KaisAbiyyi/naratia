# CLAUDE.md - Development Rules and Guidelines

## Primary Tasks
1. **ALWAYS** read `recent_changes.md` FIRST before any development work
2. **MANDATORY**: Read all files in `docs/` directory at start of development session

## Pre-Development Reading Order
1. `recent_changes.md` - Last 5 changes summary
2. `docs/prd.md` - Product requirements
3. `docs/schema.sql` - Database structure
4. `docs/plan.md` - Task organization
5. `docs/tech.md` - Technical architecture

## Core Rules

### Package Management
- Use `bun add` (NOT npm install)
- Use `bun remove` (NOT npm remove)
- Dev deps: `bun add -d`

### UI Development
- Layout: `flex flex-col` with `gap-*` (NEVER `space-y-*` or `max-w-*`)
- Components: Use shadcn/ui via `bunx shadcn@latest add [component]`
- Check `components/ui/` before creating new components

### Structure & Tech
- Follow `docs/tech.md` structure strictly
- Update `docs/tech.md` when changing tech stack
- Use: Drizzle ORM, TanStack Query, Zustand, Supabase Auth

### Quality Assurance
- Run `bun run build` and `bun run dev` after changes
- Follow SOLID principles
- Test user workflows with Playwright MCP
- Verify tasks against `docs/plan.md`

### Recent Changes Management
- **ALWAYS** update `recent_changes.md` after completing any task
- Keep only last 5 changes in chronological order (newest first)
- Include: date, task summary, files modified

---

**Remember**: This document should be referenced at the start of every development session and after completing any major task to ensure consistency and quality.
- always use a server component on every page.tsx file as it must always have a complete metadata that helps the SEO.