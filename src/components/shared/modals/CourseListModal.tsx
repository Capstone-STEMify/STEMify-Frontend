import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useSearchCourseQuery } from '../../../features/resource/course/api/courseApi'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setPageIndex } from '../../../features/resource/course/slice/courseSlice'
import { useGetCourseAction } from '../../../features/resource/course/components/list/CourseAction'
import CardLayout from '@/components/shared/card/CardLayout'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { Badge } from '@/components/shadcn/badge'
import { getCourseStatusBadgeClass, getLevelBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'

interface CourseListModalProps {
  curriculumId?: number
  onConfirm?: () => void
}

export default function CourseListModal({ curriculumId, onConfirm }: CourseListModalProps) {
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()

  const { data: courseData } = useSearchCourseQuery({ curriculumId })
  const columns = useGetCourseAction()

  const handleSuccess = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }
    closeModal()
  }
  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogTitle></DialogTitle>

      <DialogContent className='h-fit w-full max-w-7xl'>
        <ScrollArea className='h-[600px]'>
          <div className='grid grid-cols-1 justify-items-center gap-y-10 md:grid-cols-4'>
            {courseData?.data.items.map((course) => (
              <CardLayout
                key={course.id}
                imageSrc={course.imageUrl || '/images/fallback.png'}
                size='sm'
                badge={
                  <Badge className={getCourseStatusBadgeClass(course.status)}>{capitalizeFirst(course.status)}</Badge>
                }
              >
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{course.code}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{course.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{course.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-sky-custom-300'>{course.ageRangeLabel}</Badge>
                  <Badge className={getLevelBadgeClass(course.level)}>{capitalizeFirst(course.level)}</Badge>
                </div>
              </CardLayout>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
