'use client'
import { FaGithub } from 'react-icons/fa'
import { githubOAuth } from '@/functions/githubOAuth'

export default function LoginGithub() {

    return (
        <div className="wrap-input100 mt-6">
            <button
                onClick={githubOAuth}
                className="button100 w-[100%] h-[50px] text-center
                text-white bg-blue-900 rounded-[25px] flex items-center pl-[34px]
                gap-5">
                <FaGithub />
                <span>Github</span>
            </button>
            <span className="focus-input100"></span>
        </div>
    )
}
