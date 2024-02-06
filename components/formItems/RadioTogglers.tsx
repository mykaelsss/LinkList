import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function RadioTogglers({options, backgroundImg, user, defaultValue, register, bgColor, updateDefault}: any) {
    const url: string = `https://ivvdzmsbftdopbbghybj.supabase.co/storage/v1/object/public/backgrounds/${user?.id}/${backgroundImg?.name}`
    return (
        <div
            className={`h-40 w-full flex justify-end items-end md:h-72`}>
            <div className={'radio-togglers ' }>
                {options.map((option: any, idx: number) => (
                    <label
                        onClick={(e) => updateDefault(option.value)}
                        className="hover:cursor-pointer"
                        key={idx}>
                        <input
                            {...register("bgType")}
                            type="radio"
                            name="bgType"
                            defaultChecked={defaultValue}
                            value={option.value}/>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md">
                            <FontAwesomeIcon icon={option.icon} className="h-4"/>
                            <span className='hidden md:inline'>{option.label}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    )
}
