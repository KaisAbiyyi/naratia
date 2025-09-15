'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, UserIcon, BookOpenIcon } from 'lucide-react'

interface StoryCardProps {
  story: {
    id: string
    title: string
    description?: string
    status: string
    contentTier: string
    createdAt: string
    creator?: {
      username?: string
      displayName?: string
      avatarUrl?: string
    }
    genres?: Array<{
      name: string
      colorHex?: string
    }>
  }
  feedStyle?: boolean
}

export function StoryCard({ story, feedStyle = false }: StoryCardProps) {
  const creatorName = story.creator?.displayName || story.creator?.username || 'Anonymous'
  const statusColor = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    length_limited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    abandoned: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }[story.status] || 'bg-gray-100 text-gray-800'

  const contentTierColor = {
    general: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    teen: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    mature: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    adult: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }[story.contentTier] || 'bg-gray-100 text-gray-800'

  if (feedStyle) {
    // Social media feed style layout
    return (
      <div className="bg-card rounded-lg border p-6 hover:shadow-sm transition-all duration-200">
        {/* Post Header - Creator Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={story.creator?.avatarUrl} />
            <AvatarFallback>
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{creatorName}</span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">
                {new Date(story.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className={`${statusColor} text-xs`}>
                {story.status.replace('_', ' ')}
              </Badge>
              <Badge className={`${contentTierColor} text-xs`}>
                {story.contentTier}
              </Badge>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <Link href={`/stories/${story.id}`} className="block group">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {story.title}
          </h3>
          {story.description && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {story.description}
            </p>
          )}

          {/* Genres */}
          {story.genres && story.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {story.genres.slice(0, 4).map((genre, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  style={genre.colorHex ? { borderColor: genre.colorHex, color: genre.colorHex } : {}}
                >
                  {genre.name}
                </Badge>
              ))}
              {story.genres.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{story.genres.length - 4}
                </Badge>
              )}
            </div>
          )}
        </Link>

        {/* Engagement Actions - placeholder for future */}
        <div className="flex items-center gap-4 pt-3 border-t">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <BookOpenIcon className="w-4 h-4" />
            <span>Read Story</span>
          </div>
        </div>
      </div>
    )
  }

  // Default card grid layout
  return (
    <Link href={`/stories/${story.id}`}>
      <div className="group bg-card rounded-lg border hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {story.title}
            </h3>
            <div className="flex gap-2 shrink-0">
              <Badge variant="secondary" className={statusColor}>
                {story.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          {/* Description */}
          {story.description && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
              {story.description}
            </p>
          )}

          {/* Genres */}
          {story.genres && story.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {story.genres.slice(0, 3).map((genre, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs"
                  style={genre.colorHex ? { borderColor: genre.colorHex, color: genre.colorHex } : {}}
                >
                  {genre.name}
                </Badge>
              ))}
              {story.genres.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{story.genres.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/50 border-t">
          <div className="flex items-center justify-between text-sm">
            {/* Creator Info */}
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={story.creator?.avatarUrl} />
                <AvatarFallback className="text-xs">
                  <UserIcon className="w-3 h-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">{creatorName}</span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
              <Badge className={contentTierColor}>
                {story.contentTier}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}