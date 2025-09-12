'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LoadingSpinner } from '@/components/ui/loading-states'
import { User, LogOut, Settings } from 'lucide-react'
import { useEffect } from 'react'

export function Navbar() {
  const { user, profile, loading, signOut } = useAuth()

  // Debug logging
  useEffect(() => {
    console.log('Navbar state:', {
      loading,
      hasUser: !!user,
      hasProfile: !!profile,
      userId: user?.id,
      username: profile?.username
    })
  }, [loading, user, profile])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            Naratia
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {loading ? (
              // Loading state
              <div className="flex items-center gap-3">
                <LoadingSpinner size="sm" className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : user ? (
              // User is authenticated
              <div className="flex items-center gap-3">
                {/* Debug info - remove in production */}
                <span className="text-xs text-muted-foreground">
                  {profile ? `@${profile.username}` : 'No Profile'}
                </span>
                
                {profile ? (
                  // Full user menu with profile
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback>
                            {getInitials(profile.display_name || profile.username || 'U')}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col gap-1 leading-none">
                          <p className="font-medium">
                            {profile.display_name || profile.username}
                          </p>
                          <p className="w-[200px] truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${profile.username}`} className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // User exists but no profile - minimal menu
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Button variant="ghost" onClick={handleSignOut} size="sm">
                      Sign out
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              // No user - show Get Started button
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}