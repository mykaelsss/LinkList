import { redirect } from "next/navigation";
import InfoForm from "@/components/forms/InfoForm";
import supabaseServer from "@/lib/supabase/server";
import AccountButtonForm from "@/components/forms/AccountButtonForm";
import AccountLinksForm from "@/components/forms/AccountLinksForm";

export default async function AccountPage() {
    const { data: { user } } = await supabaseServer.auth.getUser()
    if (user === null) {
        redirect('/')
    }

    const { data: profile, } = await supabaseServer
    .from('profiles')
    .select()
    .eq('id', `${user?.id}`)
    .single()

    return (
        <>
            <InfoForm user={user} profilePicUrl={profile?.profilePic} profile={profile} background={profile?.backgroundUrl}/>
            <AccountButtonForm user={user} profile={profile}/>
            <AccountLinksForm user={user} profile={profile}/>
        </>
    )
}
