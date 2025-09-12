ALTER TABLE "genres" ALTER COLUMN "min_content_tier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "min_content_tier" SET DEFAULT 'general'::text;--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "content_tier" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "content_tier" SET DEFAULT 'general'::text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "content_preference" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "content_preference" SET DEFAULT 'general'::text;--> statement-breakpoint
DROP TYPE "public"."content_tier";--> statement-breakpoint
CREATE TYPE "public"."content_tier" AS ENUM('general', 'teen', 'mature', 'adult');--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "min_content_tier" SET DEFAULT 'general'::"public"."content_tier";--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "min_content_tier" SET DATA TYPE "public"."content_tier" USING "min_content_tier"::"public"."content_tier";--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "content_tier" SET DEFAULT 'general'::"public"."content_tier";--> statement-breakpoint
ALTER TABLE "stories" ALTER COLUMN "content_tier" SET DATA TYPE "public"."content_tier" USING "content_tier"::"public"."content_tier";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "content_preference" SET DEFAULT 'general'::"public"."content_tier";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "content_preference" SET DATA TYPE "public"."content_tier" USING "content_preference"::"public"."content_tier";