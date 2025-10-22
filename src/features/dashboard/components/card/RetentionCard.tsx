'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GraduationCap, Info } from 'lucide-react'
import { retentionData } from '../../api/data'
import { Badge } from '@/components/shadcn/badge'

export function StudentRetentionCard() {
  return (
    <Card className='h-full rounded-xl border-none bg-white shadow-md'>
      <CardHeader className='flex flex-row items-center justify-between pt-6'>
        <CardTitle className='flex items-center gap-2 text-lg font-semibold'>
          Student Retention
          <Info className='h-4 w-4 text-gray-400' />
        </CardTitle>
        <span className='cursor-pointer text-sm text-indigo-600'>See Details</span>
      </CardHeader>
      <CardContent>
        <div className='mt-4 flex items-center gap-2'>
          <div className='rounded-lg bg-indigo-100 p-2'>
            <GraduationCap className='h-6 w-6 text-indigo-600' />
          </div>
          <p className='text-3xl font-semibold'>63%</p>
          <Badge className='mt-1 self-start bg-green-100 text-green-700'>+32</Badge>
        </div>

        <div className='relative mt-4 h-44 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={retentionData}
                cx='50%'
                cy='100%'
                innerRadius={65}
                outerRadius={120}
                startAngle={180}
                endAngle={0}
                dataKey='value'
                paddingAngle={2}
              >
                {retentionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-30'>
            <span className='text-xl font-semibold text-gray-800'>63%</span>
            <span className='text-sm text-gray-500'>Retention</span>
          </div>
        </div>

        <div className='mt-4 mb-4 flex items-start gap-3 rounded-lg bg-gray-50 p-3'>
          <Info className='mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500' />
          <p className='text-xs text-gray-600'>
            <span className='font-semibold'>Feedback-</span> some student suggested more frequent communication and
            feedback from management
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
