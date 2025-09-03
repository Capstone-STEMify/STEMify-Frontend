import { DataTable } from '@/components/shared/data-table/data-table'
import SearchBar from '@/components/shared/search/SearchBar'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useGetCourseAction } from '@/features/resource/course/components/list/CourseAction'
import { setPageIndex, setPageSize, setSearchTerm } from '@/features/resource/course/slice/courseSlice'
import { CourseQueryParams } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import React, { useEffect } from 'react'

export default function AdminCurriculumSelectCourseList() {
  const dispatch = useAppDispatch()
  const columns = useGetCourseAction()

  const courseParams = useAppSelector((state) => state.course)

  const queryParams = React.useMemo(() => {
    const rawParams: CourseQueryParams = {
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

    return Object.fromEntries(
      Object.entries(rawParams).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
    ) as CourseQueryParams
  }, [courseParams])

  useEffect(() => {
    dispatch(setPageIndex(1))
  }, [courseParams.search, courseParams.status, courseParams.ageRangeId])

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])
  console.log('Redux pageNumber', courseParams.pageNumber)
  console.log('Query params', queryParams)
  const { data } = useSearchCourseQuery(queryParams)

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  if (!data) return null
  return (
    <div className='space-y-3'>
      {/* <SearchBar
        className='w-72'
        placeholder='Enter course title'
        onDebouncedSearch={(value) => dispatch(setSearchTerm(value))}
      /> */}
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
