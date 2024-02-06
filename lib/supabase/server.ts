
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseServer = createServerComponentClient<Database>({ cookies })

export default supabaseServer
