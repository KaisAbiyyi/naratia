import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserProfile } from '@/services/user/user.service'
import { BookOpen, Users, Calendar } from 'lucide-react'

interface ProfileStoriesPageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfileStoriesPageProps): Promise<Metadata> {
  const awaitedParams = await params
  try {
    const profile = await getUserProfile(awaitedParams.username)
    const displayName = profile.display_name || profile.username || 'User'

    return {
      title: `${displayName}'s Stories (@${profile.username}) | Naratia`,
      description: `Browse all stories created by ${displayName} on Naratia. Discover their collaborative storytelling contributions and creative works.`,
      keywords: [
        'naratia',
        'stories',
        'collaborative writing',
        profile.username || '',
        displayName,
        'authored stories',
        'creative writing'
      ],
      openGraph: {
        title: `${displayName}'s Stories (@${profile.username}) | Naratia`,
        description: `Browse all stories created by ${displayName} on Naratia.`,
        type: 'profile',
        url: `/profile/${profile.username}/stories`,
        siteName: 'Naratia',
      },
      robots: {
        index: true,
        follow: true,
      }
    }
  } catch (error) {
    return {
      title: 'Profile Stories Not Found | Naratia',
      robots: { index: false, follow: false }
    }
  }
}

export default async function ProfileStoriesPage({ params }: ProfileStoriesPageProps) {
  const awaitedParams = await params
  
  let profile
  try {
    profile = await getUserProfile(awaitedParams.username)
  } catch {
    notFound()
  }

  // TODO: Fetch actual stories created by this user
  // const stories = await getStoriesByUser(profile.id)

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Stories Created
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              This user hasn't created any stories yet. Stories will appear here once the story creation system is implemented.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for future story cards */}
      <div className="space-y-4">
        {/* Example of how stories will be displayed */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="opacity-50">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="h-20 w-20 bg-secondary rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Example Story Title {i}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    This is how a story card will look when the story system is implemented...
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>5 contributors</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}