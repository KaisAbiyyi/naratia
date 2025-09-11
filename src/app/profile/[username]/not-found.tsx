import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserX, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Profile Not Found | Naratia',
  description: 'The requested user profile could not be found on Naratia. The username might be incorrect or the user might not exist.',
  robots: {
    index: false,
    follow: true
  }
}

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <UserX className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Profile Not Found</CardTitle>
          <CardDescription>
            Sorry, we couldn't find a user with that username. 
            The user might not exist or the username might be incorrect.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Double-check the username for any typos.
            </p>
            <p className="text-sm text-muted-foreground">
              The user might have changed their username.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/dashboard">
                Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}