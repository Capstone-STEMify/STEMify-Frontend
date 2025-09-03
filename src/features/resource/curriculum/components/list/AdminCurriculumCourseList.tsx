import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useGetCourseColumn } from '@/features/resource/course/components/list/CourseColum'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { Course, CourseQueryParams } from '@/features/resource/course/types/course.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'

type AdminCurriculumCourseListProps = {
  curriculumId: number
  courses?: Course[]
}

export default function AdminCurriculumCourseList({ curriculumId, courses }: AdminCurriculumCourseListProps) {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const t = useTranslations('curriculum')
  const columns = useGetCourseColumn({ isPopup: false })
  const visibleKeys = ['select', 'code', 'title', 'imageUrl', 'description', 'actions']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )

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
    dispatch(setPageSize(50))
  }, [dispatch])

  const { data } = useSearchCourseQuery(queryParams)

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  return (
    <div>
      <h2 className='text-center text-3xl'>{t('list.courseListTitle')}</h2>
      <Button
        className='bg-amber-custom-400 mb-5'
        onClick={() => {
          openModal('curriculumSelectCourseListModal', { curriculumId })
        }}
      >
        <Plus className='mr-1 h-4 w-4' />
        {t('details.addCourse')}
      </Button>
      <DataTable
        data={courses || []}
        columns={filteredColumns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
