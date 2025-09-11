ALTER TABLE "users" ALTER COLUMN "content_preference" SET DEFAULT 'general';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "age_verified";