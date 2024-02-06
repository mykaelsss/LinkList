'use client'
import { FaGoogle } from 'react-icons/fa'
import { googleOAuth } from '@/functions/googleOAuth'

export default function LoginGoogle() {
    return (
        <div className="wrap-input100 mt-6">
            <button
                onClick={googleOAuth}
                className="button100 w-[100%] h-[50px] text-center
                text-white bg-blue-500 rounded-[25px] flex items-center pl-[34px]
                    gap-5">
                    <FaGoogle />
                    <span>Google</span>
            </button>
            <span className="focus-input100"></span>
        </div>
    )
}
