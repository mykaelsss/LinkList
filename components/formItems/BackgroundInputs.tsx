import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import
    {
        faCloudArrowUp,
        faDroplet,
    }
    from '@fortawesome/free-solid-svg-icons'
import { uploadBackground } from '@/functions/uploads'

export default function BackgroundInputs(
    {
        defaultValue,
        userId,
        updateMedia,
        bgColors,
        register,
        updateBgColors
    }:
    {
        defaultValue: string | undefined,
        bgColors: string | undefined,
        userId: string,
        register: Function,
        updateBgColors: Function,
        updateMedia: Function
    }
    ) {
    return (
        <div className="">
            <div className='flex justify-end'>
                {
                    defaultValue === 'color'
                    &&
                    <div className="pr-2">
                        <label htmlFor="bgColor"
                        className="flex gap-1 items-center
                        rounded-md px-3 py-2 text-slate-50 bg-emerald-300 hover:cursor-pointer ">
                            <FontAwesomeIcon icon={faDroplet}
                                className="h-4 w-4"
                            />
                            <span className='hidden md:inline'>Change</span>
                            <input
                                {...register("bgColor")}
                                onChange={(e) => updateBgColors(e.target.value)}
                                type="color"
                                id="bgColor"
                                defaultValue={bgColors}
                                name="bgColor"
                                className="h-0 w-0"
                                />
                        </label>
                    </div>
                }
                {
                    defaultValue === 'image'
                    &&
                    <div className="pr-2">
                        <label htmlFor="background" className="flex items-center gap-2 px-3 py-2 text-slate-50 bg-emerald-300 rounded-md hover:cursor-pointer">
                            <FontAwesomeIcon
                                icon={faCloudArrowUp}
                                className="h-4"
                                />
                            <input type="file" id="background" name="background" onChange={(e) => uploadBackground(e, userId, updateMedia)} className="hidden"/>
                            <span className='hidden md:inline'>Upload</span>
                        </label>
                    </div>
                }
            </div>
        </div>
    )
}
