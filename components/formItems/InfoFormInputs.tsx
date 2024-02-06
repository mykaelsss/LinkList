import { InfoFormError } from "@/types/errors";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import{ faDroplet } from '@fortawesome/free-solid-svg-icons'

export default function InfoFormInputs({register, errors, updateTextColors, textColors}: {register: Function, errors: InfoFormError, updateTextColors: Function, textColors: string}) {
    return (
        <div className="flex flex-col gap-2 p-4">
                    <div>
                        <label htmlFor="user_name" className="text-black">Username</label>
                        <input
                        {...register('user_name')}
                        type="text"
                        name="user_name"
                        id="username"
                        placeholder="Username"
                        className="border w-full block p-2 rounded-sm"/>
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
                    <div>
                        <label htmlFor="full_name" className="text-black">Full Name</label>
                        <input
                        {...register("full_name")}
                        type="text"
                        name="full_name"
                        id="full_name"
                        placeholder="John Smith"
                        className="border w-full block p-2 rounded-sm"/>
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
                    <div>
                        <label htmlFor="location" className="text-black">Location</label>
                        <input
                            {...register("location")}
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Location"
                            className="border w-full block p-2 rounded-sm"/>
                    </div>
                    <div>
                        <label htmlFor="bio" className="text-black">Bio</label>
                        <textarea
                        {...register("bio")}
                        name="bio"
                        placeholder="About me..."
                        id="bio"
                        cols={10}
                        rows={5}
                        className="border w-full block p-2 rounded-sm"/>
                    </div>
                    <div className="">
                <label
                    htmlFor="textColor"
                    className="flex gap-1 items-center justify-center bg-emerald-400
                    rounded-md p-2 hover:cursor-pointer w-48 mt-4 text-slate-50"
                >
                    <FontAwesomeIcon icon={faDroplet}
                    className="h-4"/>
                    <span>Change Text Color</span>
                    <input
                        {...register("textColor")}
                        onChange={(e) => updateTextColors(e.target.value)}
                        type="color"
                        id="textColor"
                        defaultValue={textColors as string}
                        name="textColor"
                        className="h-0 w-0"
                        />
                </label>
            </div>
                </div>
    )
}
