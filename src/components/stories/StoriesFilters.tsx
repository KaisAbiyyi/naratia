'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useGenres } from '@/hooks/api/use-genres'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SearchIcon, FilterIcon } from 'lucide-react'

export function StoriesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: genres, isLoading: genresLoading } = useGenres()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [genre, setGenre] = useState(searchParams.get('genre') || 'all')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [contentTier, setContentTier] = useState(searchParams.get('contentTier') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at')

  const updateFilters = () => {
    const params = new URLSearchParams()
    
    if (search) params.set('search', search)
    if (genre && genre !== 'all') params.set('genre', genre)
    if (status && status !== 'all') params.set('status', status)
    if (contentTier && contentTier !== 'all') params.set('contentTier', contentTier)
    if (sortBy && sortBy !== 'created_at') params.set('sortBy', sortBy)
    
    const queryString = params.toString()
    router.push(`/stories${queryString ? `?${queryString}` : ''}`)
  }

  const clearFilters = () => {
    setSearch('')
    setGenre('all')
    setStatus('all')
    setContentTier('all')
    setSortBy('created_at')
    router.push('/stories')
  }

  const hasFilters = search || (genre && genre !== 'all') || (status && status !== 'all') || (contentTier && contentTier !== 'all') || sortBy !== 'created_at'

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search stories by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && updateFilters()}
          />
        </div>
        <Button onClick={updateFilters}>
          Search
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Genre Filter */}
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {!genresLoading && genres?.map((g) => (
              <SelectItem key={g.id} value={g.name}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="length_limited">Length Limited</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>

        {/* Content Tier Filter */}
        <Select value={contentTier} onValueChange={setContentTier}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Content" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Content</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="teen">Teen</SelectItem>
            <SelectItem value="mature">Mature</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Options */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="updated_at">Recently Updated</SelectItem>
            <SelectItem value="title">Alphabetical</SelectItem>
          </SelectContent>
        </Select>

        {/* Apply/Clear Buttons */}
        <div className="flex gap-2 sm:ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={updateFilters}
            className="gap-2"
          >
            <FilterIcon className="w-4 h-4" />
            Apply
          </Button>
          {hasFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}