import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Trophy, Vote, Pen, Flame } from 'lucide-react'
import { getUserProfile } from '@/services/user/user.service'
import { UserProfile } from '@/types/auth.types'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const awaitedParams = await params
  try {
    const profile = await getUserProfile(awaitedParams.username)
    const displayName = profile.display_name || profile.username || 'User'
    const description = profile.bio 
      ? `${displayName} - ${profile.bio.slice(0, 160)}...`
      : `${displayName} is a storyteller on Naratia with Level ${profile.current_level} and ${profile.total_xp} XP. View their stories, contributions, and achievements.`

    return {
      title: `${displayName} (@${profile.username}) | Naratia Profile`,
      description,
      keywords: [
        'naratia',
        'storytelling',
        'collaborative writing',
        'user profile',
        profile.username || '',
        displayName,
        'writer',
        'community member'
      ],
      authors: [{ name: displayName, url: `/profile/${profile.username || ''}` }],
      openGraph: {
        title: `${displayName} (@${profile.username}) | Naratia Profile`,
        description,
        type: 'profile',
        url: `/profile/${profile.username || ''}`,
        images: profile.avatar_url ? [{
          url: profile.avatar_url,
          width: 400,
          height: 400,
          alt: `${displayName}'s profile picture`
        }] : [],
        siteName: 'Naratia',
        locale: 'en_US'
      },
      twitter: {
        card: 'summary',
        title: `${displayName} (@${profile.username}) | Naratia Profile`,
        description,
        images: profile.avatar_url ? [profile.avatar_url] : []
      },
      alternates: {
        canonical: `/profile/${profile.username || ''}`
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      }
    }
  } catch (error) {
    return {
      title: 'Profile Not Found | Naratia',
      description: 'This user profile could not be found on Naratia.',
      robots: {
        index: false,
        follow: false
      }
    }
  }
}

export default async function ProfileOverviewPage({ params }: ProfilePageProps) {
  const awaitedParams = await params
  let profile: UserProfile
  
  try {
    profile = await getUserProfile(awaitedParams.username)
  } catch {
    notFound()
  }

  return (
    <>

        {/* Profile Hero Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Profile Hero (Includes Best Records)</h2>
              <p className="text-muted-foreground mb-6">
                This section will showcase the user's best achievements, streaks, and highlights.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">{profile.reading_streak}</div>
                  <div className="text-sm">Best Reading Streak</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{profile.writing_streak}</div>
                  <div className="text-sm">Best Writing Streak</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{profile.voting_streak}</div>
                  <div className="text-sm">Best Voting Streak</div>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{profile.perfect_days_count || 0}</div>
                  <div className="text-sm">Perfect Days</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Writing Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Writing Activity</CardTitle>
              <Pen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stories Created</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-green-500" />
                    <span className="font-semibold">{0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contributions</span>
                  <div className="flex items-center gap-1">
                    <Pen className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold">{0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Writing Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="font-semibold">{profile.writing_streak} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reading Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Reading Activity</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-red-500" />
                    <span className="font-semibold">{profile.reading_streak} days</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Best Streak</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span className="font-semibold">{profile.reading_streak} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Community Activity</CardTitle>
              <Vote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votes Cast</span>
                  <div className="flex items-center gap-1">
                    <Vote className="h-3 w-3 text-purple-500" />
                    <span className="font-semibold">{0}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Voting Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-purple-500" />
                    <span className="font-semibold">{profile.voting_streak} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
          </CardContent>
        </Card>

        {/* 5 Last Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>5 Last Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              This section will display the user's 5 most recent story contributions.
              Implementation pending story contribution system.
            </p>
          </CardContent>
        </Card>
    </>
  )
}