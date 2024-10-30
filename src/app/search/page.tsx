import SearchInterface from '@/components/SearchInterface'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const supabase = createServerComponentClient(await { cookies })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-zinc-700 shadow rounded-lg p-6">
          <div className="px-4 py-5 sm:p-6">
            <SearchInterface />
          </div>
        </div>
      </div>
    </div>
  )
}