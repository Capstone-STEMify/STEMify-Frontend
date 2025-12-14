'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetClassroomColumn } from '@/features/classroom/components/list/table/ClassroomColumn'
import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { useParams, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/shadcn/input'
import SSelect from '@/components/shared/SSelect'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setParam, setSearchTerm } from '@/features/classroom/slice/classroomSlice'
import useDebounce from '@/hooks/useDebounce'
import { getOptions } from '@/utils/index'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useGetOrganizationCourseClassroomColumn } from '@/features/resource/course/components/detail/organization/OrganizationCourseClassroomCoulum'
import { setCourseId } from '@/features/organization/slice/organizationSpecialSlice'

export default function OrganizationCourseClassroom() {
  const router = useRouter()
  const locale = useLocale()

  const { courseId } = useParams()

  const tc = useTranslations('common')
  const tClassroom = useTranslations('classroom')

  const [search, setSearch] = useState<string>('')

  const dispatch = useAppDispatch()
  const queryParams = useAppSelector((state) => state.classroom)
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const debouncedSearchQuery = useDebounce(search, 500)
  const { data } = useSearchClassroomsQuery({
    ...queryParams,
    organizationId: organizationId,
    courseId: Number(courseId),
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])
  const columns = useGetOrganizationCourseClassroomColumn()

  const statusOptions = [
    { label: tc('status.upcoming'), value: 'upcoming' },
    { label: tc('status.inprogress'), value: 'inprogress' },
    { label: tc('status.endsoon'), value: 'endsoon' },
    { label: tc('status.completed'), value: 'completed' }
  ]

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  return (
    <div className='mt-5 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{tClassroom('list.header')}</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => dispatch(resetParams())} className='hover:bg-slate-100'>
            {tc('button.clearFilters')}
          </Button>
          <Button
            className='bg-sky-600 text-white hover:bg-sky-700'
            onClick={() => {
              dispatch(setCourseId(Number(courseId)))
              router.push(`/${locale}/organization/classroom/create?courseId=${courseId}`)
            }}
          >
            + {tc('button.createClassroom')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex gap-2'>
          <Input
            type='text'
            placeholder={tClassroom('list.searchPlaceholder')}
            onChange={(e) => setSearch(e.target.value)}
            className='w-80 bg-white py-4.5'
            style={{ width: '420px' }}
          />
        </div>
        <div className='flex gap-2'>
          <SSelect
            placeholder={tc('status.filterBy')}
            value={queryParams.status ?? ''}
            onChange={(val) =>
              dispatch(setParam({ key: 'status', value: val as 'upcoming' | 'inprogress' | 'endsoon' | 'completed' }))
            }
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        enableRowSelection={false}
        data={rows}
        columns={columns}
        pagingData={data?.data.items}
        pagingParams={queryParams}
        handlePageChange={() => {}}
        onRowClick={(val) => {
          console.log(val)
          router.push(`/${locale}/organization/classroom/${val.id}`)
        }}
      />
    </div>
  )
}
