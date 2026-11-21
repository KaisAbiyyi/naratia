-- auth.users milik Supabase; Drizzle hanya merujuknya.
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"round_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"process_json" jsonb,
	"thread_claims" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "candidates_body_length" CHECK (char_length("candidates"."body") between 1 and 2000),
	CONSTRAINT "candidates_status_check" CHECK ("candidates"."status" in ('active', 'disqualified', 'won', 'lost'))
);
--> statement-breakpoint
ALTER TABLE "candidates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chapters_status_check" CHECK ("chapters"."status" in ('open', 'voting', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "chapters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "paragraphs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"idx" integer NOT NULL,
	"author_id" uuid NOT NULL,
	"body" text NOT NULL,
	"process_json" jsonb,
	"wound" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "paragraphs_body_length" CHECK (char_length("paragraphs"."body") between 1 and 2000)
);
--> statement-breakpoint
ALTER TABLE "paragraphs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_format" CHECK ("profiles"."username" ~ '^[a-z0-9_]{3,20}$')
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rounds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"number" integer NOT NULL,
	"holder_id" uuid,
	"preset" text DEFAULT 'normal' NOT NULL,
	"constraint_key" text,
	"opens_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closes_at" timestamp with time zone NOT NULL,
	"extended_count" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"candidate_count" integer DEFAULT 0 NOT NULL,
	"winner_candidate_id" uuid,
	CONSTRAINT "rounds_preset_check" CHECK ("rounds"."preset" in ('kilat', 'normal', 'panjang')),
	CONSTRAINT "rounds_status_check" CHECK ("rounds"."status" in ('open', 'closed'))
);
--> statement-breakpoint
ALTER TABLE "rounds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"genre" text NOT NULL,
	"mode" text NOT NULL,
	"license" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"chapter_size" integer DEFAULT 20 NOT NULL,
	"paragraph_count" integer DEFAULT 0 NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stories_mode_check" CHECK ("stories"."mode" in ('solo', 'collab')),
	CONSTRAINT "stories_status_check" CHECK ("stories"."status" in ('active', 'sleeping', 'ended')),
	CONSTRAINT "stories_chapter_size_check" CHECK ("stories"."chapter_size" between 3 and 100)
);
--> statement-breakpoint
ALTER TABLE "stories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "votes" (
	"round_id" uuid NOT NULL,
	"voter_id" uuid NOT NULL,
	"candidate_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "votes_pkey" PRIMARY KEY("round_id","voter_id")
);
--> statement-breakpoint
ALTER TABLE "votes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_chapter_id_chapters_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paragraphs" ADD CONSTRAINT "paragraphs_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_holder_id_profiles_id_fk" FOREIGN KEY ("holder_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_round_id_rounds_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."rounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_profiles_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "candidates_round_created_idx" ON "candidates" USING btree ("round_id","created_at");--> statement-breakpoint
CREATE INDEX "candidates_author_idx" ON "candidates" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "chapters_story_number_key" ON "chapters" USING btree ("story_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "paragraphs_story_idx_key" ON "paragraphs" USING btree ("story_id","idx");--> statement-breakpoint
CREATE INDEX "paragraphs_chapter_idx" ON "paragraphs" USING btree ("chapter_id","idx");--> statement-breakpoint
CREATE INDEX "paragraphs_author_idx" ON "paragraphs" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX "rounds_story_number_key" ON "rounds" USING btree ("story_id","number");--> statement-breakpoint
CREATE UNIQUE INDEX "rounds_one_open_per_story" ON "rounds" USING btree ("story_id") WHERE "rounds"."status" = 'open';--> statement-breakpoint
CREATE INDEX "rounds_open_closes_idx" ON "rounds" USING btree ("closes_at") WHERE "rounds"."status" = 'open';--> statement-breakpoint
CREATE UNIQUE INDEX "stories_slug_key" ON "stories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stories_status_updated_idx" ON "stories" USING btree ("status","updated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "votes_candidate_idx" ON "votes" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "votes_voter_idx" ON "votes" USING btree ("voter_id");--> statement-breakpoint
CREATE POLICY "candidates_select_all" ON "candidates" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "chapters_select_all" ON "chapters" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "paragraphs_select_all" ON "paragraphs" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "profiles_select_all" ON "profiles" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "rounds_select_all" ON "rounds" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "stories_select_all" ON "stories" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "votes_select_own" ON "votes" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("votes"."voter_id" = (select auth.uid()));