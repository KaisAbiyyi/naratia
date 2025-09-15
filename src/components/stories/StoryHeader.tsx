'use client'

import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarIcon, UserIcon, TagIcon } from 'lucide-react'

interface StoryHeaderProps {
  story: {
    id: string
    title: string
    description?: string
    status: string
    contentTier: string
    createdAt: Date | string
    creator?: {
      username?: string
      displayName?: string
      avatarUrl?: string
    }
    genres?: Array<{
      name: string
      colorHex?: string
      iconName?: string
    }>
  }
}

export function StoryHeader({ story }: StoryHeaderProps) {
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

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {story.title}
          </h1>
          <div className="flex gap-2 shrink-0">
            <Badge className={statusColor}>
              {story.status.replace('_', ' ')}
            </Badge>
            <Badge className={contentTierColor}>
              {story.contentTier}
            </Badge>
          </div>
        </div>

        {/* Description */}
        {story.description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {story.description}
          </p>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        {/* Creator */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={story.creator?.avatarUrl} />
            <AvatarFallback>
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{creatorName}</p>
            <p className="text-sm text-muted-foreground">Story Creator</p>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="w-4 h-4" />
          <span className="text-sm">
            Created {new Date(story.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Genres */}
      {story.genres && story.genres.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TagIcon className="w-4 h-4" />
            <span>Genres</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {story.genres.map((genre, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="text-sm"
                style={genre.colorHex ? { 
                  borderColor: genre.colorHex, 
                  color: genre.colorHex 
                } : {}}
              >
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}