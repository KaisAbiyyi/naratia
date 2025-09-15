import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database/connection'
import { stories, storyGenres, genres, users } from '@/lib/database/schema'
import { eq, and, ilike, desc, asc, inArray } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

// GET /api/stories - List stories with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const genre = searchParams.get('genre')
    const status = searchParams.get('status')
    const contentTier = searchParams.get('contentTier')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // For now, simplified query - will be enhanced later
    const result = await db
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
      .orderBy(desc(stories.createdAt))
      .limit(limit)
      .offset(offset)

    const total = result.length
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })

  } catch (error) {
    console.error('Failed to fetch stories:', error)
    
    // Return empty array when database is not available
    // This allows UI to show empty state instead of infinite loading
    return NextResponse.json({
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      },
      success: false,
      message: 'Database temporarily unavailable - showing empty state'
    })
  }
}

// POST /api/stories - Create new story
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, genreIds, contentTier, openingParagraph } = body

    // Validate required fields
    if (!title || !openingParagraph || !genreIds || genreIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, openingParagraph, genreIds' },
        { status: 400 }
      )
    }

    // Create story in transaction
    const result = await db.transaction(async (tx) => {
      // Insert story
      const [newStory] = await tx
        .insert(stories)
        .values({
          title,
          description,
          creatorId: user.id,
          contentTier: contentTier || 'general',
        })
        .returning()

      // Insert genre associations
      if (genreIds.length > 0) {
        await tx
          .insert(storyGenres)
          .values(
            genreIds.map((genreId: string, index: number) => ({
              storyId: newStory.id,
              genreId,
              displayOrder: index + 1
            }))
          )
      }

      // Insert opening paragraph as first contribution
      await tx
        .insert(stories) // This should be storyContributions, but table doesn't exist yet
        // Will be implemented when contributions system is ready

      return newStory
    })

    return NextResponse.json({
      data: result,
      success: true,
      message: 'Story created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Failed to create story:', error)
    return NextResponse.json(
      { error: 'Failed to create story' },
      { status: 500 }
    )
  }
}