'use client'
import { useModal } from '@/providers/ModalProvider'
import React, { useEffect, useState } from 'react'
import { useSearchCourseQuery } from '../../api/courseApi'
import { useGetCourseAction } from './CourseAction'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useRouter } from 'next/navigation'
import CourseListAction from '@/features/resource/course/components/list/CourseListAction'
import SSelect from '@/components/shared/SSelect'
import { useTranslations } from 'next-intl'
import { CourseStatus } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setParam } from '@/features/resource/course/slice/courseSlice'

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
  const t = useTranslations('CourseList')
  const dispatch = useAppDispatch()
  const courseStatusSelected = useAppSelector((state) => state.course.status)
  const columns = useGetCourseAction()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data } = useSearchCourseQuery({
    search: debouncedSearchQuery,
    status: courseStatusSelected
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    router.push('/admin/course/create')
  }

  const courseStatusOptions = Object.values(CourseStatus).map((status) => ({
    label: status,
    value: status
  }))

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <div className='flex gap-2'>
          <Input
            placeholder='Search courses...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-sm'
          />
          <SSelect
            placeholder={'Course Status'}
            value={courseStatusSelected ?? CourseStatus.PUBLISHED}
            onChange={(val) => dispatch(setParam({ key: 'status', value: val }))}
            options={courseStatusOptions}
          />
        </div>
        <Button size={'icon'} className='bg-amber-custom-400 cursor-pointer rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>

      <DataTable data={rows} columns={columns} enableRowSelection />
    </div>
  )
}
