'use client'
import { useState } from 'react'
import Hamburger from "hamburger-react";

export default function HamburgerButton() {
    const [isOpen, setOpen] = useState(false)
    return (
        <div>
            <label htmlFor="navCb" className="flex w-full justify-end md:hidden">
                <Hamburger
                    size={24}
                    toggled={isOpen}
                    toggle={setOpen}
                />
            </label>
            <input id="navCb" type="checkbox" className='hidden'/>
        </div>
    )
}
