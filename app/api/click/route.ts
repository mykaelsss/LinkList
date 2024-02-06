import supabaseServer from '@/lib/supabase/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const url = new URL(req.url)
    console.log(url?.searchParams.get('url'))
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const clickUrl: string = String(url?.searchParams.get('url'))
    const profile: string = String(url?.searchParams.get('profile'))
    try {
        const { error } = await supabase.from('events').insert({
            type: 'click',
            url: clickUrl,
            profile: profile
        })
        if (error) throw Error
    } catch (err) {
        console.log(err)
    }

    return NextResponse.json(true)
}
