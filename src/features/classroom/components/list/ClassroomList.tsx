'use client'

import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { ClassroomStatus } from '@/features/classroom/types/classroom.type'
import { Badge } from '@/components/shadcn/badge'
import { Card, CardContent } from '@/components/shadcn/card'
import { Users, BookOpen, Clock, GraduationCap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import SearchBar from '@/components/shared/search/SearchBar'

import SSelect from '@/components/shared/SSelect'
import { useLocale, useTranslations } from 'next-intl'
import { formatDate, useStatusTranslation } from '@/utils/index'
import { resetParams } from '@/features/classroom/slice/classroomSlice'

export default function ClassroomList() {
  const locale = useLocale()
  const statusTranslation = useStatusTranslation()
  const tClassroom = useTranslations('classroom')

  const dispatch = useAppDispatch()
  const queryParams = useAppSelector((state) => state.classroom)
  const { selectedOrgUserId } = useAppSelector((state) => state.selectedOrganization)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const statusQuery = statusFilter === 'all' ? undefined : statusFilter

  const { data, isLoading, error } = useSearchClassroomsQuery(
    {
      ...queryParams,
      studentId: selectedOrgUserId,
      search: search || undefined,
      status: statusQuery as ClassroomStatus | undefined
    },
    { skip: !selectedOrgUserId }
  )
  const classrooms = data?.data.items || []

  useEffect(() => {
    dispatch(resetParams())
  }, [dispatch])

  if (error) {
    return (
      <div className='mt-5 rounded-2xl border-1 border-gray-300 bg-white p-10 shadow-sm'>
        <SEmpty title={tClassroom('noClassroom')} description={tClassroom('noClassroomSubtext')} />
      </div>
    )
  }

  const statusOptions = Object.values(ClassroomStatus).map((status) => ({
    value: status,
    label: statusTranslation(status)
  }))

  return (
    <div className='mb-10 space-y-5 pt-4'>
      <div className='flex gap-3'>
        <SearchBar
          className='w-96'
          placeholder={tClassroom('list.searchPlaceholder')}
          onDebouncedSearch={(val) => setSearch(val)}
        />
        <SSelect
          placeholder={tClassroom('list.selectStatusPlaceholder')}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          options={statusOptions.filter(
            (option) => option.value !== ClassroomStatus.DELETED && option.value !== ClassroomStatus.PENDING
          )}
          className='w-48'
        />
      </div>

      {/* Classroom Grid */}
      <div className='grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {classrooms.map((classroom) => (
          <Link key={classroom.id} href={`/classroom/${classroom.id}`}>
            <Card className='flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md'>
              {/* Image Header */}
              <div className='relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-sky-200 to-blue-500'>
                {classroom.course?.imageUrl ? (
                  <img
                    src={classroom.course.imageUrl}
                    alt={classroom.name}
                    className='relative aspect-[4/3] w-full overflow-hidden'
                    sizes='(max-width: 768px) 100vw, 33vw'
                  />
                ) : (
                  <div className='flex h-full w-full items-center justify-center'>
                    <GraduationCap className='h-12 w-12 text-white/60' />
                  </div>
                )}
              </div>

              <CardContent className='p-4'>
                <div className='space-y-3'>
                  {/* Title & Grade */}
                  <div className='flex items-start justify-between gap-2'>
                    <h3 className='text-md line-clamp-2 flex-1 font-bold text-gray-900'>{classroom.name}</h3>
                    {/* Status Badge */}
                    <Badge
                      className={`border-0 text-xs text-white shadow-md ${getStatusBadgeClass(classroom.status.toLocaleLowerCase())}`}
                    >
                      {statusTranslation(classroom.status)}
                    </Badge>
                  </div>

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
                      {formatDate(classroom.startDate, { locale })} - {formatDate(classroom.endDate, { locale })}
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
