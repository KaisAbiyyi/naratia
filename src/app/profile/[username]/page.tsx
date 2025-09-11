import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Calendar, BookOpen, Trophy, Vote, Pen, Star, Flame, Clock } from 'lucide-react'
import { getUserProfile } from '@/services/user/user.service'
import { UserProfile } from '@/types/auth.types'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  try {
    const profile = await getUserProfile(params.username)
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
        ...profile.preferred_genres.map(genre => genre.toLowerCase())
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

export default async function ProfilePage({ params }: ProfilePageProps) {
  let profile: UserProfile
  
  try {
    profile = await getUserProfile(params.username)
  } catch {
    notFound()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContentTierBadge = (tier: string) => {
    const configs = {
      general: { label: 'General', variant: 'default' as const },
      teen: { label: 'Teen', variant: 'secondary' as const },
      mature: { label: 'Mature', variant: 'outline' as const },
      adult: { label: 'Adult', variant: 'destructive' as const },
    }
    const config = configs[tier as keyof typeof configs] || configs.general
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile.display_name || profile.username || 'U')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold">
                    {profile.display_name || profile.username}
                  </h1>
                  {profile.display_name && profile.username && (
                    <p className="text-muted-foreground">@{profile.username}</p>
                  )}
                </div>
              </div>

              {/* User Stats */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile.current_level}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">{profile.total_xp}</div>
                    <div className="text-sm text-muted-foreground">Total XP</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{profile.stories_created}</div>
                    <div className="text-sm text-muted-foreground">Stories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{profile.contributions_made}</div>
                    <div className="text-sm text-muted-foreground">Contributions</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(profile.account_created_at)}</span>
                  </div>
                  {profile.last_activity_date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Last active {formatDate(profile.last_activity_date)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span>Content Preference:</span>
                    {getContentTierBadge(profile.content_tier_preference)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                    <span className="font-semibold">{profile.stories_created}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contributions</span>
                  <div className="flex items-center gap-1">
                    <Pen className="h-3 w-3 text-blue-500" />
                    <span className="font-semibold">{profile.contributions_made}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Writing Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="font-semibold">{profile.writing_streak_current} days</span>
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
                    <span className="font-semibold">{profile.reading_streak_current} days</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Best Streak</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span className="font-semibold">{profile.reading_streak_best} days</span>
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
                    <span className="font-semibold">{profile.votes_cast}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Voting Streak</span>
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-purple-500" />
                    <span className="font-semibold">{profile.voting_streak_current} days</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements & Streaks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Best Streaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                      <BookOpen className="h-4 w-4 text-red-600" />
                    </div>
                    <span>Best Reading Streak</span>
                  </div>
                  <span className="font-bold text-red-600">{profile.reading_streak_best} days</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Pen className="h-4 w-4 text-blue-600" />
                    </div>
                    <span>Best Writing Streak</span>
                  </div>
                  <span className="font-bold text-blue-600">{profile.writing_streak_best} days</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Vote className="h-4 w-4 text-purple-600" />
                    </div>
                    <span>Best Voting Streak</span>
                  </div>
                  <span className="font-bold text-purple-600">{profile.voting_streak_best} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Genres */}
          {profile.preferred_genres && profile.preferred_genres.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Favorite Genres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.preferred_genres.map((genre, index) => (
                    <Badge key={index} variant="outline" className="capitalize">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}