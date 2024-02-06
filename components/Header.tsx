import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import AuthNav from "./nav/AuthNav";


export default function Header() {
    return (
        <header className="bg-slate-200 border-b py-4 min-w-full">
            <div className="max-w-6xl flex justify-between mx-auto px-6">
            <div className="flex gap-8">
                <Link
                    href={'/'}
                    className="flex items-center gap-1 text-emerald-400">
                    <FontAwesomeIcon icon={faLink} className="h-5 w-5" />
                    <span>LinkList</span>
                </Link>
                {/* <nav className="flex gap-6 text-slate-500 text-sm items-center">
                    <Link href={'/about'}>About</Link>
                    <Link href={'/pricing'}>Pricing</Link>
                    <Link href={'/contact'}>Contact</Link>
                </nav> */}
            </div>
            <AuthNav />
            </div>
        </header>
    )
}
