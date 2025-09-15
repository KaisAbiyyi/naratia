import { db } from '../src/lib/database/connection.js'
import { sql } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'

async function setupGenres() {
  try {
    console.log('🚀 Setting up genres table and data...')
    
    // Read the SQL file
    const sqlContent = fs.readFileSync(path.join(process.cwd(), 'scripts', 'insert-genres.sql'), 'utf-8')
    
    // Execute the SQL
    await db.execute(sql.raw(sqlContent))
    
    console.log('✅ Genres setup completed successfully!')
    
    // Test by fetching genres
    const genres = await db.execute(sql`SELECT * FROM genres WHERE is_active = true ORDER BY name`)
    console.log(`📊 Found ${genres.length} active genres:`)
    genres.forEach(genre => {
      console.log(`  - ${genre.name} (${genre.min_content_tier})`)
    })
    
  } catch (error) {
    console.error('❌ Failed to setup genres:', error)
  } finally {
    process.exit(0)
  }
}

setupGenres()