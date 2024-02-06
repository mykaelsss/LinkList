import supabaseClient from "@/lib/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { InputEvent } from "@/types/event";
import toast from 'react-hot-toast'

export async function uploadBackground(e: InputEvent, userId: string, updateMedia: Function) {
    const fileName = uuidv4()
    const uploadPromise = new Promise(async (resolve, reject) => {
        try {
        const file: File | null = e.target.files?.[0] || null

        const { data: background, error: err} = await supabaseClient
                .storage
                .from('uploads')
                .list(userId + "/backgrounds", {
                    limit: 1,
                    offset: 0,
                    sortBy: {
                        column: 'created_at', order:'desc'
                    }
                })
                const { data, error } = await supabaseClient
                    .storage
                    .from('uploads')
                    .upload(userId + "/backgrounds/" + fileName, file as File);

                if (data) {
                    getMedia(userId, updateMedia);
                    const backgroundUrl = `https://ivvdzmsbftdopbbghybj.supabase.co/storage/v1/object/public/uploads/${userId}/backgrounds/${fileName}`
                        const { error } = await supabaseClient.from('profiles').upsert({
                            id: userId as string,
                            backgroundUrl: backgroundUrl,
                            updated_at: new Date().toISOString(),
                        })
                    resolve('Upload successful');
                } else {
                    console.error(error);
                    reject(new Error('Upload rejected'));
                }
        } catch (error) {
        console.error(error);
        reject(new Error('Upload failed'));
        }
    });

    toast.promise(uploadPromise, {
        loading: 'Upload pending',
        success: 'Upload successful',
        error: 'Upload rejected'
    });
}

export async function getMedia(userId: string, updateMedia: Function) {
    const { data, error } = await supabaseClient
        .storage
        .from('uploads')
        .list(userId + "/backgrounds", {
            limit: 1,
            offset: 0,
            sortBy: {
                column: 'created_at', order:'desc'
            }
        })

    const mediaPic = data !== null ? data[0] : null
    const mediaPicUrl = supabaseClient
    .storage
    .from('uploads')
    .getPublicUrl(`${userId}/backgrounds/${mediaPic?.name}`)
    if (data) updateMedia(mediaPicUrl?.data?.publicUrl)
    else console.log(71, error)
    }


export async function uploadProfilePic(e: InputEvent, userId: string, updateProfilePic: Function) {
    const fileName = uuidv4()
    const uploadPromise = new Promise(async (resolve, reject) => {
        try {
            const file: File | null = e.target.files?.[0] || null;

                    const { data, error } = await supabaseClient
                        .storage
                        .from('uploads')
                        .upload(userId + "/profilePictures/" + fileName, file as File);



                    if (data) {
                        getProfilePic(userId, updateProfilePic);
                        const profilePicUrl = `https://ivvdzmsbftdopbbghybj.supabase.co/storage/v1/object/public/uploads/${userId}/profilePictures/${fileName}`
                        const { error } = await supabaseClient.from('profiles').upsert({
                            id: userId as string,
                            profilePic: profilePicUrl,
                            updated_at: new Date().toISOString(),
                        })
                        resolve('Upload successful');
                    } else {
                        console.error(error);
                        reject(new Error('Upload rejected'));
                    }
            } catch (error) {
                console.error(error);
                reject(new Error('Upload failed'));
            }

    });

    toast.promise(uploadPromise, {
        loading: 'Upload pending',
        success: 'Upload successful',
        error: 'Upload rejected'
    });

}


export async function getProfilePic(userId: string, updateProfilePic: Function) {
    const { data, error } = await supabaseClient
        .storage
        .from('uploads')
        .list(userId + "/profilePictures", {
            limit: 1,
            offset: 0,
            sortBy: {
                column: 'created_at', order:'desc'
            }
        })
    const profileP = (data !== null && data.length > 0) ? data[0] : null
    const profilePicUrl = profileP !== null ? supabaseClient
        .storage
        .from('uploads')
        .getPublicUrl(`${userId}/profilePictures/${profileP?.name}`) : null

    if (data) updateProfilePic(profilePicUrl?.data.publicUrl)
    else console.log(71, error)

    return data
}
