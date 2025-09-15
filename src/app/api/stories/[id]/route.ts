import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database/connection'
import { stories, storyGenres, genres, users, storyContributions } from '@/lib/database/schema'
import { eq, and } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

// GET /api/stories/[id] - Get single story with details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Story ID is required' },
        { status: 400 }
      )
    }

    // Get story with creator info
    const [story] = await db
      .select({
        id: stories.id,
        title: stories.title,
        description: stories.description,
        creatorId: stories.creatorId,
        status: stories.status,
        contentTier: stories.contentTier,
        votingDurationHours: stories.votingDurationHours,
        minVotesRequired: stories.minVotesRequired,
        maxPendingContributions: stories.maxPendingContributions,
        isPrivate: stories.isPrivate,
        isFeatured: stories.isFeatured,
        createdAt: stories.createdAt,
        updatedAt: stories.updatedAt,
        creator: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl
        }
      })
      .from(stories)
      .leftJoin(users, eq(stories.creatorId, users.id))
      .where(eq(stories.id, id))

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Get story genres
    const storyGenresData = await db
      .select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        colorHex: genres.colorHex,
        iconName: genres.iconName,
        displayOrder: storyGenres.displayOrder
      })
      .from(storyGenres)
      .leftJoin(genres, eq(storyGenres.genreId, genres.id))
      .where(eq(storyGenres.storyId, id))
      .orderBy(storyGenres.displayOrder)

    // Get story contributions (timeline) - selected contributions only
    const contributions = await db
      .select({
        id: storyContributions.id,
        content: storyContributions.content,
        wordCount: storyContributions.wordCount,
        isEnding: storyContributions.isEnding,
        isOpening: storyContributions.isOpening,
        selectedAt: storyContributions.selectedAt,
        sequenceNumber: storyContributions.sequenceNumber,
        contributor: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl
        }
      })
      .from(storyContributions)
      .leftJoin(users, eq(storyContributions.contributorId, users.id))
      .where(
        and(
          eq(storyContributions.storyId, id),
          eq(storyContributions.isSelected, true)
        )
      )
      .orderBy(storyContributions.sequenceNumber)

    const storyWithDetails = {
      ...story,
      genres: storyGenresData,
      contributions: contributions,
      stats: {
        totalContributions: contributions.length,
        totalWords: contributions.reduce((sum, c) => sum + c.wordCount, 0),
        isCompleted: story.status === 'completed'
      }
    }

    return NextResponse.json({
      data: storyWithDetails,
      success: true
    })

  } catch (error) {
    console.error('Failed to fetch story:', error)
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    )
  }
}

// PUT /api/stories/[id] - Update story (creator only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Check if user is the creator
    const [existingStory] = await db
      .select({ creatorId: stories.creatorId })
      .from(stories)
      .where(eq(stories.id, id))

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (existingStory.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'Only the story creator can update this story' },
        { status: 403 }
      )
    }

    // Update story
    const [updatedStory] = await db
      .update(stories)
      .set({
        ...body,
        updatedAt: new Date()
      })
      .where(eq(stories.id, id))
      .returning()

    return NextResponse.json({
      data: updatedStory,
      success: true,
      message: 'Story updated successfully'
    })

  } catch (error) {
    console.error('Failed to update story:', error)
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    )
  }
}

// DELETE /api/stories/[id] - Delete story (creator only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Check if user is the creator
    const [existingStory] = await db
      .select({ creatorId: stories.creatorId })
      .from(stories)
      .where(eq(stories.id, id))

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    if (existingStory.creatorId !== user.id) {
      return NextResponse.json(
        { error: 'Only the story creator can delete this story' },
        { status: 403 }
      )
    }

    // Delete story (cascade will handle related records)
    await db
      .delete(stories)
      .where(eq(stories.id, id))

    return NextResponse.json({
      success: true,
      message: 'Story deleted successfully'
    })

  } catch (error) {
    console.error('Failed to delete story:', error)
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    )
  }
}