import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    try {
        await supabase.auth.exchangeCodeForSession(code)
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } catch (error) {
        console.error('Auth error:', error)
        return NextResponse.redirect(new URL('/login?error=auth', request.url))
      } 
  }

  return NextResponse.redirect(requestUrl.origin + '/dashboard')
}