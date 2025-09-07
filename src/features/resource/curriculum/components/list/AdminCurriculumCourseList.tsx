import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchCourseQuery } from '@/features/resource/course/api/courseApi'
import { useGetCourseColumn } from '@/features/resource/course/components/list/CourseColum'
import { setPageIndex, setPageSize } from '@/features/resource/course/slice/courseSlice'
import { Course, CourseQueryParams } from '@/features/resource/course/types/course.type'
import { useUpdateCourseOrderMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type AdminCurriculumCourseListProps = {
  curriculumId: number
  courses?: Course[]
}

export default function AdminCurriculumCourseList({ curriculumId, courses }: AdminCurriculumCourseListProps) {
  const t = useTranslations('curriculum')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const columns = useGetCourseColumn({ isPopup: false })

  const [orderedCourseIds, setOrderedCourseIds] = React.useState<number[]>([])

  const visibleKeys = ['select', 'code', 'title', 'imageUrl', 'description', 'actions', 'drag']
  const filteredColumns = columns.filter((col) => {
    const key = 'accessorKey' in col ? col.accessorKey : col.id
    return key ? visibleKeys.includes(key as string) : false
  })

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
  const [updateCourseOrder] = useUpdateCourseOrderMutation()
  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleSaveOrder = async () => {
    try {
      await updateCourseOrder({
        curriculumId,
        orderedCourseIds
      }).unwrap()
      toast.success(tt('successMessage.saveOrder'))
      setOrderedCourseIds([])
    } catch (e) {
      toast.error(tt('errorMessage'))
    }
  }

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.courseListTitle')}{' '}
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{data?.data.totalCount}</span>
        </h2>

        <div className='flex justify-end space-x-2'>
          {orderedCourseIds.length > 0 && (
            <Button className='bg-emerald-400' onClick={handleSaveOrder}>
              <Plus className='mr-1 h-4 w-4' />
              {tc('button.order')}
            </Button>
          )}

          <Button
            className='bg-amber-custom-400'
            onClick={() => {
              openModal('curriculumSelectCourseListModal', { curriculumId })
            }}
          >
            <Plus className='mr-1 h-4 w-4' />
            {t('details.addCourse')}
          </Button>
        </div>
      </div>

      <DataTable
        data={courses || []}
        columns={filteredColumns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        enableDnd
        onReorder={(data) => {
          const orderCourseIds = data.map((item) => item.id)
          setOrderedCourseIds(orderCourseIds)
        }}
      />
    </div>
  )
}
