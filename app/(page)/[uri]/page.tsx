import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase.types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faLink } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default async function UserPage({params}: {params: { uri: string }}) {
    const user_name = params?.uri
    const supabaseServer = createServerComponentClient<Database>({ cookies })

    const { data: profile, error: err, status }: any = await supabaseServer
            .from('profiles')
            .select()
            .eq('user_name', `${user_name}`)
            .single()
        const url = params?.uri
        const { error } = await supabaseServer.from('events').insert(
            {
                type: 'visit',
                url: url,
                profile: user_name
            })
        if (error) console.log(error)
    return (
        <div className="" style={ profile?.bgType === 'image' ? {
            backgroundImage: `url(${profile?.backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            color: profile?.textColor
        } :
        {
            backgroundColor: profile?.bgColor,
            color: profile?.textColor
        }
        }>
            <div className='flex flex-col w-full items-center gap-8 p-4 min-h-screen'>
                <div className='relative w-36 h-36 overflow-hidden rounded-full '>
                    <Image
                        className='object-cover object-center'
                        src={(profile !== null && profile?.pic) ? profile?.profilePic : '/images/defaultpfp.jpg'}
                        alt="profilePic"
                        fill
                        sizes='100%'
                    />
                </div>
                <div className='text-center flex flex-col gap-6 items-center'>
                    <div className='text-center flex flex-col gap-2 items-center'>
                        <h1 className="text-3xl">@{profile?.user_name}</h1>
                        <h2 className='text-lg'>{profile?.full_name}</h2>
                        {
                            profile?.location !== '' &&
                            <h3 className='flex items-center gap-2 text-lg'>
                                <FontAwesomeIcon icon={faLocationDot} className="h-5" />
                                <span>{profile?.location}</span>
                            </h3>
                        }
                    </div>
                    <span className='text-lg'>{profile?.bio}</span>
                </div>
                <div className='flex gap-2 text-black flex-wrap justify-center'>
                    {profile?.buttons?.map((button: any, idx: number) => {
                        return (
                            <div className='' key={idx}>
                                {
                                    button.key === 'email' &&
                                    <Link
                                        ping={`/api/click?url=${button.value}&profile=${user_name}`}
                                        href={`mailto:${button?.value}`}
                                        className="flex gap-2 rounded-full p-3 bg-white items-center"
                                    >
                                        <FontAwesomeIcon icon={button?.icon} className="h-5 w-5"/>
                                    </Link>
                                }
                                {
                                    button.key === 'mobile' &&
                                    <Link
                                        target='_blank'
                                        ping={`/api/click?url=${button.value}`}
                                        href={`tel:${button?.value}`}
                                        className="flex gap-2 rounded-full p-3 bg-white items-center"
                                    >
                                        <FontAwesomeIcon icon={button?.icon} className="h-5 w-5"/>
                                    </Link>
                                }
                                {
                                    (button.key !== 'email' && button.key !== 'mobile') &&
                                    <Link
                                        target='_blank'
                                        ping={`/api/click?url=${button.value}`}
                                        href={button?.value}
                                        className="flex gap-2 rounded-full p-3 bg-white items-center"
                                    >
                                        <FontAwesomeIcon icon={button?.icon} className="h-5 w-5"/>
                                    </Link>
                                }

                            </div>
                        )
                    })}
                    </div>
                    <div className='grid md:grid-cols-2 gap-8 p-4 px-6 max-w-5xl w-full'>
                        {profile?.links?.map((link: any, idx: number) => {
                            return (
                                <Link
                                    target='_blank'
                                    ping={`/api/click?url=${link?.url}&profile=${user_name}`}
                                    key={idx}
                                    href={link?.url}
                                    className="p-2 flex rounded-md items-center"
                                    style={{
                                        backgroundColor: `${link?.bgColor}`,
                                        color: `${link?.textColor}`
                                }}
                                >
                                    <div>
                                        {
                                            link.icon !== '' &&
                                            <div className="relative w-[54px] h-[54px] overflow-hidden rounded-md -left-6 md:w-[74px] md:h-[74px]">
                                                <Image
                                                    priority
                                                    src={link?.icon}
                                                    alt={'icon'}
                                                    className="object-cover object-center"
                                                    fill
                                                    sizes='100%'
                                                />
                                            </div>
                                        }
                                        {
                                            link.icon === '' &&
                                            <div className="relative w-[54px] h-[54px] overflow-hidden rounded-md -left-6 bg-slate-700 flex justify-center items-center">
                                                <FontAwesomeIcon icon={faLink} className="h-6 w-6 text-white" />
                                            </div>
                                        }
                                    </div>
                                    <div className='flex flex-col justify-center'>
                                        <h4>{link?.title}</h4>
                                        <p>{link?.subtitle}</p>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                    <Link href={'/'} className="text-lg pt-24 shadow">Create your own LinkList</Link>
                </div>
        </div>
    )
}
