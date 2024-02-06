'use client'
import supabaseClient from "@/lib/supabase/client"
import { FaEnvelope } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";
import { ResetLinkFormData } from "@/types/Forms";
import { toast } from 'react-hot-toast'
import { InputEvent } from "@/types/event";
import { SubmitHandler } from 'react-hook-form';

export default function ResetLinkForm(
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
}) {

    const FormSchema: ZodType<ResetLinkFormData> = z.object({ email: z.string().email() })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetLinkFormData>({ resolver: zodResolver(FormSchema) })

    const sendResetPassword: SubmitHandler<ResetLinkFormData> = async (data: ResetLinkFormData, e: any) => {
        e.preventDefault()

        const email = data?.email
        try {
            const { data: reset, error } = await supabaseClient
            .auth
            .resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset`
            })
            toast.success('Link has been sent!')
        } catch (error) {
            console.log(error)
            toast.error('Error sending link')
        }
    }
    return (
        <form className="login100-form w-[290px]" onSubmit={handleSubmit(sendResetPassword)}>
            <span className="
            login100-form-title text-[24px]
            leading-[1.2] text-center w-full
            block pb-12">
                Reset
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
                <span className="hover:cursor-pointer hover:text-emerald-400" onClick={() => updateReset(!resetPassword)}>
                    Login
                </span>
            </div>
        </form>
    )
}
