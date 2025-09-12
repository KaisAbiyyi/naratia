'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { BirthDateModal } from '@/components/auth/BirthDateModal'
import { UserProfile } from '@/types/auth.types'

interface ProfileBirthDateHandlerProps {
  profile: UserProfile
}

export function ProfileBirthDateHandler({ profile }: ProfileBirthDateHandlerProps) {
  const [showBirthDateModal, setShowBirthDateModal] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Check if current user is viewing their own profile and has no birth_date
    const isOwnProfile = user?.id === profile.id
    const hasBirthDate = profile.birth_date !== null
    
    console.log('ProfileBirthDateHandler check:', {
      isOwnProfile,
      hasBirthDate,
      userId: user?.id,
      profileId: profile.id,
      birthDate: profile.birth_date
    })

    if (isOwnProfile && !hasBirthDate) {
      console.log('Showing birth date modal for own profile without birth_date')
      setShowBirthDateModal(true)
    }
  }, [user?.id, profile.id, profile.birth_date])

  const handleModalClose = () => {
    setShowBirthDateModal(false)
    // Refresh the page to show updated profile
    window.location.reload()
  }

  return (
    <BirthDateModal 
      isOpen={showBirthDateModal} 
      onClose={handleModalClose}
    />
  )
}