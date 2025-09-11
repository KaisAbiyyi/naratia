// Core domain types
export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatarUrl?: string
  ageVerified: boolean
  contentPreference: 'all_ages' | 'mature' | 'explicit'
  totalXp: number
  currentLevel: number
  readingStreak: number
  votingStreak: number
  writingStreak: number
  createdAt: string
  updatedAt: string
}

export interface Story {
  id: string
  title: string
  description?: string
  creatorId: string
  status: 'active' | 'completed' | 'length_limited' | 'abandoned'
  contentTier: 'all_ages' | 'mature' | 'explicit'
  votingDurationHours: number
  minVotesRequired: number
  maxPendingContributions: number
  createdAt: string
  updatedAt: string
}

export interface StoryContribution {
  id: string
  storyId: string
  contributorId: string
  parentContributionId?: string
  content: string
  wordCount: number
  isEnding: boolean
  isOpening: boolean
  status: 'pending' | 'selected' | 'rejected' | 'flagged'
  isSelected: boolean
  selectedAt?: string
  sequenceNumber?: number
  branchName?: string
  branchDescription?: string
  branchDepth: number
  createdAt: string
}

export interface Vote {
  id: string
  storyId: string
  voterId: string
  contributionId: string
  voteType: 'paragraph' | 'ending' | 'flag'
  isEndingVote: boolean
  createdAt: string
}

export interface Genre {
  id: string
  name: string
  description?: string
  colorHex?: string
  iconName?: string
  isActive: boolean
  minContentTier: 'all_ages' | 'mature' | 'explicit'
}

export interface UserAchievement {
  id: string
  userId: string
  achievementKey: string
  achievementType: 'reading' | 'voting' | 'writing' | 'completion' | 'streak' | 'special'
  title: string
  description?: string
  currentProgress: number
  requiredProgress: number
  isCompleted: boolean
  xpReward: number
  createdAt: string
  completedAt?: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  username: string
  password: string
  confirmPassword: string
  ageVerified: boolean
}

export interface StoryCreateForm {
  title: string
  description?: string
  genreIds: string[]
  contentTier: 'all_ages' | 'mature' | 'explicit'
  openingParagraph: string
}

export interface ContributionForm {
  content: string
  isEnding?: boolean
}

// API Parameters
export interface GetStoriesParams {
  page?: number
  limit?: number
  genre?: string
  status?: string
  contentTier?: string
  search?: string
  sortBy?: 'created_at' | 'updated_at' | 'title'
  sortOrder?: 'asc' | 'desc'
}