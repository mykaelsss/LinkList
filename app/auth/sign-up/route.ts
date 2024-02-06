import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/lib/supabase.types'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const user_name = String(formData.get('user_name'))
  const full_name = String(formData.get('full_name'))
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        user_name: user_name,
        full_name: full_name,
      }
    },
  })


  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  })
}
