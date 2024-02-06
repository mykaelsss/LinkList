'use client'
import Link from "next/link";
import supabaseClient from "@/lib/supabase/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faUserPen } from '@fortawesome/free-solid-svg-icons'
import { User } from "@supabase/gotrue-js/src/lib/types"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



export default function AuthNav() {
    const [user, setUser] = useState<User | null>()

    useEffect(() => {
        const fetchSessionData = async () => {
            const  { data: { session } } = await supabaseClient.auth.getSession();
            setUser(session?.user)
        }
        fetchSessionData()
    }, [user])

    const demoLogin = async () => {
        const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL
        const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASS
        const formData = new FormData()
        formData.append('email', `${demoEmail}`)
        formData.append('password', `${demoPassword}`)
        try {
            await fetch(`http://localhost:3000/auth/login`, {
                method: "POST",
                body: formData
            })
            toast.success("Login Successful!")
            window.location.href = '/account'
        } catch (error) {
            console.log(error)
            toast.error("Error logging in.")
        }
    }

    return (
        <nav className="flex gap-2.5 text-sm text-slate-500 items-center md:gap-4">
        {(user === undefined) && (
            <div className="flex">
                <button onClick={demoLogin}
                    className="p-3 uppercase hover:bg-emerald-400
                    hover:text-slate-50 transition-all rounded-md">
                    demo login
                </button>
                <Link
                    href={"/authentication"}
                    className="bold uppercase p-3 rounded-md
                    hover:bg-emerald-400 hover:text-slate-50 transition-all">Sign In</Link>
            </div>
        )}
        {(user !== undefined) && (
            <>
                <Link href={'account'} className="hover:text-emerald-400 font-bold flex items-center gap-1" >
                    <FontAwesomeIcon icon={faUserPen} className="h-4 " />
                    Edit Profile
                </Link>
                <form action={"/auth/logout"} method="post">
                    <button
                        className="text-slate-500 flex gap-2 items-center border-0
                        border-slate-500 rounded-md p-2
                        hover:text-white hover:bg-emerald-400 hover:border-emerald-400 md:border-2">
                        <span className="md:flex hidden">Sign Out</span>
                        <FontAwesomeIcon icon={faRightFromBracket} className="h-5" />
                    </button>
                </form>
            </>
        )}
</nav>
    )
}
