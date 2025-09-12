import { notFound } from 'next/navigation'
import { getUserProfile } from '@/services/user/user.service'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ProfileBirthDateHandler } from '@/components/profile/ProfileBirthDateHandler'

interface ProfileLayoutProps {
  children: React.ReactNode
  params: Promise<{
    username: string
  }>
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
  const awaitedParams = await params
  
  let profile
  try {
    profile = await getUserProfile(awaitedParams.username)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} />
      <ProfileTabs username={awaitedParams.username} />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
      <ProfileBirthDateHandler profile={profile} />
    </div>
  )
}