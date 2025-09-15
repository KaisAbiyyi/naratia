import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/genres - List all active genres
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: genreList, error } = await supabase
      .from('genres')
      .select('id, name, description, color_hex, icon_name, min_content_tier')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({
      data: genreList || [],
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