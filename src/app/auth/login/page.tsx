import { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Naratia - Collaborative Storytelling Platform',
  description: 'Sign in to your Naratia account and continue your storytelling journey. Access your stories, contributions, voting history, and connect with the collaborative writing community.',
  keywords: [
    'naratia login',
    'sign in',
    'storytelling login',
    'collaborative writing login',
    'naratia account',
    'writer login'
  ],
  openGraph: {
    title: 'Sign In | Naratia',
    description: 'Sign in to your Naratia account and continue your storytelling journey.',
    type: 'website',
    url: '/auth/login',
    siteName: 'Naratia',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary',
    title: 'Sign In | Naratia',
    description: 'Sign in to your Naratia account and continue your storytelling journey.'
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true
    }
  },
  alternates: {
    canonical: '/auth/login'
  }
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}