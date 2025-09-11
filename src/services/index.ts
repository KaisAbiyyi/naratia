// Service Layer Index - Dependency Injection Container
import { apiClient } from './api/client'
import { authService } from './auth/auth.service'
import { createStoryService } from './story/story.service'

// Initialize services with their dependencies
export const storyService = createStoryService(apiClient)

// Export all services
export { authService, apiClient }
export type { AuthService } from './auth/auth.service'
export type { StoryService, GetStoriesParams } from './story/story.service'
export type { ApiClient } from './api/client'