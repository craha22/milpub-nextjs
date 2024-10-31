import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh user if expired - required for Server Components
  // Check for active user
  const { data: { user }, error } = await supabase.auth.getUser();

  // If no active user, reroute to home
  if (!user || error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/search/:path*',
  ],
}