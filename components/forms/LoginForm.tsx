'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";

import { FaEnvelope } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { toast } from 'react-hot-toast'

import LoginGoogle from "@/components/buttons/LoginGoogle";
import LoginGithub from "@/components/buttons/LoginGithub";

import supabaseClient from '@/lib/supabase/client';
import { LoginFormData } from '@/types/Forms';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { InputEvent } from "@/types/event";
import { SubmitHandler } from 'react-hook-form';

export default function LoginForm(
    {
        resetPassword,
        showPassword,
        login,
        updateReset,
        updateShowPassword,
        updateLogin
    }: {
        resetPassword: boolean,
        showPassword: boolean,
        login: boolean,
        updateReset: Function,
        updateShowPassword: Function,
        updateLogin: Function,
    }
) {
    const [emails, setEmails] = useState<string>('')

    const FormSchema: ZodType<LoginFormData> = z.object ({
        email: z.string().email().refine(
            async email => {
                const { data } = await supabaseClient.from('profiles').select("email").eq("email", `${email}`).maybeSingle()
                return data !== null
        }, {
            message: "Email not found."
        }),
        password: z.string().min(1, {
            message: "password is required"
        })
    }).refine(
        async (data) => {
            const email = data.email
            const password = data.password
            const {error} = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            return error === null
        },{
            message: "Invalid Login",
            path: ["password"]
        }
        )

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>({ resolver: zodResolver(FormSchema) })

    const handleLogin: SubmitHandler<LoginFormData> = async (data: LoginFormData, e: any) => {
        e.preventDefault()

        toast.success("Login Succesful")

        const formData = new FormData()
        formData.append("email", `${data.email}`)
        formData.append("password", `${data.password}`)
            await fetch(`https://linkslisted.vercel.app/auth/login`, {
                method: "POST",
                body: formData
            })

        window.location.href = "/account"
    }



    return (
        <form className="login100-form w-[290px]" onSubmit={handleSubmit(handleLogin)}>
            <span className="
            login100-form-title text-[24px]
            leading-[1.2] text-center w-full
            block pb-12">
                Member Login
            </span>

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]">
                <input
                    {...register("email")}
                    onChange={(e) => setEmails(e.target.value)}
                    className="input100
                    text-[15px] leading-[1.5] text-slate-400 block
                    w-full bg-[#fffcfc] h-12
                    rounded-3xl pl-16 pr-8"
                    id="email"
                    type="email"
                    defaultValue={emails}
                    name="email"
                    placeholder="Email"
                />
                <span className="focus-input100
                block absolute rounded-3xl bottom-0 left-0 -z-10 w-full
                h-full text-emerald-500"></span>
                <span className="symbol-input100
                flex text-[15px] items-center absolute
                bottom-[0] left-[0] w-full h-full pl-8
                pointer-events-none text-slate-400">
                    <FaEnvelope />
                </span>
            </div>
            {
                errors.email
                &&
                <div className='w-full flex justify-center'>
                    <span className='text-red-500'>
                        {errors.email.message}
                    </span>
                </div>
            }

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]" >
                <input
                    {...register("password")}
                    className="input100
                    text-[15px] leading-[1.5] text-slate-400 block
                    w-full bg-[#fffcfc] h-12
                    rounded-3xl pl-16 pr-8"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                />
                <span className="focus-input100
                block absolute rounded-3xl bottom-0
                left-0 -z-10 w-full h-full text-emerald-500"></span>
                <span className="symbol-input100
                flex text-[15px] items-center absolute
                bottom-[0] left-[0] h-full pl-8
                pointer-events-none text-slate-400">
                    <FaLock />
                </span>
                {
                    showPassword &&
                    <div className="flex absolute pr-4 items-center bottom-0 right-0 h-full">
                        <FontAwesomeIcon icon={faEyeSlash}
                            className="hover:cursor-pointer"
                            onClick={() => updateShowPassword(!showPassword)}/>
                    </div>
                }
                {
                    !showPassword &&
                    <div className="flex absolute pr-4 items-center bottom-0 right-0 h-full">
                        <FontAwesomeIcon icon={faEye}
                            className="hover:cursor-pointer"
                            onClick={() => updateShowPassword(!showPassword)}/>
                    </div>
                    }
            </div>

            {
                errors.password
                &&
                <div className='w-full flex justify-center'>
                    <span className='text-red-500'>
                        {errors.password.message}
                    </span>
                </div>
            }

            <div className="w-full flex flex-wrap justify-center pt-5">
                <button
                    className="
                    text-[15px] leading-[1.5] text-slate-100
                    uppercase w-full h-[50px] rounded-3xl bg-emerald-500
                    flex justify-center items-center px-6 hover:bg-zinc-800
                    "
                    >
                    Login
                </button>
            </div>

            <div className='text-center mt-6 text-gray-500'>
                <span>Sign in with a method below</span>
            </div>

            <LoginGoogle />

            <LoginGithub />

            <div className="text-center pt-8">
                <span className="hover:cursor-pointer hover:text-emerald-400" onClick={() => updateReset(!resetPassword)}>
                    Forgot Password?
                </span>
            </div>
            <div className="text-center pt-8">
                <span
                    className="hover:cursor-pointer hover:text-emerald-400"
                    onClick={() => updateLogin(!login)}>
                    Create your Account
                </span>
            </div>
        </form>
    )
}
