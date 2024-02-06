import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import '../../globals.css'

const fira = Fira_Sans({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'LinkTree',
  description: 'LinkTree Clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <html lang="en" className='overflow-x-hidden'>
            <body className={fira.className}>
                <main>
                    <div className=''>
                    {children}
                    </div>
                </main>
            </body>
        </html>
    )
}
