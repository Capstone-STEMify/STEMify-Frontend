'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { DashboardData } from '../../types/dashboard.type'
import { useTranslations } from 'next-intl'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-md bg-gray-900 p-2 text-white shadow-lg'>
        <p className='font-semibold'>{label}</p>
        <p className='text-sm text-indigo-300'>{`Pass: ${payload[0].value}%`}</p>
        <p className='text-sm text-indigo-100'>{`Not Pass: ${payload[1].value}%`}</p>
      </div>
    )
  }
  return null
}

const truncateLabel = (label: string, maxLength = 5) => {
  if (!label) return ''
  return label.length > maxLength ? label.substring(0, 4) + '...' : label
}


const CustomXAxisTick = (props: any) => {
  const { x, y, payload } = props

  const text = truncateLabel(payload.value)

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#666"
        fontSize={12}
      >
        {text}
      </text>
    </g>
  )
}


// Define props interface
interface ProgressStatisticsCardProps {
  data: DashboardData
}

export function ProgressStatisticsCard({ data }: ProgressStatisticsCardProps) {
  const chartData = data.curriculumStatistics.map((curriculum) => ({
    name: curriculum.title,
    pass: curriculum.passRate,
    fail: 100 - curriculum.passRate
  }))

  const t = useTranslations('dashboard.organization')
  const tc = useTranslations('common')

  const minChartWidth = chartData.length * 100

  return (
    <Card className='h-full rounded-xl border-none bg-white shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between py-6'>
        <CardTitle className='text-lg font-semibold'>{t('curriculumStat.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex items-center justify-end gap-4 pt-4 text-sm'>
          <div className='flex items-center'>
            <span className='mr-2 h-2.5 w-2.5 rounded-full bg-indigo-600'></span>
            <span>{t('passed')}</span>
          </div>
          <div className='flex items-center'>
            <span className='mr-2 h-2.5 w-2.5 rounded-full bg-indigo-100'></span>
            <span>{t('failed')}</span>
          </div>
        </div>

        <div className='h-64 w-full overflow-x-auto pb-4'>
          <ResponsiveContainer width='100%' height='100%' minWidth={minChartWidth}>
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 20 }}>
              <XAxis dataKey='name' axisLine={false} tickLine={false} interval={0} tick={<CustomXAxisTick />} />
              <YAxis width={70} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey='pass' fill='#4F46E5' radius={[4, 4, 0, 0]} />
              <Bar dataKey='fail' fill='#E0E7FF' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
