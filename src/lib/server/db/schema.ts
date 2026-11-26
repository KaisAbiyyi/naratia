/**
 * Skema inti Naratia (WP-02). Sumber: docs/tech-plan.md §4.
 *
 * Aturan keamanan: RLS menyala di semua tabel. Semua orang (anon dan login) boleh membaca,
 * kecuali `votes` (hanya suara sendiri). Tidak ada policy insert/update/delete, jadi klien
 * tidak bisa menulis langsung. Semua tulis lewat fungsi `security definer` di migrasi custom.
 * Kolom `candidates.author_id` juga ditutup dengan grant per kolom di migrasi custom,
 * supaya penulis kandidat tetap anonim selama ronde berjalan.
 */
import { sql } from 'drizzle-orm';
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgPolicy,
	pgSchema,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';
import { anonRole, authenticatedRole } from 'drizzle-orm/supabase';

/** Referensi ke auth.users milik Supabase. Tidak dikelola Drizzle (schemaFilter = public). */
const auth = pgSchema('auth');
export const authUsers = auth.table('users', { id: uuid('id').primaryKey() });

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

/** Semua orang boleh membaca. Tulis hanya lewat fungsi. */
const readableByAll = (table: string) =>
	pgPolicy(`${table}_select_all`, {
		for: 'select',
		to: [anonRole, authenticatedRole],
		using: sql`true`
	});

export const profiles = pgTable(
	'profiles',
	{
		id: uuid('id')
			.primaryKey()
			.references(() => authUsers.id, { onDelete: 'cascade' }),
		username: text('username').notNull(),
		createdAt: createdAt()
	},
	(t) => [
		uniqueIndex('profiles_username_key').on(t.username),
		check('profiles_username_format', sql`${t.username} ~ '^[a-z0-9_]{3,20}$'`),
		readableByAll('profiles')
	]
).enableRLS();

export const stories = pgTable(
	'stories',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		slug: text('slug').notNull(),
		title: text('title').notNull(),
		genre: text('genre').notNull(),
		mode: text('mode', { enum: ['solo', 'collab'] }).notNull(),
		license: text('license').notNull(),
		status: text('status', { enum: ['active', 'sleeping', 'ended'] })
			.notNull()
			.default('active'),
		chapterSize: integer('chapter_size').notNull().default(20),
		/** Penghitung, diperbarui oleh fungsi tulis. Supaya Beranda tidak menghitung ulang paragraf. */
		paragraphCount: integer('paragraph_count').notNull().default(0),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => profiles.id),
		createdAt: createdAt(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
	},
	(t) => [
		uniqueIndex('stories_slug_key').on(t.slug),
		index('stories_status_updated_idx').on(t.status, t.updatedAt.desc()),
		check('stories_mode_check', sql`${t.mode} in ('solo', 'collab')`),
		check('stories_status_check', sql`${t.status} in ('active', 'sleeping', 'ended')`),
		check('stories_chapter_size_check', sql`${t.chapterSize} between 3 and 100`),
		readableByAll('stories')
	]
).enableRLS();

export const chapters = pgTable(
	'chapters',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		storyId: uuid('story_id')
			.notNull()
			.references(() => stories.id, { onDelete: 'cascade' }),
		number: integer('number').notNull(),
		status: text('status', { enum: ['open', 'voting', 'closed'] })
			.notNull()
			.default('open'),
		createdAt: createdAt()
	},
	(t) => [
		uniqueIndex('chapters_story_number_key').on(t.storyId, t.number),
		check('chapters_status_check', sql`${t.status} in ('open', 'voting', 'closed')`),
		readableByAll('chapters')
	]
).enableRLS();

export const paragraphs = pgTable(
	'paragraphs',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		storyId: uuid('story_id')
			.notNull()
			.references(() => stories.id, { onDelete: 'cascade' }),
		chapterId: uuid('chapter_id')
			.notNull()
			.references(() => chapters.id, { onDelete: 'cascade' }),
		/** Nomor ¶ dalam cerita, mulai dari 1. */
		idx: integer('idx').notNull(),
		authorId: uuid('author_id')
			.notNull()
			.references(() => profiles.id),
		body: text('body').notNull(),
		/** Catatan proses dari editor (durasi, revisi). Hanya untuk ditampilkan. */
		process: jsonb('process_json'),
		wound: boolean('wound').notNull().default(false),
		createdAt: createdAt()
	},
	(t) => [
		uniqueIndex('paragraphs_story_idx_key').on(t.storyId, t.idx),
		index('paragraphs_chapter_idx').on(t.chapterId, t.idx),
		index('paragraphs_author_idx').on(t.authorId),
		check('paragraphs_body_length', sql`char_length(${t.body}) between 1 and 2000`),
		readableByAll('paragraphs')
	]
).enableRLS();

export const rounds = pgTable(
	'rounds',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		storyId: uuid('story_id')
			.notNull()
			.references(() => stories.id, { onDelete: 'cascade' }),
		number: integer('number').notNull(),
		holderId: uuid('holder_id').references(() => profiles.id),
		preset: text('preset', { enum: ['kilat', 'normal', 'panjang'] })
			.notNull()
			.default('normal'),
		constraintKey: text('constraint_key'),
		opensAt: timestamp('opens_at', { withTimezone: true }).notNull().defaultNow(),
		closesAt: timestamp('closes_at', { withTimezone: true }).notNull(),
		extendedCount: integer('extended_count').notNull().default(0),
		status: text('status', { enum: ['open', 'closed'] })
			.notNull()
			.default('open'),
		/** Penghitung kandidat aktif, diperbarui oleh fungsi tulis. */
		candidateCount: integer('candidate_count').notNull().default(0),
		winnerCandidateId: uuid('winner_candidate_id')
	},
	(t) => [
		uniqueIndex('rounds_story_number_key').on(t.storyId, t.number),
		// Satu cerita hanya punya satu ronde terbuka.
		uniqueIndex('rounds_one_open_per_story')
			.on(t.storyId)
			.where(sql`${t.status} = 'open'`),
		index('rounds_open_closes_idx')
			.on(t.closesAt)
			.where(sql`${t.status} = 'open'`),
		check('rounds_preset_check', sql`${t.preset} in ('kilat', 'normal', 'panjang')`),
		check('rounds_status_check', sql`${t.status} in ('open', 'closed')`),
		readableByAll('rounds')
	]
).enableRLS();

export const candidates = pgTable(
	'candidates',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		roundId: uuid('round_id')
			.notNull()
			.references(() => rounds.id, { onDelete: 'cascade' }),
		authorId: uuid('author_id')
			.notNull()
			.references(() => profiles.id),
		body: text('body').notNull(),
		process: jsonb('process_json'),
		threadClaims: jsonb('thread_claims')
			.notNull()
			.default(sql`'[]'::jsonb`),
		status: text('status', { enum: ['active', 'disqualified', 'won', 'lost'] })
			.notNull()
			.default('active'),
		createdAt: createdAt()
	},
	(t) => [
		index('candidates_round_created_idx').on(t.roundId, t.createdAt),
		index('candidates_author_idx').on(t.authorId),
		check('candidates_body_length', sql`char_length(${t.body}) between 1 and 2000`),
		check('candidates_status_check', sql`${t.status} in ('active', 'disqualified', 'won', 'lost')`),
		readableByAll('candidates')
	]
).enableRLS();

export const votes = pgTable(
	'votes',
	{
		roundId: uuid('round_id')
			.notNull()
			.references(() => rounds.id, { onDelete: 'cascade' }),
		voterId: uuid('voter_id')
			.notNull()
			.references(() => profiles.id),
		candidateId: uuid('candidate_id')
			.notNull()
			.references(() => candidates.id, { onDelete: 'cascade' }),
		createdAt: createdAt()
	},
	(t) => [
		// Satu suara per orang per ronde.
		primaryKey({ name: 'votes_pkey', columns: [t.roundId, t.voterId] }),
		index('votes_candidate_idx').on(t.candidateId),
		index('votes_voter_idx').on(t.voterId),
		// Suara rahasia: orang hanya bisa melihat suaranya sendiri. Jumlah suara dibuka lewat fungsi.
		pgPolicy('votes_select_own', {
			for: 'select',
			to: authenticatedRole,
			using: sql`${t.voterId} = (select auth.uid())`
		})
	]
).enableRLS();
