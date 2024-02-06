'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";
import { useState } from 'react';
import supabaseClient from '@/lib/supabase/client';
import { ForgotPasswordFormData } from "@/types/Forms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FaLock } from "react-icons/fa";
import { toast } from 'react-hot-toast'
import { SubmitHandler } from 'react-hook-form';

export default function ForgotPassword() {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    const FormSchema: ZodType<ForgotPasswordFormData> = z.object({
        password: z.string().min(6, {message: "Password must be at least 6 characters long."}),
        confirmPassword: z.string().min(6, {message: "Password must be at least 6 characters long."})
    }).refine((data) => data.confirmPassword === data.password, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(FormSchema) })

    const updatePassword: SubmitHandler<ForgotPasswordFormData> = async (data: ForgotPasswordFormData, e: any) => {
        e.preventDefault()
        const password = data?.password
        try {
            const { data: resetData, error } = await supabaseClient
            .auth
            .updateUser({password: password})

            toast.success('Password Succesfully updated!')
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } catch (error) {
            toast.error('Error updating password.')
            console.log(error)
        }
    }

    return (
        <form className="login100-form w-[290px]" onSubmit={handleSubmit(updatePassword)}>
        <span className="
        login100-form-title text-[24px]
        leading-[1.2] text-center w-full
        block pb-12">
            Update Password
        </span>

        <div className="
        wrap-input100
        relative w-full mb-[10px]">
            <input
                {...register("password")}
                className="input100
                text-[15px] leading-[1.5] text-slate-400 block
                w-full bg-[#fffcfc] h-12
                rounded-3xl pl-16 pr-8 z-20"
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
            />
            <span className="focus-input100
            block absolute rounded-3xl bottom-0 left-0 -z-10 w-full
            h-full text-emerald-500"></span>
            <span className="symbol-input100
            flex text-[15px] items-center absolute
            bottom-0 left-0 h-full pl-8
            pointer-events-none text-slate-400">
                <FaLock />
            </span>
            {
                    showPassword &&
                    <div className="flex absolute pr-4 items-center bottom-0 right-0 h-full">
                        <FontAwesomeIcon icon={faEyeSlash}
                            className="hover:cursor-pointer h-4"
                            onClick={() => setShowPassword(!showPassword)}/>
                    </div>
                }
                {
                    !showPassword &&
                    <div className="flex absolute pr-4 items-center bottom-0 right-0 h-full">
                        <FontAwesomeIcon icon={faEye}
                            className="hover:cursor-pointer h-4"
                            onClick={() => setShowPassword(!showPassword)}/>
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
        <div className="
        wrap-input100
        relative w-full z-10 mb-[10px]">
            <input
                {...register("confirmPassword")}
                className="input100
                text-[15px] leading-[1.5] text-slate-400 block
                w-full bg-[#fffcfc] h-12
                rounded-3xl pl-16 pr-8"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm"
            />
            <span className="focus-input100
            block absolute rounded-3xl bottom-0 left-0 -z-10 w-full
            h-full text-emerald-500"></span>
            <span className="symbol-input100
            flex text-[15px] items-center absolute
            bottom-0 left-0 h-full pl-8
            pointer-events-none text-slate-400">
                <FaLock />
            </span>
        </div>
        {
            errors.confirmPassword
            &&
            <div className='w-full flex justify-center'>
                <span className='text-red-500'>
                    {errors.confirmPassword.message}
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
                Send
            </button>
        </div>

        <div className="text-center pt-8">
            <span className="hover:cursor-pointer hover:text-emerald-400">
                Login
            </span>
        </div>
    </form>
    )
}
