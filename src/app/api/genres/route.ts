import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/database/connection'
import { genres } from '@/lib/database/schema'
import { eq, asc } from 'drizzle-orm'

// GET /api/genres - List all active genres
export async function GET(request: NextRequest) {
  try {
    const genreList = await db
      .select({
        id: genres.id,
        name: genres.name,
        description: genres.description,
        colorHex: genres.colorHex,
        iconName: genres.iconName,
        minContentTier: genres.minContentTier
      })
      .from(genres)
      .where(eq(genres.isActive, true))
      .orderBy(asc(genres.name))

    return NextResponse.json({
      data: genreList,
      success: true
    })

  } catch (error) {
    console.error('Failed to fetch genres:', error)
    
    // Return empty array when database is not available
    // This allows UI to show empty state instead of infinite loading
    return NextResponse.json({
      data: [],
      success: false,
      message: 'Database temporarily unavailable - showing empty state'
    })
  }
}

// POST /api/genres - Create new genre (admin only - for future)
export async function POST(request: NextRequest) {
  try {
    // For now, return method not allowed
    // This will be implemented when admin features are added
    return NextResponse.json(
      { error: 'Genre creation is currently restricted to administrators' },
      { status: 405 }
    )

  } catch (error) {
    console.error('Failed to create genre:', error)
    return NextResponse.json(
      { error: 'Failed to create genre' },
      { status: 500 }
    )
  }
}