'use client'
import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetLessonAction } from './LessonAction'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonQueryParams } from '@/features/resource/lesson/types/lesson.type'
import LessonListAction from '../list/LessonListAction'
import { Button } from '@/components/shadcn/button'
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
  const handleCreate = () => {
    router.push(`/admin/lesson/create?courseId=${courseIdSelected}`)
  }

  return (
    <div>
      <LessonListAction />
      {courseIdSelected && (
        <Button
          variant='outline'
          size='sm'
          className='bg-amber-custom-400 my-5 cursor-pointer text-white'
          onClick={handleCreate}
        >
          <IconPlus />
          <span className='hidden lg:inline'>Add New</span>
        </Button>
      )}

      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        className='mt-5'
      />
    </div>
  )
}
