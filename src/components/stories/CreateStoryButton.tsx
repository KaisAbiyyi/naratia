'use client'

import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/auth/use-auth'
import { Button } from '@/components/ui/button'

export function CreateStoryButton() {
  const router = useRouter()
  const { user } = useAuth()

  const handleCreateStory = () => {
    if (!user) {
      router.push('/login?redirectTo=/stories/create')
    } else {
      router.push('/stories/create')
    }
  }

  return (
    <Button 
      onClick={handleCreateStory}
      className="gap-2"
    >
      <PlusIcon className="w-4 h-4" />
      Create Story
    </Button>
  )
}