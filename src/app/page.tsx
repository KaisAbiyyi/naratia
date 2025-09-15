import { Metadata } from 'next'
import Link from 'next/link'
import { OAuthHandler } from '@/components/auth/OAuthHandler'

export const metadata: Metadata = {
  title: 'Naratia - Collaborative Storytelling Platform',
  description: 'Join thousands of storytellers on Naratia, the ultimate collaborative writing platform. Create, vote, and contribute to amazing stories with writers from around the world. Experience the future of interactive storytelling.',
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

export default function Home() {
  return (
    <>
      <OAuthHandler />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-primary">Naratia</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of writers in creating collaborative stories. Vote on directions, contribute paragraphs, and experience interactive fiction like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stories"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Stories
              </Link>
              <Link
                href="/stories/create"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Stories Preview */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Discover Amazing Stories
              </h2>
              <p className="text-muted-foreground">
                Explore collaborative fiction created by our community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Placeholder story cards */}
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-2">The Lost Kingdom</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A fantasy adventure where readers guide the hero through mystical lands...
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Active • Fantasy</span>
                  <span>12 contributors</span>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-2">Space Station Alpha</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sci-fi thriller about survival in the depths of space...
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Active • Sci-Fi</span>
                  <span>8 contributors</span>
                </div>
              </div>
              
              <div className="bg-card rounded-lg border p-6">
                <h3 className="font-semibold mb-2">The Detective's Dilemma</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Mystery story where every clue is decided by the community...
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Active • Mystery</span>
                  <span>15 contributors</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/stories"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                View All Stories
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Read & Explore</h3>
                <p className="text-sm text-muted-foreground">
                  Discover ongoing stories and read the latest chapters written by the community.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Vote & Guide</h3>
                <p className="text-sm text-muted-foreground">
                  Vote on story directions and help choose which continuation fits best.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Write & Contribute</h3>
                <p className="text-sm text-muted-foreground">
                  Submit your own paragraphs and become part of the storytelling process.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
