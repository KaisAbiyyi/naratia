// Deploy schema to Supabase
// This script can be run with environment variables loaded

import { execSync } from 'child_process'
import { readFileSync } from 'fs'

console.log('🚀 Deploying schema to Supabase...')

// Check if DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log('Please set your Supabase DATABASE_URL and try again.')
  console.log('Example: DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]')
  process.exit(1)
}

try {
  console.log('📝 Generated migration file:')
  const migrationFile = 'src/lib/database/migrations/0000_faithful_omega_flight.sql'
  const migrationSQL = readFileSync(migrationFile, 'utf8')
  console.log(`Migration contains ${migrationSQL.split('-->').length - 1} statements`)
  
  console.log('🔄 Pushing schema to Supabase...')
  execSync('bun run db:push', { stdio: 'inherit' })
  
  console.log('✅ Schema deployed successfully!')
} catch (error) {
  console.error('❌ Schema deployment failed:', error.message)
  console.log('\n💡 Alternative: You can manually run the SQL migration in Supabase Dashboard')
  console.log('Migration file: src/lib/database/migrations/0000_faithful_omega_flight.sql')
}