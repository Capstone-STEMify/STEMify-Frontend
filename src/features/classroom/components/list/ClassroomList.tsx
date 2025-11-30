'use client'

import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent } from '@/components/shadcn/card'
import { Users, BookOpen, Clock, GraduationCap } from 'lucide-react'
import { format } from 'date-fns'
import React, { useState } from 'react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import Link from 'next/link'
import { useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import SearchBar from '@/components/shared/search/SearchBar'

import SSelect from '@/components/shared/SSelect'
import { useLocale, useTranslations } from 'next-intl'
import { formatDate } from '@/utils/index'

export default function ClassroomList() {
  const tClassroom = useTranslations('classroom')
  const locale = useLocale()

  const user = useAppSelector((state) => state.auth?.user)
  const queryParams = useAppSelector((state) => state.classroom)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const classroomQueryParams = {
    ...queryParams,
    status: selectedStatus || undefined
  }

  const { data, isLoading, error } = useSearchClassroomsQuery({
    ...queryParams,
    studentId: user?.userId
  })
  const classrooms = data?.data.items || []

  if (isLoading) {
    return (
      <div className='my-5 grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3'>
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
        <SkeletonCard size='md' />
      </div>
    )
  }

  if (error || !classrooms || classrooms.length === 0) {
    return (
      <div className='mt-5 rounded-2xl border-1 border-gray-300 bg-white p-10 shadow-sm'>
        <SEmpty title='No Classrooms Found' description="You don't have any classrooms yet." />
      </div>
    )
  }

  const statusOptions = Object.values(ClassroomStatus).map((status) => ({
    value: status,
    label: status
  }))

  return (
    <div className='mb-10 space-y-5 pt-4'>
      {/* Header */}

      <div className='flex gap-3'>
        <SearchBar className='w-80 rounded-lg' />
        <SSelect
          placeholder='Filter by status'
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
          options={statusOptions}
          className='w-fit'
        />
      </div>

      {/* Classroom Grid */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {classrooms.map((classroom) => (
          <Link key={classroom.id} href={`/classroom/${classroom.id}`}>
            <Card className='group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg'>
              {/* Image Header */}
              <div className='relative h-32 w-full overflow-hidden bg-gradient-to-br from-sky-200 to-blue-500'>
                {classroom.course?.imageUrl ? (
                  <img
                    src={classroom.course.imageUrl}
                    alt={classroom.name}
                    className='h-full w-full object-cover transition-transform group-hover:scale-105'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center'>
                    <GraduationCap className='h-12 w-12 text-white/60' />
                  </div>
                )}

                {/* Status Badge */}
                <div className='absolute top-3 right-3'>
                  <Badge className={`border-0 text-xs shadow-md ${getStatusBadgeClass(classroom.status)}`}>
                    {classroom.status}
                  </Badge>
                </div>
              </div>

              <CardContent className='p-4'>
                <div className='space-y-3'>
                  {/* Title & Grade */}
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='text-md line-clamp-2 flex-1 font-bold text-gray-900'>{classroom.name}</h3>
                    <Badge variant='secondary' className='shrink-0 bg-gray-100 text-xs font-medium'>
                      {classroom.grade}
                    </Badge>
                  </div>

                  {/* Curriculum */}
                  {classroom.course && (
                    <div className='text-md flex items-center gap-2 text-gray-600'>
                      <BookOpen className='h-4 w-4 shrink-0 text-purple-500' />
                      <span className='text-md line-clamp-1'>{classroom.course.title}</span>
                    </div>
                  )}

                  {/* Date */}
                  <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <Clock className='h-3.5 w-3.5 shrink-0' />
                    <span>
                      {formatDate(classroom.startDate, { locale: locale })} -{' '}
                      {formatDate(classroom.endDate, { locale: locale })}
                    </span>
                  </div>

                  {/* Students */}
                  <div className='flex items-center justify-between border-t border-gray-100 pt-3'>
                    <div className='flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1'>
                      <Users className='h-3.5 w-3.5 text-blue-600' />
                      <span className='text-xs font-semibold text-blue-600'>{classroom.numberOfStudents}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
