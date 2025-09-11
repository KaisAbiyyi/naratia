// Story Service following Single Responsibility Principle
import type { ApiClient } from '@/services/api/client'
import type { Story, StoryCreateForm, ApiResponse, PaginatedResponse } from '@/types'

export interface StoryService {
  getStories(params?: GetStoriesParams): Promise<PaginatedResponse<Story>>
  getStory(id: string): Promise<ApiResponse<Story>>
  createStory(data: StoryCreateForm): Promise<ApiResponse<Story>>
  updateStory(id: string, data: Partial<StoryCreateForm>): Promise<ApiResponse<Story>>
  deleteStory(id: string): Promise<ApiResponse<void>>
}

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

class ApiStoryService implements StoryService {
  constructor(private apiClient: ApiClient) {}

  async getStories(params: GetStoriesParams = {}): Promise<PaginatedResponse<Story>> {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })

    const endpoint = `/stories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.apiClient.get<PaginatedResponse<Story>>(endpoint)
  }

  async getStory(id: string): Promise<ApiResponse<Story>> {
    return this.apiClient.get<ApiResponse<Story>>(`/stories/${id}`)
  }

  async createStory(data: StoryCreateForm): Promise<ApiResponse<Story>> {
    return this.apiClient.post<ApiResponse<Story>>('/stories', data)
  }

  async updateStory(id: string, data: Partial<StoryCreateForm>): Promise<ApiResponse<Story>> {
    return this.apiClient.put<ApiResponse<Story>>(`/stories/${id}`, data)
  }

  async deleteStory(id: string): Promise<ApiResponse<void>> {
    return this.apiClient.delete<ApiResponse<void>>(`/stories/${id}`)
  }
}

// Export factory function to inject dependencies
export const createStoryService = (apiClient: ApiClient): StoryService => {
  return new ApiStoryService(apiClient)
}