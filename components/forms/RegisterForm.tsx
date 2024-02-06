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

import { User } from '@supabase/auth-helpers-nextjs'
import supabaseClient from '@/lib/supabase/client';
import { RegisterFormData } from '@/types/Forms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons"
import { SubmitHandler } from 'react-hook-form';

export default function RegisterForm(
    {
        user,
        resetPassword,
        showPassword,
        login,
        updateReset,
        updateShowPassword,
        updateLogin
    }: {
        user: User | null
        resetPassword: boolean,
        showPassword: boolean,
        login: boolean,
        updateReset: Function,
        updateShowPassword: Function,
        updateLogin: Function,
}) {

    const FormSchema: ZodType<RegisterFormData> = z.object ({
        email: z.string().email().refine(
            async email =>
            {
                const { data } = await supabaseClient.from('profiles').select("email").eq("email", `${email}`).maybeSingle()
                return data === null
            }, {
                message: "This email is already in use."
            }),
        password: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
        confirmPassword: z.string().min(6, {
            message: "Password must be at least 6 characters.",
        }),
        user_name: z.string().min(3, {
            message: "Username must be at least 3 characters."
        }).refine(
            async username =>
            {
            const { data } = await supabaseClient.from('profiles').select("user_name").eq("user_name", `${username}`).maybeSingle()
            return data === null
            }, {
            message: "Username already in use."
        }),
        full_name: z.string().min(2,
            { message: "Name must be at least 2 characters."
        }).max(45, {
            message: "Name can not be more than 45 characters."
        }),
    })
    .refine((data) => data.confirmPassword === data.password, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormData>({ resolver: zodResolver(FormSchema) })

    const handleRegister: SubmitHandler<RegisterFormData> = async (data: RegisterFormData, e: any) => {
        e.preventDefault()



        const formData = new FormData()
        formData.append("email", `${data.email}`)
        formData.append("password", `${data.password}`)
        formData.append("user_name", `${data.user_name}`)
        formData.append("full_name", `${data.full_name}`)
        console.log(formData)
        await fetch(`http://localhost:3000/auth/sign-up`, {
            method: "post",
            body: formData
        })


        async function updateProfile({}: {
            user_name: string | null
            full_name: string | null
        }) {
            try {

                const { error } = await supabaseClient.from('profiles').upsert({
                    id: user?.id as string,
                    full_name: data.full_name,
                    user_name: data.user_name,
                    updated_at: new Date().toISOString(),
                })
                toast.success("Sign up Succesful")
            if (error) throw error
            } catch (error) {
            alert('Error updating the data!')
            } finally {
                window.location.href = "/account"
            }
        }
        const user_name = data.user_name
        const full_name = data.full_name
        updateProfile({user_name, full_name})
    }


    return (
        <form className="login100-form w-[290px]" onSubmit={handleSubmit(handleRegister)}>
            <span className="
            login100-form-title text-[24px]
            leading-[1.2] text-center w-full
            block pb-12">
                Sign Up
            </span>

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]">
                <input
                    {...register("email")}
                    className="input100
                    text-[15px] leading-[1.5] text-slate-400 block
                    w-full bg-[#fffcfc] h-12
                    rounded-3xl pl-16 pr-8"
                    id="email"
                    type="email"
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
                bottom-[0] left-[0] w-full h-full pl-8
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

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]" >
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
                block absolute rounded-3xl bottom-0
                left-0 -z-10 w-full h-full text-emerald-500"></span>
                <span className="symbol-input100
                flex text-[15px] items-center absolute
                bottom-[0] left-[0] w-full h-full pl-8
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

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]" >
                <input
                    {...register("user_name")}
                    className="input100
                    text-[15px] leading-[1.5] text-slate-400 block
                    w-full bg-[#fffcfc] h-12
                    rounded-3xl pl-16 pr-8"
                    id="user_name"
                    type="text"
                    name="user_name"
                    placeholder="Username"
                />
                <span className="focus-input100
                block absolute rounded-3xl bottom-0
                left-0 -z-10 w-full h-full text-emerald-500"></span>
                <span className="symbol-input100
                flex text-[15px] items-center absolute
                bottom-[0] left-[0] w-full h-full pl-8
                pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faUser} />
                </span>
            </div>

            {
                errors.user_name
                &&
                <div className='w-full flex justify-center'>
                    <span className='text-red-500'>
                        {errors.user_name.message}
                    </span>
                </div>
            }

            <div className="
            wrap-input100
            relative w-full z-10 mb-[10px]" >
                <input
                    {...register("full_name")}
                    className="input100
                    text-[15px] leading-[1.5] text-slate-400 block
                    w-full bg-[#fffcfc] h-12
                    rounded-3xl pl-16 pr-8"
                    id="full_name"
                    type="text"
                    name="full_name"
                    placeholder="John Smith"
                />
                <span className="focus-input100
                block absolute rounded-3xl bottom-0
                left-0 -z-10 w-full h-full text-emerald-500"></span>
                <span className="symbol-input100
                flex text-[15px] items-center absolute
                bottom-[0] left-[0] w-full h-full pl-8
                pointer-events-none text-slate-400">
                    <FontAwesomeIcon icon={faUser} />
                </span>
            </div>

            {
                errors.full_name
                &&
                <div className='w-full flex justify-center'>
                    <span className='text-red-500'>
                        {errors.full_name.message}
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
                    Sign Up
                </button>
            </div>

            <div className='text-center mt-6 text-gray-500'>
                <span>Sign up with a method below</span>
            </div>

            <LoginGoogle />

            <LoginGithub />

            <div className="text-center pt-8">
                <span
                    className="hover:cursor-pointer hover:text-emerald-400"
                    onClick={() => updateLogin(!login)}>
                    Have an account?
                </span>
            </div>
        </form>

    )
}
