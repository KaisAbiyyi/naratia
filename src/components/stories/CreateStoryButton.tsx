'use client'

import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CreateStoryButton() {
  return (
    <Button asChild className="gap-2">
      <Link href="/stories/create">
        <PlusIcon className="w-4 h-4" />
        Create Story
      </Link>
    </Button>
  )
}