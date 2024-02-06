'use client'

import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from 'recharts'
import { group } from '@/app/(app)/analytics/page'

export default function Chart({data}: {data: group}) {
    const xLabelKey = Object.keys(data[0]).find((key: string) => key !== 'date')
    return (
        <div className='z-0'>
            <ResponsiveContainer width={'100%'} height={250}>
                <LineChart data={data}
                    margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                    <CartesianGrid horizontal={false} strokeWidth="2" stroke="#334155"/>
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{fill: '#aaa'}}
                        padding={{right: 5}}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickMargin={10}
                        tick={{fill: '#aaa'}}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey={xLabelKey} stroke="#6366f1" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
