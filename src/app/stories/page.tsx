import { Metadata } from 'next'
import { Suspense } from 'react'
import { StoriesListContainer } from '@/components/stories/StoriesListContainer'
import { StoriesFilters } from '@/components/stories/StoriesFilters'
import { CreateStoryButton } from '@/components/stories/CreateStoryButton'

export const metadata: Metadata = {
  title: 'Browse Stories - Naratia | Collaborative Storytelling Platform',
  description: 'Discover and explore collaborative stories on Naratia. Join ongoing adventures, vote on story directions, or start your own story with our global community of writers. Experience interactive fiction like never before.',
  keywords: [
    'browse stories',
    'collaborative stories',
    'interactive fiction',
    'story discovery',
    'naratia stories',
    'community writing',
    'vote stories',
    'ongoing stories',
    'story genres',
    'collaborative writing platform'
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
    title: 'Browse Stories - Naratia | Collaborative Storytelling Platform',
    description: 'Discover and explore collaborative stories on Naratia. Join ongoing adventures, vote on story directions, or start your own story with our global community of writers.',
    url: 'https://naratia.com/stories',
    siteName: 'Naratia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-stories.jpg',
        width: 1200,
        height: 630,
        alt: 'Browse Collaborative Stories on Naratia',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Stories - Naratia | Collaborative Storytelling Platform',
    description: 'Discover and explore collaborative stories. Join ongoing adventures, vote on story directions, or start your own story.',
    images: ['/og-stories.jpg'],
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
    canonical: 'https://naratia.com/stories',
  },
  category: 'Entertainment',
}

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Discover Stories
                </h1>
                <p className="text-muted-foreground mt-2">
                  Explore collaborative stories from our community of writers
                </p>
              </div>
              <CreateStoryButton />
            </div>
            
            {/* Filters */}
            <Suspense fallback={<div className="h-12 bg-muted rounded animate-pulse" />}>
              <StoriesFilters />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Stories List */}
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        }>
          <StoriesListContainer />
        </Suspense>
      </div>
    </div>
  )
}