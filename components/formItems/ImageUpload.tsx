import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { uploadProfilePic } from "@/functions/uploads"
import
    {
        faCloudArrowUp,
    }
    from '@fortawesome/free-solid-svg-icons'

export default function ImageUpload(
    {profilePicture, userId, updateProfilePic}:
    {
        profilePicture: string | undefined,
        userId: string,
        updateProfilePic: Function
    }
    ) {
    return (
        <div className="flex justify-center">
            <div className="relative -top-8">
                <div className="w-28  h-28 relative overflow-hidden rounded-full border-4 border-white shadow shadow-black/50 md:w-40 md:h-40">
                    <Image
                    priority
                    className="object-cover object-center"
                    src={profilePicture !== undefined && profilePicture !== ''  ? profilePicture : '/images/defaultpfp.jpg'}
                    alt={'profile picture'}
                    fill
                    sizes="100%"
                    />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white
                    rounded-full shadow shadow-black/50">
                    <label htmlFor="profilePicture" className="flex items-center gap-2
                        p-3 aspect-square hover:cursor-pointer">
                        <FontAwesomeIcon
                            icon={faCloudArrowUp}
                            className="h-4"
                        />
                        <input type="file" id="profilePicture" name="profilePicture" onChange={(e) => uploadProfilePic(e, userId, updateProfilePic)} className="hidden"/>
                    </label>
                </div>
            </div>
        </div>
    )
}
