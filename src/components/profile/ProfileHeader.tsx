import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Clock } from 'lucide-react'
import { UserProfile } from '@/types/auth.types'

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getContentTierBadge = (tier: string) => {
    const configs = {
      general: { label: 'General', variant: 'default' as const },
      teen: { label: 'Teen', variant: 'secondary' as const },
      mature: { label: 'Mature', variant: 'outline' as const },
      adult: { label: 'Adult', variant: 'destructive' as const },
    }
    const config = configs[tier as keyof typeof configs] || configs.general
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="bg-gradient-to-br from-background to-secondary/20 border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-2xl">
                {getInitials(profile.display_name || profile.username || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">
                {profile.display_name || profile.username}
              </h1>
              {profile.display_name && profile.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}
            </div>
          </div>

          {/* User Stats */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{profile.current_level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profile.total_xp}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{0}</div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{0}</div>
                <div className="text-sm text-muted-foreground">Contributions</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(profile.created_at)}</span>
              </div>
              {profile.last_activity_date && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last active {formatDate(profile.last_activity_date)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <span>Content Preference:</span>
                {getContentTierBadge(profile.content_preference)}
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}