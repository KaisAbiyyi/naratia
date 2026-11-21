import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle hanya dipakai untuk skema dan membuat file migrasi (`pnpm db:generate`).
 * File migrasi ditulis ke supabase/migrations dengan nama format Supabase, lalu diterapkan
 * lewat Supabase CLI (`supabase db push`) atau Supabase MCP. Aturan game (fungsi, RLS tambahan,
 * view) ditulis sebagai migrasi custom: `pnpm db:generate --custom --name <nama>`.
 */
export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/server/db/schema.ts',
	out: './supabase/migrations',
	schemaFilter: ['public'],
	entities: { roles: { provider: 'supabase' } },
	migrations: { prefix: 'supabase' },
	strict: true,
	verbose: true
});
