import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { db } from '@/lib/database/connection'
import { stories, storyGenres, genres, users } from '@/lib/database/schema'
import { eq } from 'drizzle-orm'
import { StoryHeader } from '@/components/stories/StoryHeader'
import { StoryTimeline } from '@/components/stories/StoryTimeline'
import { StoryContributions } from '@/components/stories/StoryContributions'
import { StoryActions } from '@/components/stories/StoryActions'

interface StoryPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for each story
export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params

  try {
    // Fetch story data for metadata
    const [story] = await db
      .select({
        id: stories.id,
        title: stories.title,
        description: stories.description,
        contentTier: stories.contentTier,
        status: stories.status,
        createdAt: stories.createdAt,
        creator: {
          username: users.username,
          displayName: users.displayName
        }
      })
      .from(stories)
      .leftJoin(users, eq(stories.creatorId, users.id))
      .where(eq(stories.id, id))

    if (!story) {
      return {
        title: 'Story Not Found - Naratia',
        description: 'The requested story could not be found.',
      }
    }

    // Get genres for keywords
    const storyGenresData = await db
      .select({
        name: genres.name
      })
      .from(storyGenres)
      .leftJoin(genres, eq(storyGenres.genreId, genres.id))
      .where(eq(storyGenres.storyId, id))

    const genreNames: string[] = storyGenresData
      .map(g => g.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0)
    const creatorName = story.creator?.displayName || story.creator?.username || 'Anonymous'
    
    const title = `${story.title} - Naratia | Collaborative Story`
    const description = story.description 
      ? `${story.description.slice(0, 150)}${story.description.length > 150 ? '...' : ''} | A collaborative story by ${creatorName} on Naratia.`
      : `Join "${story.title}", a collaborative story by ${creatorName}. Vote on story directions and contribute to this interactive fiction on Naratia.`

    return {
      title,
      description,
      keywords: [
        story.title,
        'collaborative story',
        'interactive fiction',
        'naratia story',
        `${creatorName} story`,
        'vote on story',
        'contribute to story',
        story.contentTier || 'general',
        story.status || 'active',
        ...(genreNames || [])
      ],
      authors: [
        { name: 'Naratia Team' },
        { name: creatorName }
      ],
      creator: creatorName,
      publisher: 'Naratia',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
      metadataBase: new URL('https://naratia.com'),
      openGraph: {
        title,
        description,
        url: `https://naratia.com/stories/${id}`,
        siteName: 'Naratia',
        locale: 'en_US',
        type: 'article',
        publishedTime: story.createdAt?.toISOString(),
        authors: [creatorName],
        section: 'Interactive Fiction',
        tags: [story.contentTier || 'general', 'collaborative story', ...(genreNames || [])],
        images: [
          {
            url: `/og-story-${id}.jpg`,
            width: 1200,
            height: 630,
            alt: `${story.title} - Collaborative Story on Naratia`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: description.slice(0, 200),
        images: [`/og-story-${id}.jpg`],
        creator: '@naratia'
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      alternates: {
        canonical: `https://naratia.com/stories/${id}`,
      },
      category: 'Entertainment',
    }

  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Story - Naratia',
      description: 'Read and contribute to collaborative stories on Naratia.',
    }
  }
}

// Server component to fetch and display story
export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params

  try {
    // Fetch complete story data on server
    const [story] = await db
      .select({
        id: stories.id,
        title: stories.title,
        description: stories.description,
        creatorId: stories.creatorId,
        status: stories.status,
        contentTier: stories.contentTier,
        votingDurationHours: stories.votingDurationHours,
        minVotesRequired: stories.minVotesRequired,
        maxPendingContributions: stories.maxPendingContributions,
        isPrivate: stories.isPrivate,
        isFeatured: stories.isFeatured,
        createdAt: stories.createdAt,
        updatedAt: stories.updatedAt,
        creator: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl
        }
      })
      .from(stories)
      .leftJoin(users, eq(stories.creatorId, users.id))
      .where(eq(stories.id, id))

    if (!story) {
      notFound()
    }

    // Fetch story genres
    const storyGenresData = await db
      .select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        colorHex: genres.colorHex,
        iconName: genres.iconName,
        displayOrder: storyGenres.displayOrder
      })
      .from(storyGenres)
      .leftJoin(genres, eq(storyGenres.genreId, genres.id))
      .where(eq(storyGenres.storyId, id))
      .orderBy(storyGenres.displayOrder)

    const storyWithGenres = {
      ...story,
      description: story.description || undefined,
      status: story.status || 'active',
      contentTier: story.contentTier || 'general',
      createdAt: story.createdAt || new Date().toISOString(),
      creatorId: story.creatorId || '',
      creator: story.creator ? {
        username: story.creator.username || undefined,
        displayName: story.creator.displayName || undefined,
        avatarUrl: story.creator.avatarUrl || undefined
      } : undefined,
      genres: storyGenresData.map(g => ({
        name: g.name || '',
        colorHex: g.colorHex || undefined,
        iconName: g.iconName || undefined
      }))
    }

    return (
      <div className="min-h-screen bg-background">
        {/* Story Header */}
        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <StoryHeader story={storyWithGenres} />
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Story Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Story Timeline - shows selected contributions */}
              <Suspense fallback={
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              }>
                <StoryTimeline storyId={id} />
              </Suspense>

              {/* Pending Contributions for Voting */}
              {story.status === 'active' && (
                <Suspense fallback={
                  <div className="h-48 bg-muted rounded-lg animate-pulse" />
                }>
                  <StoryContributions storyId={id} />
                </Suspense>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Story Actions */}
              <Suspense fallback={
                <div className="h-32 bg-muted rounded-lg animate-pulse" />
              }>
                <StoryActions story={storyWithGenres} />
              </Suspense>

              {/* Story Stats */}
              <div className="bg-card rounded-lg p-6">
                <h3 className="font-semibold mb-4">Story Statistics</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="capitalize">{story.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Content Tier:</span>
                    <span className="capitalize">{story.contentTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created:</span>
                    <span>{new Date(story.createdAt!).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.error('Error loading story:', error)
    notFound()
  }
}