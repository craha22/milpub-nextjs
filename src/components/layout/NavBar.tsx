import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Shield } from 'lucide-react'

export default async function NavBar() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Shield className="h-8 w-8 text-emerald-500" />
            <span className="ml-2 text-xl font-bold text-white">MilPub</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {!session ? (
              <Link 
                href="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-700 transition"
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button 
                    type="submit"
                    className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium hover:bg-zinc-700 transition"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            )}
          </div>
        </div>  
        </div>  
    </nav>
  )
}