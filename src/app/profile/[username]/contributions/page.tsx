import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getUserProfile } from '@/services/user/user.service'
import { Pen, Trophy, BookOpen, Calendar, ThumbsUp } from 'lucide-react'

interface ProfileContributionsPageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfileContributionsPageProps): Promise<Metadata> {
  const awaitedParams = await params
  try {
    const profile = await getUserProfile(awaitedParams.username)
    const displayName = profile.display_name || profile.username || 'User'

    return {
      title: `${displayName}'s Contributions (@${profile.username}) | Naratia`,
      description: `View all story contributions and paragraphs written by ${displayName} on Naratia. See their collaborative writing history and impact on community stories.`,
      keywords: [
        'naratia',
        'contributions',
        'collaborative writing',
        'paragraphs',
        profile.username || '',
        displayName,
        'story contributions',
        'writing history'
      ],
      openGraph: {
        title: `${displayName}'s Contributions (@${profile.username}) | Naratia`,
        description: `View all story contributions by ${displayName} on Naratia.`,
        type: 'profile',
        url: `/profile/${profile.username}/contributions`,
        siteName: 'Naratia',
      },
      robots: {
        index: true,
        follow: true,
      }
    }
  } catch (error) {
    return {
      title: 'Profile Contributions Not Found | Naratia',
      robots: { index: false, follow: false }
    }
  }
}

export default async function ProfileContributionsPage({ params }: ProfileContributionsPageProps) {
  const awaitedParams = await params
  
  let profile
  try {
    profile = await getUserProfile(awaitedParams.username)
  } catch {
    notFound()
  }

  // TODO: Fetch actual contributions by this user
  // const contributions = await getContributionsByUser(profile.id)

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5" />
            Story Contributions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Pen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Contributions Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This user hasn't contributed to any stories yet. Contributions will appear here once they start writing paragraphs for collaborative stories.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future contribution cards */}
      <div className="space-y-4">
        {/* Example of how contributions will be displayed */}
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="opacity-50">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Example Story Title {i}</span>
                </div>
                <div className="flex items-center gap-2">
                  {i % 3 === 0 ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <Trophy className="h-3 w-3 mr-1" />
                      Selected
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg mb-3">
                <p className="text-sm">
                  This is an example of how a story contribution will be displayed. 
                  Each paragraph contributed by the user will show here with context 
                  about which story it belongs to and whether it was selected by the community.
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 20)} votes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 7) + 1} days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}