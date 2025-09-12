import { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { AuthGuard } from "@/components/auth/AuthGuard"

export const metadata: Metadata = {
  title: 'Sign Up | Naratia - Collaborative Storytelling Platform',
  description: 'Create your Naratia account and start your storytelling journey. Join a community of writers, contribute to stories, vote on paths, and unleash your creativity.',
  keywords: [
    'naratia sign up',
    'naratia register',
    'create account',
    'storytelling community',
    'collaborative writing sign up',
    'join naratia',
    'writer registration'
  ],
  openGraph: {
    title: 'Sign Up | Naratia',
    description: 'Create your Naratia account and start your storytelling journey.',
    type: 'website',
    url: '/auth/register',
    siteName: 'Naratia',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up | Naratia',
    description: 'Create your Naratia account and start your storytelling journey.'
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
    canonical: '/auth/register'
  }
}

export default async function RegisterPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </AuthGuard>
  )
}