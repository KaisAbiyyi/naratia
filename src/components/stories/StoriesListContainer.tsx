'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useInfiniteStories } from '@/hooks/api/use-stories'
import { Button } from '@/components/ui/button'
import { StoryCard } from './StoryCard'
import { LoaderIcon } from 'lucide-react'

interface StoriesListContainerProps {
  tab?: string
  showFilters?: boolean
  feedStyle?: boolean
}

export function StoriesListContainer({ 
  tab = 'for-you', 
  showFilters = true, 
  feedStyle = false 
}: StoriesListContainerProps = {}) {
  const searchParams = useSearchParams()
  
  // Convert search params to query parameters
  // In feed style, use tab-based sorting instead of search params
  const getSortByFromTab = (tabName: string) => {
    switch (tabName) {
      case 'new': return 'created_at'
      case 'trending': return 'updated_at' // Will implement trending logic later
      case 'following': return 'created_at' // Will implement following logic later  
      case 'for-you':
      default: return 'created_at'
    }
  }

  const params = {
    genre: feedStyle ? undefined : (searchParams.get('genre') || undefined),
    status: feedStyle ? undefined : (searchParams.get('status') || undefined),
    contentTier: feedStyle ? undefined : (searchParams.get('contentTier') || undefined),
    search: feedStyle ? undefined : (searchParams.get('search') || undefined),
    sortBy: feedStyle ? getSortByFromTab(tab) : (searchParams.get('sortBy') || 'created_at') as 'created_at' | 'updated_at' | 'title',
    sortOrder: 'desc' as const,
    limit: feedStyle ? 8 : 12
  }

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteStories(params)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-destructive mb-2">
          Error Loading Stories
        </h3>
        <p className="text-muted-foreground">
          We encountered an error while loading stories. Please try again later.
        </p>
      </div>
    )
  }

  const stories = data?.pages.flatMap(page => page.data) || []

  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">
          No Stories Found
        </h3>
        <p className="text-muted-foreground mb-4">
          No stories match your current filters. Try adjusting your search criteria.
        </p>
        <Button asChild>
          <Link href="/stories/create">Create the First Story</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stories Grid */}
      <div className={feedStyle 
        ? "flex flex-col gap-4" 
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} feedStyle={feedStyle} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            className="gap-2"
          >
            {isFetchingNextPage && <LoaderIcon className="w-4 h-4 animate-spin" />}
            {isFetchingNextPage ? 'Loading...' : 'Load More Stories'}
          </Button>
        </div>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {stories.length} stories
        {data?.pages[0]?.pagination && (
          <> of {data.pages[0].pagination.total} total</>
        )}
      </div>
    </div>
  )
}