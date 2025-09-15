'use client'

import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface StoryContributionsProps {
  storyId: string
}

export function StoryContributions({ storyId }: StoryContributionsProps) {
  // This will be implemented in Branch 4: contributions-voting
  // For now, showing placeholder
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Current Contributions</h2>
        <Button className="gap-2">
          <PlusIcon className="w-4 h-4" />
          Add Contribution
        </Button>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground mb-4">
          The contribution and voting system will be available in the next update.
        </p>
        <p className="text-sm text-muted-foreground">
          This is part of Branch 4: Contributions & Voting features
        </p>
      </div>
    </div>
  )
}