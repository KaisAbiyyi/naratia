import { Metadata } from 'next'
import { Suspense } from 'react'
import { OAuthHandler } from '@/components/auth/OAuthHandler'
import { StoriesListContainer } from '@/components/stories/StoriesListContainer'
import { CreateStoryButton } from '@/components/stories/CreateStoryButton'

export const metadata: Metadata = {
  title: 'Naratia - Collaborative Storytelling Feed',
  description: 'Discover amazing collaborative stories on Naratia. Vote on story directions, contribute paragraphs, and join thousands of writers creating interactive fiction together.',
  keywords: [
    'collaborative storytelling',
    'interactive fiction',
    'creative writing',
    'story writing',
    'community writing',
    'naratia',
    'collaborative fiction',
    'voting stories',
    'write together',
    'storytelling platform'
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
    title: 'Naratia - Collaborative Storytelling Platform',
    description: 'Join thousands of storytellers on Naratia, the ultimate collaborative writing platform. Create, vote, and contribute to amazing stories with writers from around the world.',
    url: 'https://naratia.com',
    siteName: 'Naratia',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Naratia - Collaborative Storytelling Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naratia - Collaborative Storytelling Platform',
    description: 'Join thousands of storytellers on Naratia, the ultimate collaborative writing platform. Create, vote, and contribute to amazing stories.',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://naratia.com',
  },
  category: 'Entertainment',
}

interface HomePageProps {
  searchParams: Promise<{
    tab?: string
  }>
}

export default async function Home({ searchParams }: HomePageProps) {
  const { tab } = await searchParams
  const activeTab = tab || 'for-you'

  return (
    <>
      <OAuthHandler />
      <div className="min-h-screen bg-background">
        {/* Feed Header with Tabs */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-6">
                <h1 className="text-2xl font-bold">Stories Feed</h1>
                <nav className="flex gap-1">
                  {[
                    { key: 'for-you', label: 'For You' },
                    { key: 'trending', label: 'Trending' },
                    { key: 'new', label: 'New' },
                    { key: 'following', label: 'Following' }
                  ].map((tabItem) => (
                    <a
                      key={tabItem.key}
                      href={`/?tab=${tabItem.key}`}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tabItem.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      {tabItem.label}
                    </a>
                  ))}
                </nav>
              </div>
              <CreateStoryButton />
            </div>
          </div>
        </div>

        {/* Stories Feed Content */}
        <main className="container mx-auto px-4 py-6">
          <Suspense fallback={
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                      <div className="h-3 bg-muted rounded w-1/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }>
            <StoriesListContainer 
              tab={activeTab}
              showFilters={false}
              feedStyle={true}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
}
