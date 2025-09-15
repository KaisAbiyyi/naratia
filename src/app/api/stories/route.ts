import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/stories - List stories with filtering and pagination  
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    const supabase = await createClient()

    // Get stories (simplified for now)
    const { data: stories, error } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        description,
        creator_id,
        status,
        content_tier,
        created_at,
        updated_at
      `)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      throw error
    }

    // Transform data for compatibility
    const transformedStories = (stories || []).map(story => ({
      id: story.id,
      title: story.title,
      description: story.description,
      creatorId: story.creator_id,
      status: story.status,
      contentTier: story.content_tier,
      createdAt: story.created_at,
      updatedAt: story.updated_at,
      creator: null // TODO: Add creator info when needed
    }))

    return NextResponse.json({
      data: transformedStories,
      pagination: {
        page,
        limit,
        total: transformedStories.length,
        totalPages: Math.ceil(transformedStories.length / limit)
      },
      success: true
    })

  } catch (error) {
    console.error('Failed to fetch stories:', error)
    
    return NextResponse.json({
      data: [],
      pagination: {
        page: 1,
        limit: 10,
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

    // Create story
    const { data: newStory, error: storyError } = await supabase
      .from('stories')
      .insert({
        title,
        description,
        creator_id: user.id,
        content_tier: contentTier || 'general',
        status: 'active'
      })
      .select()
      .single()

    if (storyError) {
      throw storyError
    }

    // TODO: Insert genre associations when story_genres table is ready
    // TODO: Insert opening paragraph when story_contributions table is ready

    return NextResponse.json({
      data: newStory,
      success: true,
      message: 'Story created successfully'
    })

  } catch (error) {
    console.error('Failed to create story:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create story',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}