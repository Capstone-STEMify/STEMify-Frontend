import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import SearchBar from '@/components/shared/search/SearchBar'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useGetCourseColumn } from '@/features/resource/course/components/list/CourseColum'
import { setPageIndex, setPageSize, setSearchTerm } from '@/features/resource/course/slice/courseSlice'
import { CourseQueryParams } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'

export default function AdminCurriculumSelectCourseList() {
  const tc = useTranslations('common')
  const dispatch = useAppDispatch()
  const columns = useGetCourseColumn({ isPopup: true })
  const visibleKeys = ['select', 'code', 'title', 'imageUrl']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )
  const [selectedIds, setSelectedIds] = React.useState<(number | string)[]>([])
  const courseParams = useAppSelector((state) => state.course)

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
    status: courseParams.status,
    orderBy: 'createdDate',
    sortDirection: 'Desc'
  }

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const { data } = useSearchCourseQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (!data) return null
  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <SearchBar
          className='w-72'
          placeholder='Enter course title'
          onDebouncedSearch={(value) => dispatch(setSearchTerm(value))}
        />

        <div className='flex items-center gap-2'>
          <Badge variant={'outline'} className='bg-sky-100 text-blue-500'>
            Selected courses: {selectedIds.length}
          </Badge>
          <div>
            <Button variant='ghost'>{tc('button.cancel')}</Button>
            <Button className='bg-amber-custom-400'>{tc('button.save')}</Button>
          </div>
        </div>
      </div>
      <DataTable
        data={rows}
        columns={filteredColumns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        rowSelection={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids)
          console.log('Selected course IDs:', ids)
        }}
      />
    </div>
  )
}
