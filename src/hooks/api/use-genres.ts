// Genres API hooks using TanStack Query
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/services'
import type { Genre } from '@/types'

// Query keys for consistent caching
export const genreKeys = {
  all: ['genres'] as const,
  list: () => [...genreKeys.all, 'list'] as const,
}

// Get all active genres
export function useGenres() {
  return useQuery({
    queryKey: genreKeys.list(),
    queryFn: async () => {
      const response = await apiClient.get<{ data: Genre[]; success: boolean }>('/genres')
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - genres don't change often
  })
}