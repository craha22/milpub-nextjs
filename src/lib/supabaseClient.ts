import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Optional: Type definitions for your database
export type Database = {
  public: {
    tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
        }
        Update: {
          email?: string
          name?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}