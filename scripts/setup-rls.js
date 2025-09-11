// Setup RLS policies for Supabase
import { readFileSync } from 'fs'
import postgres from 'postgres'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

async function setupRLS() {
  console.log('🔒 Setting up Row Level Security policies...')
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set')
    console.log('Make sure you have .env.local file with DATABASE_URL configured')
    process.exit(1)
  }

  let sql
  try {
    // Connect to database
    sql = postgres(process.env.DATABASE_URL)
    console.log('✅ Connected to database')

    // Read RLS setup script
    const rlsScript = readFileSync('src/lib/database/setup-rls.sql', 'utf8')
    
    // Split by semicolons and filter out empty statements
    const statements = rlsScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📝 Executing ${statements.length} RLS statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          await sql.unsafe(statement)
          if (statement.includes('ENABLE ROW LEVEL SECURITY')) {
            const tableName = statement.match(/ALTER TABLE (\w+)/)?.[1]
            console.log(`✅ Enabled RLS on table: ${tableName}`)
          } else if (statement.includes('CREATE POLICY')) {
            const policyName = statement.match(/CREATE POLICY "([^"]+)"/)?.[1]
            console.log(`✅ Created policy: ${policyName}`)
          } else if (statement.includes('DROP POLICY')) {
            // Silent for drops
          }
        } catch (error) {
          if (error.message.includes('does not exist')) {
            // Ignore policy doesn't exist errors (for DROP POLICY IF EXISTS)
            continue
          }
          console.error(`❌ Error executing statement: ${statement.substring(0, 100)}...`)
          console.error(error.message)
        }
      }
    }

    console.log('🎉 RLS setup completed successfully!')
    
  } catch (error) {
    console.error('❌ RLS setup failed:', error.message)
    process.exit(1)
  } finally {
    if (sql) await sql.end()
  }
}

setupRLS().catch(console.error)