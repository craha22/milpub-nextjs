import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabaseClient'

export default function AuthComponent() {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github', 'apple']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  )
}