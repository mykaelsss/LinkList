import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/supabase.types"

const supabaseClient = createClientComponentClient<Database>()

export default supabaseClient
