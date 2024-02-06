'use client'
import { useEffect, useState } from 'react'
import { googleOAuth } from '@/functions/googleOAuth'
import { useRouter } from 'next/navigation'
import supabaseClient from '@/lib/supabase/client'
import { Session } from "@supabase/gotrue-js/src/lib/types"

type HeroFormProps = {
    userSession: Session | null
}

const HeroForm: React.FC<HeroFormProps> = ({userSession}) => {
    const [session, setSession] = useState<Session | null>()
    const [user_name, setUser_Name] = useState<string>('')
    const router = useRouter()

    useEffect(() => {
        const fetchSessionData = async () => {
            const  { data: { session } } = await supabaseClient.auth.getSession();
            setSession(session)
        }
        fetchSessionData()
        if (
            'localStorage' in window
            &&
            window.localStorage.getItem('user_name')
        ) {
            const user_name = window.localStorage.getItem('user_name')
            window.localStorage.removeItem('user_name')
            router.push('/account?user_name=' + user_name)
        }
    },[])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (user_name.length > 0) {
            if (session) {
                router.push(`/account/?user_name=${user_name}`)
            } else {
                window.localStorage.setItem('user_name', user_name)
                await googleOAuth()
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col justify-center md:flex md:flex-row md:items-center md:justify-start'>
            <div className='flex'>
                <span className='bg-white py-3 pl-2' >
                linklist.to/
                </span>
                <input
                    value={user_name}
                    onChange={(e) => setUser_Name(e.target.value)}
                    type="text"
                    className='py-3'
                    placeholder='username'
                />
            </div>
            <div className='flex w-[250.84px] justify-end md:justify-start'>
                <button
                    type="submit"
                    className='text-sm p-3.5 bg-emerald-400 text-white'>
                    Join for Free
                </button>
            </div>
        </form>
    )
}

export default HeroForm
