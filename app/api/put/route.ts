import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/supabase.types'

export async function PUT(request: Request,) {
    const {user_name, id, full_name} = await request.json()
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { data } = await supabase.from('profiles').update({
        user_name: user_name,
        full_name: full_name
    }).eq("id", id)

    return NextResponse.json(data)
}
