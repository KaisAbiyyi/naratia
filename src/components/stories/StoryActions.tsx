'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth/use-auth'
import { BookmarkIcon, ShareIcon, FlagIcon, EditIcon } from 'lucide-react'

interface StoryActionsProps {
  story: {
    id: string
    creatorId: string
    status: string
    title: string
  }
}

export function StoryActions({ story }: StoryActionsProps) {
  const { user } = useAuth()
  const isCreator = user?.id === story.creatorId
  const canContribute = story.status === 'active'

  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h3 className="font-semibold">Story Actions</h3>
      
      <div className="space-y-3">
        {/* Contribute - if story is active */}
        {canContribute && (
          <Button className="w-full gap-2" disabled>
            <EditIcon className="w-4 h-4" />
            Contribute to Story
          </Button>
        )}

        {/* Bookmark */}
        <Button variant="outline" className="w-full gap-2" disabled>
          <BookmarkIcon className="w-4 h-4" />
          Bookmark Story
        </Button>

        {/* Share */}
        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: story.title,
                url: window.location.href
              })
            } else {
              navigator.clipboard.writeText(window.location.href)
            }
          }}
        >
          <ShareIcon className="w-4 h-4" />
          Share Story
        </Button>

        {/* Report (if not creator) */}
        {!isCreator && (
          <Button variant="outline" className="w-full gap-2 text-muted-foreground" disabled>
            <FlagIcon className="w-4 h-4" />
            Report Content
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground pt-2 border-t">
        Note: Some features are still being developed and will be available soon.
      </div>
    </div>
  )
}