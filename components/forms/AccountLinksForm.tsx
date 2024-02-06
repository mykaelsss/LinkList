'use client'
import { v4 as uuidv4 } from 'uuid';
import { IconProp, text } from "@fortawesome/fontawesome-svg-core"
import { faCloudArrowUp, faEnvelope, faGripLines, faLink, faMobile, faPlus, faTrash, faDroplet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { User } from "@supabase/supabase-js"
import { useState, Fragment } from "react"
import SubmitButton from "../buttons/SubmitButton"
import { SubmitHandler } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast'
import supabaseClient from "@/lib/supabase/client";
import { useCallback, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { ZodType } from "zod"
import * as z from "zod";
import { LinkFormData } from "@/types/Forms"
import { useRouter } from "next/navigation"
import { DndContext } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import {
    restrictToVerticalAxis,
    restrictToParentElement
} from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'
import { InputEvent } from "@/types/event";
import Image from "next/image"
import { Profile } from '@/app/(app)/account/page';

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

export default function AccountLinksForm({user, profile}: {user: User | null, profile: any}) {

    const [links, setLinks] = useState(profile?.links || [])
    const modifiers = [restrictToVerticalAxis, restrictToParentElement]
    const [bgColors, setBgColors] = useState<string>(profile?.links?.bgColor || '#262626')
    const [textColors, setTextColors] = useState<string>(profile?.links?.textColor || '#f8fafc')
    const [userId, setUserId] = useState<string>(user?.id as string)

    const addLink = () => {
        append({
            key: Date.now().toString(),
            title:'',
            subtitle:'',
            icon:'',
            url:'',
            value: '',
            bgColor: bgColors,
            textColor: textColors
        })
        setLinks((prev: any) => [...prev,
            {
                key: Date.now().toString(),
                title:'',
                subtitle:'',
                icon:'',
                url:'',
                value: '',
                bgColor: bgColors,
                textColor: textColors
            }
        ])
    }

    const FormSchema: ZodType<LinkFormData> = z.object ({
        links: z.array(z.object({
            key: z.string(),
            value: z.string().optional(),
            title: z.string().min(2, {message: "Input cannot be empty"}),
            subtitle: z.string().optional(),
            icon: z.string().optional(),
            url: z.string().url({message: "Invalid Url"}),
            bgColor: z.string().optional(),
            textColor: z.string().optional(),
        }))
    })

    const handleLink: SubmitHandler<LinkFormData> = async (data, e) => {
        e?.preventDefault()
        console.log('hello')
        async function updateProfile(
            {
                links
            }:
            {
                links: any
        }) {
            try {
                const fieldLinks = data.links
                setLinks(() => {
                    const newLinks =  [...fieldLinks]
                    newLinks.forEach((link) => {
                        link.bgColor = bgColors
                        link.textColor = textColors
                    })
                    data.links = fieldLinks
                    return newLinks
                })
                const { error } = await supabaseClient.from('profiles').upsert({
                    id: user?.id as string,
                    links: links,
                    updated_at: new Date().toISOString(),
                })
                console.log("hey", links)
                if (error) throw error
            } catch (error) {
                console.log(`[ERROR]: ` + error)
                toast.error("Error updating info.")
            }
        }

        const links = data.links
        toast.success("Links Saved!")
        updateProfile({links})
    }

    const {
        register,
        handleSubmit,
        setValue,
        control,
        getValues,
        formState: { errors }
    } = useForm<LinkFormData>({
        resolver: zodResolver(FormSchema),
    })

    const { fields, append, remove, move} = useFieldArray({
        name: 'links',
        control
    })

    const deleteLink = (index: number, {key: keyToRemove}: {key: string}) => {
        remove(index)
        setLinks((prev: any) => {
            return prev
                .filter((link: any) => link.key !== keyToRemove)
        })
    }

    setValue('links', links)

async function uploadLinkIcon(e: InputEvent) {
    const fileName = uuidv4()
    const linkKey = e.target.id
        const uploadPromise = new Promise(async (resolve, reject) => {
            try {
                const file: File | null = e.target.files?.[0] || null;

                const { data, error } = await supabaseClient
                    .storage
                    .from('uploads')
                    .upload(userId + "/linkIcons/" + fileName, file as File);

                if (data) {
                    const fieldLinks = getValues('links')
                    setLinks(() => {
                        const newLinks =  [...fieldLinks]
                        newLinks.forEach((link) => {
                            if (link.key === linkKey) link.icon = `https://ivvdzmsbftdopbbghybj.supabase.co/storage/v1/object/public/uploads/${userId}/linkIcons/${fileName}`
                        })
                        setValue('links', newLinks)
                        return newLinks
                    })
                    const { error } = await supabaseClient.from('profiles').upsert({
                        id: user?.id as string,
                        links: links,
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

    return (
        <section className="flex flex-col items-center gap-4 p-4 justify-center w-full">
            <div className="w-full bg-slate-200 rounded-md ">
                <div className="p-2">
                    <h3 className="p-2 text-2xl font-bold">Links</h3>
                    <form className="p-2 flex flex-col gap-4" onSubmit={handleSubmit(handleLink)}>
                        <button
                            type="button"
                            onClick={addLink}
                            className="text-lg max-w-24 space-x-1"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add new</span>
                        </button>
                        <div>
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
                                        const link = {
                                            key: field.key,
                                            value: field.value,
                                            title: field.title,
                                            subtitle: field.subtitle,
                                            icon: field.icon,
                                            url: field.url,
                                        }
                                        return (
                                            <Fragment key={field.id}>
                                                <SortableItem id={field.id}>
                                                    {({attributes, listeners}) => (
                                                        <div className="flex flex-col gap-2 p-2 w-full" {...attributes}>
                                                            <div className="flex flex-col gap-8 sm:flex-row">
                                                                <div className="flex gap-4">
                                                                    <div className="flex items-center justify-center" {...listeners}>
                                                                        <FontAwesomeIcon icon={faGripLines} size={'lg'} className="cursor-grab"/>
                                                                    </div>
                                                                    <div className="flex flex-col items-center md:justify-center gap-6 w-full cursor-default">
                                                                        <div className="flex justify-center">
                                                                            {(field?.icon?.length === 0 )&& (
                                                                                <FontAwesomeIcon icon={faLink} size={'lg'}/>
                                                                            )}
                                                                            {(field.icon !== undefined && field?.icon.length > 0) && (
                                                                                <div className='relative w-[84px] h-[84px] overflow-hidden rounded-full'>
                                                                                    <Image
                                                                                        className='object-cover object-center'
                                                                                        src={field.icon}
                                                                                        alt='icon'
                                                                                        fill
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <label htmlFor={field.key} className="flex items-center justify-center border-2
                                                                        rounded-md p-2 w-36 gap-2 cursor-pointer text-sm bg-emerald-400 text-slate-50">
                                                                            <FontAwesomeIcon icon={faCloudArrowUp} />
                                                                            <span>Change icon</span>
                                                                            <input
                                                                                type="file"
                                                                                id={field.key}
                                                                                name={field.key}
                                                                                className="hidden"
                                                                                onChange={(e) => uploadLinkIcon(e)}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col gap-3 w-full">
                                                                    <div className="">
                                                                        <label htmlFor="title">Title</label>
                                                                        <input
                                                                            {...register(`links.${index}.title`)}
                                                                            className="block p-2 border w-full"
                                                                            placeholder="Title"
                                                                        />
                                                                        {
                                                                            errors.links?.[index]?.title
                                                                            &&
                                                                            <div className='w-full flex justify-center'>
                                                                                <span className='text-red-500'>
                                                                                    {errors.links?.[index]?.title?.message}
                                                                                </span>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    <div className="">
                                                                        <label htmlFor="subtitle">Subtitle</label>
                                                                        <textarea
                                                                            {...register(`links.${index}.subtitle`)}
                                                                            className="block p-2 border w-full"
                                                                            placeholder="Subtitle (optional)"
                                                                            cols={5}
                                                                            rows={2}
                                                                        />
                                                                    </div>
                                                                    <div className="">
                                                                        <label htmlFor="url">Url</label>
                                                                        <input
                                                                            {...register(`links.${index}.url`)}
                                                                            className="block p-2 border w-full"
                                                                            placeholder="Url"
                                                                        />
                                                                        {
                                                                            errors.links?.[index]?.url
                                                                            &&
                                                                            <div className='w-full flex justify-center'>
                                                                                <span className='text-red-500'>
                                                                                    {errors.links?.[index]?.url?.message}
                                                                                </span>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center justify-end sm:justify-start">
                                                                    <button
                                                                        type="button"
                                                                        className="px-4 py-3 border-2 rounded-md hover:bg-emerald-400 hover:text-slate-50 hover:border-0"
                                                                        onClick={ () => deleteLink(index, link)}>
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </SortableItem>
                                            </Fragment>
                                        )
                                    })}
                                </SortableContext>
                            </DndContext>
                            <div className="flex flex-col gap-2 mt-4 justify-center items-center sm:flex-row">
                                <label htmlFor="bgColor"
                                className="flex gap-1 items-center justify-center
                                rounded-md p-2 text-slate-50 bg-emerald-400 w-48 hover:cursor-pointer">
                                    <FontAwesomeIcon icon={faDroplet}
                                        className="h-4"
                                    />
                                    <span>Background Color</span>
                                    <input
                                        onChange={(e) => setBgColors(e.target.value)}
                                        type="color"
                                        id="bgColor"
                                        defaultValue={bgColors}
                                        name="bgColor"
                                        className="h-0 w-0"
                                        />
                                </label>
                                <div>
                                    <label htmlFor="textColors"
                                    className="flex gap-1 items-center justify-center
                                    rounded-md p-2 text-slate-50 bg-emerald-400 w-48 hover:cursor-pointer">
                                        <FontAwesomeIcon icon={faDroplet}
                                            className="h-4"
                                        />
                                        <span>Text Color</span>
                                        <input
                                            onChange={(e) => setTextColors(e.target.value)}
                                            type="color"
                                            id="textColors"
                                            defaultValue={textColors}
                                            name="textColors"
                                            className="h-0 w-0"
                                            />
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="border-t-2">
                            <SubmitButton />
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
