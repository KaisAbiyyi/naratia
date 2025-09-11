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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Calendar, AlertTriangle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const birthDateSchema = z.object({
  birthDate: z
    .string()
    .min(1, 'Birth date is required')
    .refine((dateString) => {
      const birthDate = new Date(dateString)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 13
      }
      return age >= 13
    }, 'You must be at least 13 years old to use this platform'),
})

type BirthDateData = z.infer<typeof birthDateSchema>

interface BirthDateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function BirthDateModal({ isOpen, onClose }: BirthDateModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { updateProfile } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BirthDateData>({
    resolver: zodResolver(birthDateSchema),
  })

  const onSubmit = async (data: BirthDateData) => {
    setIsLoading(true)
    setError(null)

    const { error: updateError } = await updateProfile({
      birth_date: data.birthDate,
    })

    if (updateError) {
      setError(updateError.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[400px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Birth Date Required
          </DialogTitle>
          <DialogDescription>
            We need your birth date to ensure you meet the minimum age requirement 
            and to provide age-appropriate content recommendations.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="birthDate">Date of Birth</Label>
            <Input
              id="birthDate"
              type="date"
              {...register('birthDate')}
              disabled={isLoading}
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-medium mb-1">Privacy & Safety</p>
                <p>
                  Your birth date is used only for age verification and content filtering. 
                  You can set your content preferences in your profile settings.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving birth date...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}