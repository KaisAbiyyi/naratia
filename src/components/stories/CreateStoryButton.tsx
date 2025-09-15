'use client'

import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { useAuth } from '@/hooks/auth/use-auth'
import { Button } from '@/components/ui/button'

export function CreateStoryButton() {
  const { user } = useAuth()

  const href = user ? '/stories/create' : '/login?redirectTo=/stories/create'

  return (
    <Button asChild className="gap-2">
      <Link href={href}>
        <PlusIcon className="w-4 h-4" />
        Create Story
      </Link>
    </Button>
  )
}