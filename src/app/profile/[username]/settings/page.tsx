import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getUserProfile } from '@/services/user/user.service'
import { Settings, Lock, Info } from 'lucide-react'

interface ProfileSettingsPageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: ProfileSettingsPageProps): Promise<Metadata> {
  const awaitedParams = await params
  try {
    const profile = await getUserProfile(awaitedParams.username)
    const displayName = profile.display_name || profile.username || 'User'

    return {
      title: `${displayName}'s Settings (@${profile.username}) | Naratia`,
      description: `Profile settings and preferences for ${displayName} on Naratia. Manage account settings, privacy preferences, and personalization options.`,
      keywords: [
        'naratia',
        'profile settings',
        'account preferences',
        profile.username || '',
        displayName,
        'privacy settings',
        'user preferences'
      ],
      openGraph: {
        title: `${displayName}'s Settings (@${profile.username}) | Naratia`,
        description: `Profile settings for ${displayName} on Naratia.`,
        type: 'profile',
        url: `/profile/${profile.username}/settings`,
        siteName: 'Naratia',
      },
      robots: {
        index: false, // Settings pages should not be indexed
        follow: false,
      }
    }
  } catch (error) {
    return {
      title: 'Profile Settings Not Found | Naratia',
      robots: { index: false, follow: false }
    }
  }
}

export default async function ProfileSettingsPage({ params }: ProfileSettingsPageProps) {
  const awaitedParams = await params
  
  let profile
  try {
    profile = await getUserProfile(awaitedParams.username)
  } catch {
    notFound()
  }

  return (
    <>
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Profile settings functionality is currently under development. This page will allow users to manage their account preferences, privacy settings, and personalization options.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Username</label>
                  <p className="text-lg">{profile.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                  <p className="text-lg">{profile.display_name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Content Preference</label>
                  <p className="text-lg capitalize">{profile.content_preference}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Privacy controls will be implemented here, including profile visibility, 
              story participation settings, and notification preferences.
            </p>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Notification settings will allow users to control email notifications, 
              push notifications for story updates, voting reminders, and achievement alerts.
            </p>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced options including data export, account deletion, 
              and integration settings will be available here.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}