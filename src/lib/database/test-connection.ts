// Test database connection
import { db } from './connection'

export async function testConnection() {
  try {
    // Simple test query
    const result = await db.execute(`SELECT 1 as test`)
    console.log('✅ Database connection successful:', result)
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}