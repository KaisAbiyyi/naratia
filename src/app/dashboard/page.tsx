'use client'

import { useAuthGuard } from '@/hooks/useAuthGuard'
import { AgeVerificationModal } from '@/components/auth/AgeVerificationModal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User, BookOpen, Vote, Trophy, Settings } from 'lucide-react'

export default function DashboardPage() {
  const { 
    loading, 
    showAgeVerification, 
    closeAgeVerification 
  } = useAuthGuard({
    requireAuth: true,
    requireVerifiedAge: false, // We'll handle this with modal
  })

  const { user, profile, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const getContentTierBadge = (tier: string) => {
    const variants = {
      general: 'default',
      teen: 'secondary',
      mature: 'outline',
      adult: 'destructive',
    } as const

    const labels = {
      general: 'General',
      teen: 'Teen',
      mature: 'Mature',
      adult: 'Adult',
    }

    return (
      <Badge variant={variants[tier as keyof typeof variants] || 'default'}>
        {labels[tier as keyof typeof labels] || tier}
      </Badge>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {profile?.display_name || profile?.username || user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Profile Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {profile?.display_name || profile?.username || 'User'}
                      {profile?.age_verified ? (
                        <Badge variant="secondary">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Unverified</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Level {profile?.current_level || 1} • {profile?.total_xp || 0} XP
                    </CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Content Preference</p>
                  {getContentTierBadge(profile?.content_tier_preference || 'general')}
                </div>
              </div>
            </CardHeader>
            {profile?.bio && (
              <CardContent>
                <p className="text-muted-foreground">{profile.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stories Created</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.stories_created || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contributions</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.contributions_made || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
                <Vote className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.votes_cast || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.current_level || 1}</div>
              </CardContent>
            </Card>
          </div>

          {/* Streaks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reading Streak</CardTitle>
                <CardDescription>Keep reading daily to maintain your streak</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="font-bold">{profile?.reading_streak_current || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best</span>
                    <span className="font-bold">{profile?.reading_streak_best || 0} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Writing Streak</CardTitle>
                <CardDescription>Contribute to stories daily</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="font-bold">{profile?.writing_streak_current || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best</span>
                    <span className="font-bold">{profile?.writing_streak_best || 0} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voting Streak</CardTitle>
                <CardDescription>Vote on contributions daily</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current</span>
                    <span className="font-bold">{profile?.voting_streak_current || 0} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Best</span>
                    <span className="font-bold">{profile?.voting_streak_best || 0} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with storytelling</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-auto flex-col space-y-2 p-4" variant="outline">
                <BookOpen className="h-6 w-6" />
                <span>Browse Stories</span>
              </Button>
              <Button className="h-auto flex-col space-y-2 p-4" variant="outline">
                <User className="h-6 w-6" />
                <span>Create Story</span>
              </Button>
              <Button className="h-auto flex-col space-y-2 p-4" variant="outline">
                <Vote className="h-6 w-6" />
                <span>Vote on Stories</span>
              </Button>
              <Button className="h-auto flex-col space-y-2 p-4" variant="outline">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Age Verification Modal */}
      <AgeVerificationModal
        isOpen={showAgeVerification}
        onClose={closeAgeVerification}
      />
    </>
  )
}