'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/shadcn/dropdown-menu'
import { Button } from '@/components/shadcn/button'
import { ChevronDown } from 'lucide-react'
import { DashboardData } from '../../types/dashboard.type'

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

  const minChartWidth = chartData.length * 80

  return (
    <Card className='h-full rounded-xl border-none bg-white shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between py-6'>
        <CardTitle className='text-lg font-semibold'>Curriculum Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='mb-4 flex items-center justify-end gap-4 pt-4 text-sm'>
          <div className='flex items-center'>
            <span className='mr-2 h-2.5 w-2.5 rounded-full bg-indigo-600'></span>
            <span>Pass</span>
          </div>
          <div className='flex items-center'>
            <span className='mr-2 h-2.5 w-2.5 rounded-full bg-indigo-100'></span>
            <span>Not Pass</span>
          </div>
        </div>
        <div className='h-56 w-full overflow-x-auto'>
          <ResponsiveContainer width='100%' height='100%' minWidth={minChartWidth}>
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey='name' axisLine={false} tickLine={false} />
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
