'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
    {
        faGear,
        faChartSimple,
        faRightFromBracket,
        faArrowLeft,
        faLink,
    }
    from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import Link from 'next/link'
import { Session } from '@supabase/supabase-js'
import supabaseClient from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Hamburger from "hamburger-react";

export default function Aside({ user, profile }: { user: Session | null, profile: any }) {
    const username: string = profile?.user_name
    const [isOpen, setOpen] = useState(false)

    const path = usePathname()

    return (
        <div className='relative'>
            <label htmlFor="navCb" className="flex justify-end md:hidden z-30 text-slate-200 right-0 p-3">
                <Hamburger
                    size={24}
                    toggled={false}
                />
            </label>
            <input id="navCb" type="checkbox" className='hidden'/>
            <label htmlFor='navCb' className='hidden backdrop fixed inset-0 bg-black/80 z-20'></label>
            <aside className='bg-slate-100 w-40 p-4 h-full shadow fixed -left-48 top-0 z-50 md:static transition-all duration-[400ms] md:w-48'>
                <div className="">
                    <div className='w-full flex justify-center'>
                        <div className='relative w-28 h-28 overflow-hidden rounded-full shadow-md shadow-black/70 md:w-40 md:h-40'>
                            <Image
                                priority
                                src={profile?.profilePic !== undefined && profile?.profilePic ? profile?.profilePic : '/images/defaultpfp.jpg'}
                                alt="Profile Picture"
                                className="object-cover object-center w-auto"
                                fill
                                sizes="100%"
                            />
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <nav className='flex flex-col gap-4 pt-8'>
                            <Link
                                target="_blank"
                                href={`/${username}`}
                                className="flex p-2 items-center gap-1 text-lg"
                            >
                                <FontAwesomeIcon icon={faLink} className="text-emerald-400"/>
                                <span className='text-gray-400'>/</span>
                                <span>{username}</span>
                            </Link>
                            <Link
                                href={'/account'}
                                className={ "flex items-center gap-2 p-2 " + (path === '/account' ? 'text-emerald-400': '')}>
                                <FontAwesomeIcon icon={faGear} className="h-4 w-4"/>
                                <span>Settings</span>
                            </Link>
                            <Link
                                href={'/analytics'}
                                className={ "flex items-center gap-2 p-2 " + (path === '/analytics' ? 'text-emerald-400': '')}>
                                <FontAwesomeIcon icon={faChartSimple} className="h-4 w-4"/>
                                <span>Analytics</span>
                            </Link>
                            <form action={"/auth/logout"} method="post">
                                <button
                                    className={ "flex items-center gap-2 p-2"}>
                                    <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
                                    <span className="flex">Sign Out</span>
                                </button>
                            </form>
                            <Link
                                href={'/'}
                                className="flex items-center gap-2 border-t border-black pt-2">
                                <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4"/>
                                <span>Home</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </aside>
        </div>
    )
}
