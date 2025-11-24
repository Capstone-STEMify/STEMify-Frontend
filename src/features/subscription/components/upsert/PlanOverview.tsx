'use client'
import { Label } from '@/components/shadcn/label'
import { GraduationCap, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PlanOverviewProps {
  planName: string
  planDescription?: string
  maxStudentSeats: number
  maxTeacherSeats: number
}

export default function PlanOverview({
  planName,
  planDescription,
  maxStudentSeats,
  maxTeacherSeats
}: PlanOverviewProps) {
  const to = useTranslations('organization.subscription.create')
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <Label className='text-base font-semibold text-slate-900'>{to('planOverview.header')}</Label>
        <div className='rounded-full bg-blue-100 px-3 py-1'>
          <span className='text-xs font-medium text-blue-700'>{planName}</span>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-600'>{to('planOverview.studentSeats')}</p>
              <p className='mt-1 text-2xl font-bold text-green-600'>{maxStudentSeats}</p>
              <p className='text-xs text-slate-500'>{to('planOverview.maximumCapacity')}</p>
            </div>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
              <GraduationCap className='h-5 w-5 text-green-600' />
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-slate-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4'>
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-xs font-medium text-slate-600'>{to('planOverview.teacherSeats')}</p>
              <p className='mt-1 text-2xl font-bold text-orange-600'>{maxTeacherSeats}</p>
              <p className='text-xs text-slate-500'>{to('planOverview.maximumCapacity')}</p>
            </div>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
              <Users className='h-5 w-5 text-orange-600' />
            </div>
          </div>
        </div>
      </div>

      {planDescription && (
        <div className='rounded-lg border border-slate-200 bg-slate-50 p-4'>
          <p className='text-xs font-medium text-slate-600'>{to('planOverview.planDescription')}</p>
          <p className='mt-1 text-sm text-slate-700'>{planDescription}</p>
        </div>
      )}
    </div>
  )
}
