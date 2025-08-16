'use client'
import { useModal } from '@/providers/ModalProvider'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetLessonAction } from './LessonAction'
import { useSearchLessonQuery } from '../../api/lessonApi'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import SSelect from '@/components/shared/SSelect'
import { setParam } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonStatus } from '@/features/resource/lesson/types/lesson.type'

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

export default function LessonTable() {
  const dispatch = useAppDispatch()
  const lessonStatusSelected = useAppSelector((state) => state.lesson.status)
  const courseIdSelected = useAppSelector((state) => state.lesson.courseId)
  const { openModal } = useModal()
  const columns = useGetLessonAction()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data } = useSearchLessonQuery({
    search: debouncedSearchQuery,
    status: lessonStatusSelected,
    courseId: courseIdSelected
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    router.push('/admin/lesson/create')
  }

  const lessonStatusOptions = Object.values(LessonStatus).map((status) => ({
    label: status,
    value: status
  }))

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <div className='flex gap-2'>
          <Input
            placeholder='Search lessons...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-sm'
          />
          <SSelect
            placeholder={'Lesson Status'}
            value={lessonStatusSelected ?? LessonStatus.PUBLISHED}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val }))}
            options={lessonStatusOptions}
          />
        </div>
        {/* <Button size={'icon'} className='bg-amber-custom-400 cursor-pointer rounded-full' onClick={handleCreate}>
          <Plus />
        </Button> */}
      </div>
      <DataTable data={rows} columns={columns} enableRowSelection />
    </div>
  )
}
