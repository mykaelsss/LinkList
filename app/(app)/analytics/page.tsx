import Chart from "@/components/Chart";
import supabaseServer from "@/lib/supabase/server"
import { differenceInDays, addDays, parseISO, format } from 'date-fns'
import { UTCDate } from "@date-fns/utc";
import { redirect } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from '@fortawesome/free-solid-svg-icons'
import Link from "next/link";

export type group = {
    date: string,
    visits: number,
}[]

export default async function Analytics() {
    const { data: {session} } = await supabaseServer.auth.getSession()
    if (session === null) redirect('/')

    const { data: profile, error: err, status }: any = await supabaseServer
            .from('profiles')
            .select()
            .eq('id', `${session?.user.id}`)
            .single()
    const { data: dates } = await supabaseServer
        .from('groupdates')
        .select()
        .eq('profile', profile?.user_name)


        const groupedDates: group = []

        if (dates) {
            for (let i = 0; i < dates.length - 1; i++) {
                const date = dates[i].grouped_date;
                const nextDate = dates[i + 1].grouped_date;
                groupedDates.push({
                    'date': date as string,
                    'visits': dates[i].event_count as number
                })
                const daysBetween = differenceInDays(parseISO(nextDate as string), parseISO(date as string));

                if (daysBetween > 0) {
                    for (let j = 1; j < daysBetween; j++) {
                        const intermediateDate = addDays(date as string, j);
                        groupedDates.push({
                            'date': format(new UTCDate(intermediateDate), 'yyyy-MM-dd'),
                            'visits': 0
                        })
                    }
                }
            }
        }

        groupedDates.push({
            'date': dates?.[dates.length - 1]?.grouped_date as string,
            'visits': dates?.[dates.length - 1]?.event_count as number
        })

        const {data: clicks} = await supabaseServer
            .from('events')
            .select()
            .eq('type', 'click')
            .eq('profile', profile?.user_name)


    return (
        <div className="p-3 flex flex-col gap-8">
            <div className="bg-slate-200 p-4 rounded-md">
                <h2 className="text-xl p-4 text-center">Visits</h2>
                <Chart data={groupedDates} />
            </div>
            <div className="bg-slate-200 p-8 rounded-md">
                <h2 className="text-xl p-4 text-center">Clicks</h2>
                {profile?.links?.map((link: any, idx: number) => (
                    <div className="border-t border-gray-200 py-4 flex flex-col gap-6 md:flex md:flex-row md:items-center" key={idx}>
                        <div className="flex gap-2">
                            <div className="text-emerald-400 flex items-start pl-4 pt-1 md:items-center">
                                <FontAwesomeIcon icon={faLink} className="h-5"/>
                            </div>
                            <div className="grow">
                                <h3>{link.title}</h3>
                                <p>{link.subtitle}</p>
                                <Link
                                    target="_blank"
                                    href={link.url}
                                    className="text-xs text-emerald-400"
                                >{
                                    link.url}
                                </Link>
                            </div>
                        </div>
                        <div className="flex gap-3 text-2xl md:text-3xl justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-center">
                                    {clicks
                                        ?.filter(c => c.url === link.url &&
                                        format(new UTCDate(c.created_at),  'yyyy-MM-dd') === format(new UTCDate,  'yyyy-MM-dd'))
                                        .length}
                                </div>
                                    <span className="text-gray-400 text-xs font-bold uppercase text-center">Clicks Today</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-center">
                                    {clicks?.filter(c => c.url === link.url).length}
                                </div>
                                <span className="text-gray-400 text-xs font-bold uppercase text-center">
                                    Total Clicks
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
