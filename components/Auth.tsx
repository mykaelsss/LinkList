'use client'

import { User } from "@supabase/supabase-js"
import { useState } from "react"
import TiltImage from "./dynamic/Image"
import LoginForm from "./forms/LoginForm"
import RegisterForm from "./forms/RegisterForm"
import ResetLinkForm from "./forms/ResetLinkForm"

export default function Auth({user}: {user: User | null}) {
    const [resetPassword, setResetPassword] = useState<boolean>(false)
    const [login, setLogin] = useState<boolean>(true)
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const updateLogin = (value: boolean) => {
        console.log(value)
        setLogin(value)
    }

    const updateReset = (value: boolean) => {
        setResetPassword(value)
        setLogin(!value)
    }

    const updateShowPassword = (value: boolean) => {
        setShowPassword(value)
    }

    return (
        <div className="w-full mx-auto">
            <div className="
                container-login100
                w-full min-h-[100vh] flex flex-wrap
                justify-center items-center
                p-4">
                <div className="
                    wrap-login100
                    w-[960px] bg-slate-200 rounded-[10px]
                    overflow-hidden flex flex-wrap justify-between
                    pt-44 pr-32 pb-44 pl-24">
                    <TiltImage />
                    {login &&
                    <LoginForm
                        resetPassword={resetPassword}
                        showPassword={showPassword}
                        login={login}
                        updateLogin={updateLogin}
                        updateShowPassword={updateShowPassword}
                        updateReset={updateReset}
                    />}
                    {!login && !resetPassword && <RegisterForm
                        user={user}
                        resetPassword={resetPassword}
                        showPassword={showPassword}
                        login={login}
                        updateLogin={updateLogin}
                        updateShowPassword={updateShowPassword}
                        updateReset={updateReset}
                    />}
                    {resetPassword && <ResetLinkForm
                        resetPassword={resetPassword}
                        showPassword={showPassword}
                        login={login}
                        updateLogin={updateLogin}
                        updateShowPassword={updateShowPassword}
                        updateReset={updateReset}
                    />}
                </div>
            </div>
        </div>
    )
}
