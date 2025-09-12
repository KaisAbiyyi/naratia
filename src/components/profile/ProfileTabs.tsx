'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface ProfileTabsProps {
  username: string
}

export function ProfileTabs({ username }: ProfileTabsProps) {
  const pathname = usePathname()
  
  const tabs = [
    { label: 'Overview', href: `/profile/${username}` },
    { label: 'Stories', href: `/profile/${username}/stories` },
    { label: 'Contributions', href: `/profile/${username}/contributions` },
    { label: 'Settings', href: `/profile/${username}/settings` },
  ]

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4">
        <nav className="flex gap-0">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}