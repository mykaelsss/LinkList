import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import '../globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/Header'

const fira = Fira_Sans({ subsets: ['latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'LinkTree',
  description: 'LinkTree Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='min-h-[100vh] min-w-[100vw]'>
      <body className={`${fira.className} min-w-full `} style={{
            backgroundImage: 'linear-gradient(to right top, #3730a3, #0062c9, #0085c5, #00a2a5, #10b981)',
            // backgroundSize: 'cover',
            // backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed'
        }}>
        <main>
          {/* @ts-expect-error Async Server Component */}
          <Header />
          <Toaster position="top-right" reverseOrder={false}/>
          <div className=''>
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
