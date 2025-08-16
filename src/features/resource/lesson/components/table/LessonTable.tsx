'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetLessonAction } from './LessonAction'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize, setParam } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonQueryParams, LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import LessonListAction from '../list/LessonListAction'

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

export default function LessonTable({ courseIdSelected }: { courseIdSelected?: number }) {
  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)
  const columns = useGetLessonAction()
  const router = useRouter()

  const queryParams: LessonQueryParams = {
    courseId: courseIdSelected || lessonParams.courseId,
    createdByUserId: lessonParams.createdByUserId,
    ageRangeId: lessonParams.ageRangeId,
    topicId: lessonParams.topicId,
    skillId: lessonParams.skillId,
    standardId: lessonParams.standardId,
    pageNumber: lessonParams.pageNumber,
    pageSize: lessonParams.pageSize,
    search: lessonParams.search,
    status: lessonParams.status
  }

  useEffect(() => {
    dispatch(setPageSize(10))
  }, [dispatch])

  const { data } = useSearchLessonQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  return (
    <div className='space-y-10'>
      <LessonListAction />

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
