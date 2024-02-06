import Auth from "@/components/Auth";
import supabaseServer from "@/lib/supabase/server";

export default async function AuthForms() {
    const { data: { user } } = await supabaseServer.auth.getUser()
    return (
        <Auth user={user}/>
    )
}
