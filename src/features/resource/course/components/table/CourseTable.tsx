'use client'
import { useModal } from '@/providers/ModalProvider'
import React, { useEffect, useState } from 'react'
import { useSearchCourseQuery } from '../../api/courseApi'
import { useGetCourseAction } from './CourseAction'
import { Input } from '@/components/shadcn/input'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'

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
  const { openModal } = useModal()
  const columns = useGetCourseAction()

  const [searchQuery, setSearchQuery] = useState('')
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data } = useSearchCourseQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {}

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder='Search courses...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable data={rows} columns={columns} enableRowSelection />
    </div>
  )
}
