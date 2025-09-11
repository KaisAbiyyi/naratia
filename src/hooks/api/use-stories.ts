// Stories API hooks using TanStack Query
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { storyService } from '@/services'
import type { Story, StoryCreateForm, GetStoriesParams } from '@/types'

// Query keys for consistent caching
export const storyKeys = {
  all: ['stories'] as const,
  lists: () => [...storyKeys.all, 'list'] as const,
  list: (params: GetStoriesParams) => [...storyKeys.lists(), params] as const,
  details: () => [...storyKeys.all, 'detail'] as const,
  detail: (id: string) => [...storyKeys.details(), id] as const,
}

// Get paginated stories
export function useStories(params: GetStoriesParams = {}) {
  return useQuery({
    queryKey: storyKeys.list(params),
    queryFn: () => storyService.getStories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get infinite stories for infinite scroll
export function useInfiniteStories(params: Omit<GetStoriesParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: [...storyKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) => storyService.getStories({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  })
}

// Get single story
export function useStory(id: string, enabled = true) {
  return useQuery({
    queryKey: storyKeys.detail(id),
    queryFn: () => storyService.getStory(id),
    enabled: !!id && enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes for individual stories
  })
}

// Create story mutation
export function useCreateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: StoryCreateForm) => storyService.createStory(data),
    onSuccess: (newStory) => {
      // Invalidate and refetch story lists
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
      // Optimistically add the new story to the cache
      queryClient.setQueryData(storyKeys.detail(newStory.data.id), newStory)
    },
    onError: (error) => {
      console.error('Failed to create story:', error)
    },
  })
}

// Update story mutation
export function useUpdateStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StoryCreateForm> }) =>
      storyService.updateStory(id, data),
    onSuccess: (updatedStory, { id }) => {
      // Update the story in cache
      queryClient.setQueryData(storyKeys.detail(id), updatedStory)
      // Invalidate story lists to reflect changes
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to update story:', error)
    },
  })
}

// Delete story mutation
export function useDeleteStory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => storyService.deleteStory(id),
    onSuccess: (_, deletedId) => {
      // Remove story from cache
      queryClient.removeQueries({ queryKey: storyKeys.detail(deletedId) })
      // Invalidate story lists
      queryClient.invalidateQueries({ queryKey: storyKeys.lists() })
    },
    onError: (error) => {
      console.error('Failed to delete story:', error)
    },
  })
}

// Prefetch story for performance
export function usePrefetchStory() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: storyKeys.detail(id),
      queryFn: () => storyService.getStory(id),
      staleTime: 10 * 60 * 1000,
    })
  }
}