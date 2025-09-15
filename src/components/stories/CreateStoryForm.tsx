'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateStory } from '@/hooks/api/use-stories'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoaderIcon } from 'lucide-react'

const createStorySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  openingParagraph: z.string().min(50, 'Opening paragraph must be at least 50 characters').max(2000, 'Opening paragraph too long'),
  contentTier: z.enum(['general', 'teen', 'mature', 'adult']),
  genreIds: z.array(z.string()).min(1, 'Please select at least one genre').max(5, 'Maximum 5 genres allowed'),
})

type CreateStoryForm = z.infer<typeof createStorySchema>

interface CreateStoryFormProps {
  genres: Array<{
    id: string
    name: string
    description?: string
    colorHex?: string
    iconName?: string
    minContentTier: string
  }>
}

export function CreateStoryForm({ genres }: CreateStoryFormProps) {
  const router = useRouter()
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const createStoryMutation = useCreateStory()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<CreateStoryForm>({
    resolver: zodResolver(createStorySchema),
    defaultValues: {
      contentTier: 'general',
      genreIds: []
    },
    mode: 'onChange'
  })

  const watchContentTier = watch('contentTier')
  const watchOpeningParagraph = watch('openingParagraph', '')

  // Filter genres based on content tier
  const availableGenres = genres.filter(genre => {
    const tierOrder = { general: 0, teen: 1, mature: 2, adult: 3 }
    return tierOrder[genre.minContentTier as keyof typeof tierOrder] <= tierOrder[watchContentTier]
  })

  const handleGenreToggle = (genreId: string) => {
    const newSelectedGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId]
    
    setSelectedGenres(newSelectedGenres)
    setValue('genreIds', newSelectedGenres, { shouldValidate: true })
  }

  const onSubmit = async (data: CreateStoryForm) => {
    try {
      const result = await createStoryMutation.mutateAsync(data)
      
      if (result.success) {
        router.push(`/stories/${result.data.id}`)
      }
    } catch (error) {
      console.error('Failed to create story:', error)
    }
  }

  const wordCount = watchOpeningParagraph.split(' ').filter(word => word.length > 0).length

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Story Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter an engaging title for your story"
          className={errors.title ? 'border-destructive' : ''}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Brief description of your story's theme or setting"
          rows={3}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Content Tier */}
      <div className="space-y-2">
        <Label>Content Tier *</Label>
        <Select 
          value={watchContentTier} 
          onValueChange={(value) => setValue('contentTier', value as any, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General - All ages appropriate</SelectItem>
            <SelectItem value="teen">Teen - 13+ content</SelectItem>
            <SelectItem value="mature">Mature - 16+ content</SelectItem>
            <SelectItem value="adult">Adult - 18+ content</SelectItem>
          </SelectContent>
        </Select>
        {errors.contentTier && (
          <p className="text-sm text-destructive">{errors.contentTier.message}</p>
        )}
      </div>

      {/* Genres */}
      <div className="space-y-2">
        <Label>Genres * (Select 1-5)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {availableGenres.map((genre) => (
            <div key={genre.id} className="flex items-center space-x-2">
              <Checkbox
                id={genre.id}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => handleGenreToggle(genre.id)}
                disabled={!selectedGenres.includes(genre.id) && selectedGenres.length >= 5}
              />
              <Label 
                htmlFor={genre.id} 
                className="text-sm font-normal cursor-pointer"
                style={genre.colorHex ? { color: genre.colorHex } : {}}
              >
                {genre.name}
              </Label>
            </div>
          ))}
        </div>
        {errors.genreIds && (
          <p className="text-sm text-destructive">{errors.genreIds.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Selected: {selectedGenres.length}/5
        </p>
      </div>

      {/* Opening Paragraph */}
      <div className="space-y-2">
        <Label htmlFor="openingParagraph">Opening Paragraph *</Label>
        <Textarea
          id="openingParagraph"
          {...register('openingParagraph')}
          placeholder="Write the opening paragraph that will hook readers and invite them to continue your story..."
          rows={8}
          className={errors.openingParagraph ? 'border-destructive' : ''}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Word count: {wordCount}</span>
          <span>50-500 words recommended</span>
        </div>
        {errors.openingParagraph && (
          <p className="text-sm text-destructive">{errors.openingParagraph.message}</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={!isValid || createStoryMutation.isPending}
          className="gap-2"
        >
          {createStoryMutation.isPending && (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          )}
          Create Story
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={createStoryMutation.isPending}
        >
          Cancel
        </Button>
      </div>

      {/* Error Message */}
      {createStoryMutation.isError && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
          Failed to create story. Please try again.
        </div>
      )}
    </form>
  )
}