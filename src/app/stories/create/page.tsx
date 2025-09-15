import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/database/connection'
import { genres } from '@/lib/database/schema'
import { eq, asc } from 'drizzle-orm'
import { CreateStoryForm } from '@/components/stories/CreateStoryForm'

export const metadata: Metadata = {
  title: 'Create New Story - Naratia | Start Your Collaborative Adventure',
  description: 'Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph that will captivate our community of writers and readers.',
  keywords: [
    'create story',
    'start story',
    'new collaborative story',
    'write opening paragraph',
    'story creation',
    'naratia create',
    'begin story',
    'collaborative writing',
    'interactive fiction creator',
    'story genres',
    'content tiers'
  ],
  authors: [{ name: 'Naratia Team' }],
  creator: 'Naratia',
  publisher: 'Naratia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://naratia.com'),
  openGraph: {
    title: 'Create New Story - Naratia | Start Your Collaborative Adventure',
    description: 'Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph that will captivate our community of writers.',
    url: 'https://naratia.com/stories/create',
    siteName: 'Naratia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-create-story.jpg',
        width: 1200,
        height: 630,
        alt: 'Create New Collaborative Story on Naratia',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create New Story - Naratia | Start Your Collaborative Adventure',
    description: 'Start your own collaborative story on Naratia. Choose genres, set content preferences, and write the opening paragraph.',
    images: ['/og-create-story.jpg'],
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
    canonical: 'https://naratia.com/stories/create',
  },
  category: 'Entertainment',
}

// Server component to handle authentication and fetch genres
export default async function CreateStoryPage() {
  // Check authentication on server
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login?redirectTo=/stories/create')
  }

  try {
    // Fetch available genres on server
    const genresData = await db
      .select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        colorHex: genres.colorHex,
        iconName: genres.iconName,
        minContentTier: genres.minContentTier
      })
      .from(genres)
      .where(eq(genres.isActive, true))
      .orderBy(asc(genres.name))

  let availableGenres: Array<{
    id: string
    name: string
    description?: string
    colorHex?: string
    iconName?: string
    minContentTier: string
  }> = []

  try {
    // Fetch available genres on server with error handling
    console.log('Fetching genres from database...')
    const genresData = await db
      .select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        colorHex: genres.colorHex,
        iconName: genres.iconName,
        minContentTier: genres.minContentTier
      })
      .from(genres)
      .where(eq(genres.isActive, true))
      .orderBy(asc(genres.name))

    availableGenres = genresData.map(g => ({
      id: g.id,
      name: g.name,
      description: g.description || undefined,
      colorHex: g.colorHex || undefined,
      iconName: g.iconName || undefined,
      minContentTier: g.minContentTier || 'general'
    }))

    console.log('Successfully fetched genres:', availableGenres.length)

  } catch (error) {
    console.error('Error loading genres from database:', error)
    
    // Fallback: provide some default genres if database is not available
    availableGenres = [
      { id: 'temp-1', name: 'Fantasy', minContentTier: 'general' },
      { id: 'temp-2', name: 'Science Fiction', minContentTier: 'general' },
      { id: 'temp-3', name: 'Mystery', minContentTier: 'general' },
      { id: 'temp-4', name: 'Romance', minContentTier: 'teen' },
      { id: 'temp-5', name: 'Adventure', minContentTier: 'general' },
    ]
    console.log('Using fallback genres due to database error')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Story
            </h1>
            <p className="text-muted-foreground mt-2">
              Start a collaborative adventure that others can join and help shape
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <CreateStoryForm 
              genres={availableGenres}
              currentUser={user}
            />
          </div>

            {/* Guidelines */}
            <div className="mt-8 bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Story Creation Guidelines</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Your opening paragraph should be engaging and leave room for others to continue</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Choose appropriate genres and content tier for your story&apos;s theme</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Keep opening paragraphs between 50-500 words for best engagement</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Stories become community property once published - others can contribute freely</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>Be respectful and follow community guidelines for content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.error('Error loading create story page:', error)
    
    // Return error state but still as server component
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">
            Error Loading Page
          </h1>
          <p className="text-muted-foreground mb-4">
            We encountered an error while loading the story creation page.
          </p>
          <Link 
            href="/stories" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Stories Instead
          </Link>
        </div>
      </div>
    )
  }
}