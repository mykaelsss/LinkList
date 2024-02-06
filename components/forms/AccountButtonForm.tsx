'use client'
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faEnvelope, faGripLines, faMobile, faPhone, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons"
import {
    faDiscord,
    faFacebook,
    faGithub,
    faInstagram,
    faTiktok,
    faLinkedin,
    faWhatsapp,
    faYoutube
} from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from "@supabase/supabase-js"
import { useState, Fragment } from "react"
import SubmitButton from "../buttons/SubmitButton"
import { SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast'
import supabaseClient from "@/lib/supabase/client";
import { useCallback, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";
import { ButtonFormData } from "@/types/Forms"
import { useRouter } from "next/navigation"
import { DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import {
    restrictToVerticalAxis,
    restrictToParentElement
} from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

export const buttonIcons = {
    email: faEnvelope,
    mobile: faMobile,
    instagram: faInstagram,
    facebook: faFacebook,
    discord: faDiscord,
    tiktok: faTiktok,
    youtube: faYoutube,
    whatsapp: faWhatsapp,
    github: faGithub,
    linkedin: faLinkedin,
}

export const allButtons = [
    {key: 'email', 'label': 'e-mail', icon: faEnvelope, 'placeholder': 'abc@example.com'},
    {key: 'mobile', 'label': 'mobile', icon: faPhone, 'placeholder': '123-456-789'},
    {key: 'instagram', 'label': 'instagram', icon: faInstagram, 'placeholder': 'https://instagram.com/profile'},
    {key: 'facebook', 'label': 'facebook', icon: faFacebook, 'placeholder': 'https://facebook.com/profile'},
    {key: 'discord', 'label': 'discord', icon: faDiscord, 'placeholder': 'https://discord.com/profile'},
    {key: 'tiktok', 'label': 'tiktok', icon: faTiktok, 'placeholder': 'https://tiktok.com/profile'},
    {key: 'youtube', 'label': 'youtube', icon: faYoutube, 'placeholder': 'https://youtube.com/profile'},
    {key: 'whatsapp', 'label': 'whatsapp', icon: faWhatsapp, 'placeholder': 'https://whatsapp.com/profile'},
    {key: 'github', 'label': 'github', icon: faGithub, 'placeholder': 'https://github.com/profile'},
    {key: 'linkedin', 'label': 'linkedin', icon: faLinkedin, 'placeholder': 'https://linkedin.com/in/profile'},
]

type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  'setNodeRef' | 'transform' | 'transition'
>


function SortableItem(props: {
    id: string
    children: (args: UseSortableReturn) => React.ReactNode
  }) {
    const { setNodeRef, transform, transition, ...rest } = useSortable({
      id: props.id
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition
    }

    return (
      <div ref={setNodeRef} style={style}>
        {props.children({ ...rest })}
      </div>
    )
  }

export default function AccountButtonForm({user, profile}: {user: User | null, profile: any}) {

    const [activeButtons, setActiveButtons]:any = useState(profile?.buttons || [])
    const modifiers = [restrictToVerticalAxis, restrictToParentElement]

    const [userId, setUserId] = useState<string>(user?.id as string)
    const router = useRouter()

    const addButton = (button: any) => {
        append(button)
        setActiveButtons((prevButtons: any) => {
            return [...prevButtons, button]
        })
    }

    const FormSchema: ZodType<ButtonFormData> = z.object ({
        buttons: z.array(z.object({
            key: z.string(),
            value: z.string().min(2, {message: "Input cannot be empty."}),
            label: z.string(),
            icon: z.any(),
            placeholder: z.string(),
        }))
    })

const handleButton: SubmitHandler<ButtonFormData> = async (data, e) => {
    e?.preventDefault()
    async function updateProfile(
        {
            buttons
        }:
        {
            buttons: any
    }) {
        try {
        const { error } = await supabaseClient.from('profiles').upsert({
            id: user?.id as string,
            buttons: buttons,
            updated_at: new Date().toISOString(),
        })
        if (error) throw error
        } catch (error) {
            console.log(`[ERROR]: ` + error)
            toast.error("Error updating info.")
        }
    }

    const buttons = data.buttons
    toast.success("Buttons Saved!")
    updateProfile({buttons})

    router.refresh()
}

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors }
    } = useForm<ButtonFormData>({
        resolver: zodResolver(FormSchema),
    })

    const { fields, append, remove, move} = useFieldArray({
        name: 'buttons',
        control
    })

    const deleteButton = (index: number, {key: keyToRemove}: {key: string}) => {
        remove(index)
        setActiveButtons((prev: any) => {
            return prev
                .filter((button: any) => button.key !== keyToRemove)
        })
    }



    const availableButtons = allButtons.filter(b1 => !activeButtons.find((b2: any) => b1.key === b2.key));
    useEffect(() => {
        setValue('buttons', activeButtons)
    }, [user, userId])


    return (
        <section className="flex flex-col items-center gap-4 p-4 justify-center w-full">
            <div className="w-full bg-slate-200 rounded-md ">
                <div className="p-2">
                    <h2 className="p-2 text-2xl font-bold">Buttons</h2>
                    <form className="flex flex-col gap-3 p-2 flex-wrap" onSubmit={handleSubmit(handleButton)}>
                        <div className="md:p-2">
                            <DndContext
                                modifiers={modifiers}
                                onDragEnd={(event) => {
                                    const { active, over } = event
                                    if (over && active.id !== over?.id) {
                                        const activeIndex = active.data.current?.sortable?.index
                                        const overIndex = over.data.current?.sortable?.index
                                    if (activeIndex !== undefined && overIndex !== undefined) {
                                        move(activeIndex, overIndex)
                                        }
                                    }
                                }}
                            >
                                <SortableContext items={fields}>
                                    {fields.map((field, index) => {
                                        const button = {
                                            key: field.key,
                                            label: field.label,
                                            placeholder: field.placeholder,
                                            icon: field.icon
                                        }
                                        return (
                                            <Fragment key={field.id}>
                                                <SortableItem id={field.id}>
                                                    {({attributes, listeners}) => (
                                                        <div className="flex flex-col gap-2 p-2" {...attributes}>
                                                            <div className="flex gap-2 items-center">
                                                                    <div className="flex items-center md:hidden" {...listeners}>
                                                                        <FontAwesomeIcon icon={faGripLines} size={'lg'} className="cursor-grab"/>
                                                                    </div>
                                                                <FontAwesomeIcon icon={field.icon}/>
                                                                <span>{field.label.slice(0,1).toUpperCase() + field.label.slice(1)}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <div className="flex gap-2 grow">
                                                                    <div className="md:flex md:items-center hidden" {...listeners}>
                                                                        <FontAwesomeIcon icon={faGripLines} size={'lg'} className="cursor-grab"/>
                                                                    </div>
                                                                    <input
                                                                        {...register(`buttons.${index}.value`)}
                                                                        type="text"
                                                                        className="block p-2 border grow text-sm sm:text-md"
                                                                        placeholder={field.placeholder}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end">
                                                                    <button
                                                                        type="button"
                                                                        className="p-2"
                                                                        onClick={ () => deleteButton(index, button)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        {
                                                            errors.buttons?.[index]?.value
                                                            &&
                                                            <div className='w-full flex justify-center mb-2 md:mb-0'>
                                                                <span className='text-red-500'>
                                                                    {errors.buttons?.[index]?.value?.message}
                                                                </span>
                                                            </div>
                                                        }
                                                        </div>
                                                    )}
                                                </SortableItem>
                                            </Fragment>
                                        )
                                    })}
                                </SortableContext>
                            </DndContext>
                        </div>
                        <div className="grid grid-cols-2 gap-3 px-2 py-5 flex-wrap border-y-2 lg:grid-cols-5">
                            {availableButtons.map((b, idx) => (
                                <button
                                    type="button"
                                    key={idx} className="flex items-center gap-1
                                    p-2 bg-slate-300 text-sm md:text-md sm:gap-2"
                                    onClick={() => addButton(b)}>
                                    <FontAwesomeIcon icon={b.icon} />
                                    <span>{b.label.slice(0,1).toUpperCase() + b.label.slice(1)}</span>
                                    <FontAwesomeIcon icon={faPlus} className=""/>
                                </button>
                            ))}
                        </div>
                        <SubmitButton />
                    </form>
                </div>
            </div>
        </section>
    )
}
