'use client'
import React, { useEffect, useState } from 'react'
import { useSearchCourseQuery } from '../../api/courseApi'
import { useGetCourseAction } from './CourseAction'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useRouter } from 'next/navigation'
import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import { useTranslations } from 'next-intl'
import { CourseQueryParams, CourseStatus } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize, setParam } from '@/features/resource/course/slice/courseSlice'
import { IconPlus } from '@tabler/icons-react'

// Debounce hook to delay API calls
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export default function CourseTable() {
  const t = useTranslations('Admin')
  const dispatch = useAppDispatch()
  const courseParams = useAppSelector((state) => state.course)
  const columns = useGetCourseAction()
  const router = useRouter()

  const queryParams: CourseQueryParams = {
    courseId: courseParams.courseId,
    createdByUserId: courseParams.createdByUserId,
    ageRangeId: courseParams.ageRangeId,
    topicId: courseParams.topicId,
    skillId: courseParams.skillId,
    standardId: courseParams.standardId,
    pageNumber: courseParams.pageNumber,
    pageSize: courseParams.pageSize,
    search: courseParams.search,
    status: courseParams.status
  }

  useEffect(() => {
    dispatch(setPageSize(10))
  }, [dispatch])

  const { data } = useSearchCourseQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    router.push('/admin/course/create')
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  return (
    <div>
      {/* <CourseFilter /> */}
      <CourseListAction />
      <Button
        variant='outline'
        size='sm'
        className='bg-amber-custom-400 my-5 cursor-pointer text-white'
        onClick={handleCreate}
      >
        <IconPlus />
        <span className='hidden lg:inline'>{t('course_management.button')}</span>
      </Button>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
