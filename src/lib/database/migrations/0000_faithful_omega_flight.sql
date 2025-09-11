CREATE TYPE "public"."achievement_type" AS ENUM('reading', 'voting', 'writing', 'completion', 'streak', 'special');--> statement-breakpoint
CREATE TYPE "public"."content_tier" AS ENUM('all_ages', 'mature', 'explicit');--> statement-breakpoint
CREATE TYPE "public"."contribution_status" AS ENUM('pending', 'selected', 'rejected', 'flagged');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('vote_needed', 'story_update', 'streak_warning', 'achievement', 'system');--> statement-breakpoint
CREATE TYPE "public"."story_status" AS ENUM('active', 'completed', 'length_limited', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."vote_type" AS ENUM('paragraph', 'ending', 'flag');--> statement-breakpoint
CREATE TABLE "content_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"flagger_id" uuid NOT NULL,
	"story_id" uuid,
	"contribution_id" uuid,
	"reason" varchar(100) NOT NULL,
	"description" text,
	"is_resolved" boolean DEFAULT false,
	"resolved_by" uuid,
	"resolution_note" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"resolved_at" timestamp with time zone,
	CONSTRAINT "content_flags_flagger_id_story_id_contribution_id_unique" UNIQUE("flagger_id","story_id","contribution_id")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"color_hex" varchar(7),
	"icon_name" varchar(50),
	"is_active" boolean DEFAULT true,
	"min_content_tier" "content_tier" DEFAULT 'all_ages',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"message" text NOT NULL,
	"story_id" uuid,
	"contribution_id" uuid,
	"is_read" boolean DEFAULT false,
	"is_sent" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"read_at" timestamp with time zone,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reading_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"story_id" uuid NOT NULL,
	"contribution_id" uuid,
	"start_time" timestamp with time zone DEFAULT now(),
	"end_time" timestamp with time zone,
	"duration_seconds" integer,
	"scroll_percentage" integer DEFAULT 0,
	"focus_time_seconds" integer DEFAULT 0,
	"return_visits" integer DEFAULT 1,
	"device_type" varchar(50),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"creator_id" uuid,
	"status" "story_status" DEFAULT 'active',
	"content_tier" "content_tier" DEFAULT 'all_ages',
	"voting_duration_hours" integer DEFAULT 48,
	"min_votes_required" integer DEFAULT 5,
	"max_pending_contributions" integer DEFAULT 5,
	"is_private" boolean DEFAULT false,
	"access_code" varchar(50),
	"is_featured" boolean DEFAULT false,
	"featured_until" timestamp,
	"is_premium" boolean DEFAULT false,
	"price_tokens" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_contributions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"contributor_id" uuid,
	"parent_contribution_id" uuid,
	"content" text NOT NULL,
	"word_count" integer NOT NULL,
	"is_ending" boolean DEFAULT false,
	"is_opening" boolean DEFAULT false,
	"status" "contribution_status" DEFAULT 'pending',
	"is_selected" boolean DEFAULT false,
	"selected_at" timestamp with time zone,
	"sequence_number" serial NOT NULL,
	"branch_name" varchar(100),
	"branch_description" text,
	"branch_depth" integer DEFAULT 0,
	"reading_time_estimate" integer,
	"complexity_score" numeric(3, 2),
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "story_genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"display_order" integer DEFAULT 1,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "story_genres_story_id_genre_id_unique" UNIQUE("story_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_key" varchar(100) NOT NULL,
	"achievement_type" "achievement_type" NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text,
	"current_progress" integer DEFAULT 0,
	"required_progress" integer NOT NULL,
	"is_completed" boolean DEFAULT false,
	"xp_reward" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"completed_at" timestamp with time zone,
	CONSTRAINT "user_achievements_user_id_achievement_key_unique" UNIQUE("user_id","achievement_key")
);
--> statement-breakpoint
CREATE TABLE "user_genre_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"genre_id" uuid NOT NULL,
	"interest_level" integer DEFAULT 5,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_genre_preferences_user_id_genre_id_unique" UNIQUE("user_id","genre_id")
);
--> statement-breakpoint
CREATE TABLE "user_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_name" varchar(50) NOT NULL,
	"price_paid" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"is_active" boolean DEFAULT true,
	"stripe_subscription_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(50) NOT NULL,
	"display_name" varchar(100),
	"avatar_url" text,
	"age_verified" boolean DEFAULT false,
	"content_preference" "content_tier" DEFAULT 'all_ages',
	"total_xp" integer DEFAULT 0,
	"current_level" integer DEFAULT 1,
	"reading_streak" integer DEFAULT 0,
	"voting_streak" integer DEFAULT 0,
	"writing_streak" integer DEFAULT 0,
	"last_activity_date" date,
	"perfect_days_count" integer DEFAULT 0,
	"quality_score" numeric(3, 2) DEFAULT '5.00',
	"is_flagged" boolean DEFAULT false,
	"is_suspended" boolean DEFAULT false,
	"suspension_until" timestamp,
	"is_premium" boolean DEFAULT false,
	"premium_until" timestamp,
	"token_balance" integer DEFAULT 0,
	"bio" text,
	"location" varchar(100),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"last_login" timestamp with time zone,
	"ip_address" "inet",
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_id" uuid NOT NULL,
	"voter_id" uuid NOT NULL,
	"contribution_id" uuid,
	"vote_type" "vote_type" DEFAULT 'paragraph',
	"is_ending_vote" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"ip_address" "inet",
	CONSTRAINT "votes_story_id_voter_id_contribution_id_vote_type_unique" UNIQUE("story_id","voter_id","contribution_id","vote_type")
);
--> statement-breakpoint
ALTER TABLE "content_flags" ADD CONSTRAINT "content_flags_flagger_id_users_id_fk" FOREIGN KEY ("flagger_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_flags" ADD CONSTRAINT "content_flags_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_flags" ADD CONSTRAINT "content_flags_contribution_id_story_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."story_contributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_flags" ADD CONSTRAINT "content_flags_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_contribution_id_story_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."story_contributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_sessions" ADD CONSTRAINT "reading_sessions_contribution_id_story_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."story_contributions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_contributions" ADD CONSTRAINT "story_contributions_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_contributions" ADD CONSTRAINT "story_contributions_contributor_id_users_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_contributions" ADD CONSTRAINT "story_contributions_parent_contribution_id_story_contributions_id_fk" FOREIGN KEY ("parent_contribution_id") REFERENCES "public"."story_contributions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_genres" ADD CONSTRAINT "story_genres_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_genres" ADD CONSTRAINT "story_genres_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_genre_preferences" ADD CONSTRAINT "user_genre_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_genre_preferences" ADD CONSTRAINT "user_genre_preferences_genre_id_genres_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_voter_id_users_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_contribution_id_story_contributions_id_fk" FOREIGN KEY ("contribution_id") REFERENCES "public"."story_contributions"("id") ON DELETE cascade ON UPDATE no action;