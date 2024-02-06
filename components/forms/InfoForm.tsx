'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";
import toast from 'react-hot-toast'

import
    {
        faPalette,
        faImage,
    }
    from '@fortawesome/free-solid-svg-icons'
import RadioTogglers from "@/components/formItems/RadioTogglers";
import { SubmitHandler } from 'react-hook-form';
import  BackgroundInputs from '@/components/formItems/BackgroundInputs'
import { User } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from 'react'
import { InfoFormData } from "@/types/Forms";
import supabaseClient from "@/lib/supabase/client";
import ImageUpload from "../formItems/ImageUpload";

import { getMedia } from "@/functions/uploads";
import InfoFormInputs from "../formItems/InfoFormInputs";
import SubmitButton from "../buttons/SubmitButton";

export default function InfoForm({ user, profilePicUrl, profile, background }: { user: User | null, profilePicUrl: string | null | undefined, profile: any, background: string | null | undefined}) {
    const searchParams = useSearchParams()
    const username: string | null = searchParams.get('user_name')
    const [userId, setUserId] = useState<string>(user?.id as string)
    const [user_name, setUsername] = useState<string | null>()
    const [defaultValue, setDefaultValue] = useState<string>()
    const [bgColors, setBgColors] = useState<string>(profile?.textColor ||  '#000000')
    const [textColors, setTextColors] = useState<string>(profile?.textColor ||  '#000000')
    const [media, setMedia] = useState<string>(background as string || '')
    const [profilePicture, setProfilePicture] = useState<string | undefined>(profilePicUrl as string || '')
    const router = useRouter()

  const setData = () => {
      setUsername(profile?.user_name)
      setDefaultValue(profile?.bgType)
      setBgColors(profile?.bgColor)
      setTextColors(profile?.textColor)
      setValue('user_name', profile?.user_name as string)
      setValue('full_name', profile?.full_name as string)
      setValue('bgType', profile?.bgType as string)
      setValue('bio', profile?.bio as string)
      setValue('location', profile?.location as string)
  }

    const FormSchema: ZodType<InfoFormData> = z.object ({
      user_name: z.string().min(3, {
          message: "Username must be at least 3 characters."
      }).refine(
          async username =>
          {
          const { data } = await supabaseClient.from('profiles').select("user_name").eq("user_name", `${username}`).maybeSingle()
          const belongToUser = (user_name === data?.user_name) ? true : false

          if (data !== null && belongToUser === true) {
            return true
          } else if (data === null) {
            return true
          } else {
            return false
          }
          }, {
            message: "Username already taken."
          }),
      full_name: z.string().min(2,
          { message: "Name must be at least 2 characters."
      }).max(45, {
          message: "Name can not be more than 45 characters."
      }),
      location: z.string().optional(),
      bio: z.string().optional(),
      bgType: z.string().optional(),
      bgColor: z.string().optional(),
      textColor: z.string()
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<InfoFormData>({
    resolver: zodResolver(FormSchema),
  })

      useEffect(() => {
        setData()
        getMedia((user?.id as string), updateMedia)
      }, [user, userId, setData])

      const handleInfo: SubmitHandler<InfoFormData> = async (data, e) => {
        e?.preventDefault()

        async function updateProfile(
          {
            user_name,
            full_name,
            bio,
            location,
            bgType,
            bgColor,
            textColor
          }:
          {
            user_name: string | null
            full_name: string | null
            bio: string | null,
            location: string | null
            bgType: string,
            bgColor: string
            textColor: string
        }) {
            try {
              const { error } = await supabaseClient.from('profiles').upsert({
                  id: userId,
                  full_name: full_name,
                  user_name: user_name,
                  location: location,
                  bio: bio,
                  bgType: bgType,
                  bgColor: bgColor,
                  textColor: textColor,
                  updated_at: new Date().toISOString(),
              })

              if (error) throw error
              if (!error) {
                toast.success("Update Succesful!")
                router.refresh()
              }
            } catch (error) {
              toast.error("Error updating info.")
            }
        }
        const user_name = data.user_name
        const full_name = data.full_name
        const location = data.location as string
        const bio = data.bio as string
        const bgType = data.bgType as string
        const bgColor = bgColors as string
        const textColor = textColors as string
        updateProfile({user_name, full_name, bio, location, bgType, bgColor, textColor})
    }


    const updateDefault = (value: string) => {
      setDefaultValue(value)
    }

    const updateBgColors = (newColors: string) => {
      setBgColors(newColors);
    };

    const updateTextColors = (newColor: string) => {
      setTextColors(newColor);
    }

    const updateMedia = (value: string) => {
      setMedia(value);
    }

    const updateProfilePic = (value: string) => {
      setProfilePicture(value)
    }
    return (
        <div className="flex flex-col items-center gap-4 p-4 justify-center w-full">
            <form className="w-full bg-slate-200 rounded-md" onSubmit={handleSubmit(handleInfo)}>
                <div className="flex flex-col p-3 rounded-t-md" style={defaultValue === 'image' ? {
                  backgroundImage: `url(${media})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
              } : {
                  backgroundColor: bgColors
              }}>
                    <RadioTogglers
                        updateDefault={updateDefault}
                        bgColor={bgColors}
                        register={register}
                        defaultValue={defaultValue}
                        user={user}
                        backgroundImg={media}
                        options={[
                            {value: 'color', icon: faPalette, label: 'Color'},
                            {value: 'image', icon: faImage, label: 'Image'}
                        ]}/>
                    <BackgroundInputs
                      userId={userId}
                      bgColors={bgColors}
                      updateBgColors={updateBgColors}
                      defaultValue={defaultValue}
                      register={register}
                      updateMedia={updateMedia}
                    />
                </div>
                <ImageUpload
                  profilePicture={profilePicture}
                  userId={userId}
                  updateProfilePic={updateProfilePic}
                />
                <InfoFormInputs
                  register={register}
                  errors={errors}
                  updateTextColors={updateTextColors}
                  textColors={textColors}
                />
                <SubmitButton />
            </form>
        </div>
    )
}
