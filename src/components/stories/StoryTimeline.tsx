'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserIcon, ClockIcon } from 'lucide-react'

interface StoryTimelineProps {
  storyId: string
}

interface StoryContribution {
  id: string
  content: string
  wordCount: number
  isEnding: boolean
  isOpening: boolean
  selectedAt: string
  sequenceNumber: number
  contributor?: {
    username?: string
    displayName?: string
    avatarUrl?: string
  }
}

export function StoryTimeline({ storyId }: StoryTimelineProps) {
  const [contributions, setContributions] = useState<StoryContribution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/stories/${storyId}`)
        const data = await response.json()
        
        if (data.success) {
          setContributions(data.data.contributions || [])
        } else {
          setError('Failed to load story timeline')
        }
      } catch (err) {
        setError('Error loading story timeline')
        console.error('Error fetching contributions:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (storyId) {
      fetchContributions()
    }
  }, [storyId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Story Timeline</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Story Timeline</h2>
        <div className="text-center py-8 text-muted-foreground">
          {error}
        </div>
      </div>
    )
  }

  if (contributions.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Story Timeline</h2>
        <div className="text-center py-8 text-muted-foreground">
          No contributions yet. Be the first to continue this story!
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Story Timeline</h2>
      
      <div className="space-y-6">
        {contributions.map((contribution, index) => {
          const contributorName = contribution.contributor?.displayName || 
                                 contribution.contributor?.username || 
                                 'Anonymous'
          
          return (
            <div 
              key={contribution.id} 
              className="bg-card rounded-lg border p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  {contribution.isOpening && (
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      Opening
                    </Badge>
                  )}
                  {contribution.isEnding && (
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      Ending
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ClockIcon className="w-4 h-4" />
                  {new Date(contribution.selectedAt).toLocaleDateString()}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {contribution.content}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={contribution.contributor?.avatarUrl} />
                    <AvatarFallback className="text-xs">
                      <UserIcon className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    by {contributorName}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {contribution.wordCount} words
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}