import { redirect } from "next/navigation";
import InfoForm from "@/components/forms/InfoForm";
import supabaseServer from "@/lib/supabase/server";
import AccountButtonForm from "@/components/forms/AccountButtonForm";
import AccountLinksForm from "@/components/forms/AccountLinksForm";

export type Profile = {
    backgroundUrl: string | null,
    bgColor: string,
    bgType: string,
    bio: string | null,
    buttons: Buttons | null,
    created_at: string,
    updated_at: string,
    email: string | null,
    full_name: string | null,
    user_name: string | null,
    location: string | null,
    links: Links | null,
    profilePic: string | null,
    textColor: string
} | null

type Buttons = {
    key: string,
    icon: {
        icon: [],
        prefix: string,
        iconName: string,
    },
    label: string,
    value: string,
    placeholder: string
}[]

type Links = {
    key: string,
    url: string,
    icon: string,
    title: string,
    value: string,
    bgColor: string,
    subtitle: string,
    textColor: string,
}[]

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
