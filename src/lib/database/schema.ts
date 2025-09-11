import { pgTable, uuid, varchar, text, boolean, timestamp, integer, decimal, pgEnum } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Enums based on the database schema
export const contentTier = pgEnum('content_tier', ['all_ages', 'mature', 'explicit'])
export const storyStatus = pgEnum('story_status', ['active', 'completed', 'length_limited', 'abandoned'])
export const contributionStatus = pgEnum('contribution_status', ['pending', 'selected', 'rejected', 'flagged'])
export const voteType = pgEnum('vote_type', ['paragraph', 'ending', 'flag'])
export const achievementType = pgEnum('achievement_type', ['reading', 'voting', 'writing', 'completion', 'streak', 'special'])
export const notificationType = pgEnum('notification_type', ['vote_needed', 'story_update', 'streak_warning', 'achievement', 'system'])

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: text('avatar_url'),
  ageVerified: boolean('age_verified').default(false),
  contentPreference: contentTier('content_preference').default('all_ages'),
  
  // Gamification fields
  totalXp: integer('total_xp').default(0),
  currentLevel: integer('current_level').default(1),
  readingStreak: integer('reading_streak').default(0),
  votingStreak: integer('voting_streak').default(0),
  writingStreak: integer('writing_streak').default(0),
  lastActivityDate: timestamp('last_activity_date'),
  perfectDaysCount: integer('perfect_days_count').default(0),
  
  // Moderation fields
  qualityScore: decimal('quality_score', { precision: 3, scale: 2 }).default('5.00'),
  isFlagged: boolean('is_flagged').default(false),
  isSuspended: boolean('is_suspended').default(false),
  suspensionUntil: timestamp('suspension_until'),
  
  // Future features
  isPremium: boolean('is_premium').default(false),
  premiumUntil: timestamp('premium_until'),
  tokenBalance: integer('token_balance').default(0),
  bio: text('bio'),
  location: varchar('location', { length: 100 }),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLogin: timestamp('last_login'),
})

// Genres table
export const genres = pgTable('genres', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  colorHex: varchar('color_hex', { length: 7 }),
  iconName: varchar('icon_name', { length: 50 }),
  isActive: boolean('is_active').default(true),
  minContentTier: contentTier('min_content_tier').default('all_ages'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Stories table
export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  creatorId: uuid('creator_id').references(() => users.id),
  status: storyStatus('status').default('active'),
  contentTier: contentTier('content_tier').default('all_ages'),
  
  // Voting configuration
  votingDurationHours: integer('voting_duration_hours').default(48),
  minVotesRequired: integer('min_votes_required').default(5),
  maxPendingContributions: integer('max_pending_contributions').default(5),
  
  // Future features
  isPrivate: boolean('is_private').default(false),
  accessCode: varchar('access_code', { length: 50 }),
  isFeatured: boolean('is_featured').default(false),
  featuredUntil: timestamp('featured_until'),
  isPremium: boolean('is_premium').default(false),
  priceTokens: integer('price_tokens').default(0),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Story genres (Many-to-many)
export const storyGenres = pgTable('story_genres', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  genreId: uuid('genre_id').notNull().references(() => genres.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').default(1),
  createdAt: timestamp('created_at').defaultNow(),
})

// Story contributions
export const storyContributions = pgTable('story_contributions', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  contributorId: uuid('contributor_id').references(() => users.id),
  parentContributionId: uuid('parent_contribution_id').references((): any => storyContributions.id),
  
  // Content
  content: text('content').notNull(),
  wordCount: integer('word_count').notNull(),
  isEnding: boolean('is_ending').default(false),
  isOpening: boolean('is_opening').default(false),
  
  // Status
  status: contributionStatus('status').default('pending'),
  isSelected: boolean('is_selected').default(false),
  selectedAt: timestamp('selected_at'),
  sequenceNumber: integer('sequence_number'),
  
  // Branching
  branchName: varchar('branch_name', { length: 100 }),
  branchDescription: text('branch_description'),
  branchDepth: integer('branch_depth').default(0),
  
  // Quality metrics
  readingTimeEstimate: integer('reading_time_estimate'),
  complexityScore: decimal('complexity_score', { precision: 3, scale: 2 }),
  
  // Metadata
  createdAt: timestamp('created_at').defaultNow(),
})

// Votes table
export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  voterId: uuid('voter_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  contributionId: uuid('contribution_id').references(() => storyContributions.id, { onDelete: 'cascade' }),
  voteType: voteType('vote_type').default('paragraph'),
  isEndingVote: boolean('is_ending_vote').default(false),
  createdAt: timestamp('created_at').defaultNow(),
})

// User achievements
export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementKey: varchar('achievement_key', { length: 100 }).notNull(),
  achievementType: achievementType('achievement_type').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  currentProgress: integer('current_progress').default(0),
  requiredProgress: integer('required_progress').notNull(),
  isCompleted: boolean('is_completed').default(false),
  xpReward: integer('xp_reward').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  stories: many(stories),
  contributions: many(storyContributions),
  votes: many(votes),
  achievements: many(userAchievements),
}))

export const storiesRelations = relations(stories, ({ one, many }) => ({
  creator: one(users, {
    fields: [stories.creatorId],
    references: [users.id],
  }),
  contributions: many(storyContributions),
  votes: many(votes),
  genres: many(storyGenres),
}))

export const storyContributionsRelations = relations(storyContributions, ({ one, many }) => ({
  story: one(stories, {
    fields: [storyContributions.storyId],
    references: [stories.id],
  }),
  contributor: one(users, {
    fields: [storyContributions.contributorId],
    references: [users.id],
  }),
  parent: one(storyContributions, {
    fields: [storyContributions.parentContributionId],
    references: [storyContributions.id],
  }),
  children: many(storyContributions),
  votes: many(votes),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  story: one(stories, {
    fields: [votes.storyId],
    references: [stories.id],
  }),
  voter: one(users, {
    fields: [votes.voterId],
    references: [users.id],
  }),
  contribution: one(storyContributions, {
    fields: [votes.contributionId],
    references: [storyContributions.id],
  }),
}))

export const genresRelations = relations(genres, ({ many }) => ({
  storyGenres: many(storyGenres),
}))

export const storyGenresRelations = relations(storyGenres, ({ one }) => ({
  story: one(stories, {
    fields: [storyGenres.storyId],
    references: [stories.id],
  }),
  genre: one(genres, {
    fields: [storyGenres.genreId],
    references: [genres.id],
  }),
}))

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
}))