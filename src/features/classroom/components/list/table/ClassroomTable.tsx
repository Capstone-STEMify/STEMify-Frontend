'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetClassroomColumn } from '@/features/classroom/components/list/table/ClassroomColumn'
import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { useModal } from '@/providers/ModalProvider'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Input } from '@/components/shadcn/input'
import SSelect from '@/components/shared/SSelect'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setParam, setSearchTerm } from '@/features/classroom/slice/classroomSlice'
import useDebounce from '@/hooks/useDebounce'
import { SingleSelectWithSearch } from '@/components/shared/SingleSelectWithSearch'
import { getOptions } from '@/utils/index'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'

export default function ClassroomTable() {
  const tClassroom = useTranslations('classroom')
  const tc = useTranslations('common')

  const router = useRouter()
  const locale = useLocale()
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')

  const queryParams = useAppSelector((state) => state.classroom)
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const debouncedSearchQuery = useDebounce(search, 500)
  const { data } = useSearchClassroomsQuery({ ...queryParams, organizationId: organizationId })

  // Xử lý data để merge course cells
  const rows = React.useMemo(() => {
    const items = data?.data.items ?? []

    const sorted = [...items].sort((a, b) => a.course.id - b.course.id)

    const courseGroups = new Map<number, number>()
    sorted.forEach((item) => {
      const courseId = item.course.id
      courseGroups.set(courseId, (courseGroups.get(courseId) || 0) + 1)
    })

    // Thêm meta data cho mỗi row để biết cell nào cần merge
    let currentcourseId: number | null = null
    let courseRowCount = 0

    return sorted.map((item, index) => {
      const courseId = item.course.id
      const isNewcourse = courseId !== currentcourseId

      // Meta data cho course cell
      const cellMeta: any = {
        course: isNewcourse ? { rowSpan: courseGroups.get(courseId) || 1, skip: false } : { skip: true }
      }

      if (isNewcourse) {
        currentcourseId = courseId
        courseRowCount = 0
      }
      courseRowCount++

      return {
        ...item,
        __cellMeta: cellMeta
      }
    })
  }, [data])

  const columns = useGetClassroomColumn()

  const searchcourseQuery = useAppSelector((state) => state.course)
  const { data: courseData } = useSearchCourseQuery({
    ...searchcourseQuery
  })

  const statusOptions = [
    { label: tc('status.upcoming'), value: 'upcoming' },
    { label: tc('status.inprogress'), value: 'inprogress' },
    { label: tc('status.endsoon'), value: 'endsoon' },
    { label: tc('status.completed'), value: 'completed' }
  ]

  const courseOptions = getOptions(courseData?.data.items, 'title', 'imageUrl', 'courseCount').map((opt) => ({
    ...opt,
    subLabel: opt.subLabel ? `${opt.subLabel} ${tClassroom('list.courses')}` : undefined
  }))

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  return (
    <div className='mt-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{tClassroom('list.header')}</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => dispatch(resetParams())} className='hover:bg-slate-100'>
            {tc('button.clearFilters')}
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
            style={{ width: '320px' }}
          />
          <SingleSelectWithSearch
            value={queryParams.courseId?.toString() ?? ''}
            options={courseOptions}
            placeholder={tClassroom('list.selectCoursePlaceholder')}
            onChange={(val) => dispatch(setParam({ key: 'courseId', value: Number(val) }))}
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
          router.push(`/${locale}/organization/classroom/${val.id}`)
        }}
      />
    </div>
  )
}
