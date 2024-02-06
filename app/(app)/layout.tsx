import Aside from '@/components/Aside'

import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import { fetchData } from '@/functions/fetchData'
import supabaseServer from '@/lib/supabase/server'
import '../globals.css'
import { Toaster } from 'react-hot-toast'

const fira = Fira_Sans({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'LinkTree',
  description: 'LinkTree Clone',
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {

    const user = await fetchData()

        const { data: profile, error:err, status } = await supabaseServer
            .from('profiles')
            .select()
            .eq('id', `${user?.user?.id}`)
            .single()

    return (
    <html lang="en" className='overflow-x-hidden'>
        <body className={`${fira.className} overflow-x-hidden`} style={{
            backgroundImage: 'linear-gradient(to right top, #3730a3, #0062c9, #0085c5, #00a2a5, #10b981)',
        }}>
        <main className="md:flex min-h-screen">
            <Aside user={user} profile={profile}/>
            <Toaster position="top-right" reverseOrder={false}/>
            <div className='w-full'>
                {children}
            </div>
        </main>
        </body>
    </html>
    )
}
