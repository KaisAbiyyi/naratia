'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const ageVerificationSchema = z.object({
  ageConfirmed: z.boolean().refine(val => val === true, {
    message: 'You must confirm that you are 13 or older to continue',
  }),
  contentTierPreference: z.enum(['general', 'teen', 'mature', 'adult']),
})

type AgeVerificationData = z.infer<typeof ageVerificationSchema>

const CONTENT_TIER_OPTIONS = [
  { 
    value: 'general', 
    label: 'General (All Ages)', 
    description: 'Family-friendly stories with no mature content',
    icon: '🌟'
  },
  { 
    value: 'teen', 
    label: 'Teen (13+)', 
    description: 'Stories with mild language and themes',
    icon: '📚'
  },
  { 
    value: 'mature', 
    label: 'Mature (17+)', 
    description: 'Stories with strong language and adult themes',
    icon: '🎭'
  },
  { 
    value: 'adult', 
    label: 'Adult (18+)', 
    description: 'Stories with explicit content and mature themes',
    icon: '🔞'
  },
] as const

interface AgeVerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AgeVerificationModal({ isOpen, onClose }: AgeVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { updateProfile, profile } = useAuth()

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AgeVerificationData>({
    resolver: zodResolver(ageVerificationSchema),
    defaultValues: {
      ageConfirmed: false,
      contentTierPreference: profile?.content_tier_preference || 'general',
    },
  })

  const ageConfirmed = watch('ageConfirmed')
  const contentTierPreference = watch('contentTierPreference')

  const onSubmit = async (data: AgeVerificationData) => {
    setIsLoading(true)
    setError(null)

    const { error: updateError } = await updateProfile({
      age_verified: data.ageConfirmed,
      content_tier_preference: data.contentTierPreference,
    })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    onClose()
  }

  const selectedTier = CONTENT_TIER_OPTIONS.find(tier => tier.value === contentTierPreference)

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Age Verification Required
          </DialogTitle>
          <DialogDescription>
            To ensure appropriate content filtering, we need to verify your age and 
            set your content preferences.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ageConfirmed"
                checked={ageConfirmed}
                onCheckedChange={(checked: boolean) => setValue('ageConfirmed', checked)}
                disabled={isLoading}
              />
              <Label
                htmlFor="ageConfirmed"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm that I am 13 years of age or older
              </Label>
            </div>
            {errors.ageConfirmed && (
              <p className="text-sm text-destructive">{errors.ageConfirmed.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Content Preference</Label>
            <Select
              value={contentTierPreference}
              onValueChange={(value: typeof contentTierPreference) =>
                setValue('contentTierPreference', value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your content preference" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TIER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <span>{option.icon}</span>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedTier && (
              <div className="p-3 bg-secondary/50 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  <span>{selectedTier.icon}</span>
                  <span className="font-medium text-sm">{selectedTier.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedTier.description}
                </p>
              </div>
            )}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Privacy & Safety</p>
                <p>
                  You can change your content preferences anytime in your profile settings. 
                  Stories are filtered based on your selected tier to ensure appropriate content.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting || !ageConfirmed}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating preferences...
                </>
              ) : (
                'Confirm & Continue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}