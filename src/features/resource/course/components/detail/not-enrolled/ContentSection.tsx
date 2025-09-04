import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { capitalizeFirst, formatDuration } from '@/utils/index'
import { Ellipsis, EllipsisVertical, GripVertical, PlusCircle } from 'lucide-react'
import { SPagination } from '@/components/shared/SPagination'
import {
  useDeleteLessonMutation,
  useSearchLessonQuery,
  useUpdateLessonMutation
} from '@/features/resource/lesson/api/lessonApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useEffect, useMemo, useState } from 'react'
import { SDropDown } from '@/components/shared/SDropDown'
import { UserRole } from '@/types/userRole'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lesson, LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import { Button } from '@/components/shadcn/button'
import { useUpdateLessonOrderMutation } from '@/features/resource/course/api/courseApi'
import Link from 'next/link'
import { getStatusBadgeClass } from '@/utils/badgeColor'

function SortableLessonCard({
  lesson,
  children,
  disabled
}: {
  lesson: Lesson
  children: React.ReactNode
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lesson.id,
    disabled
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : undefined
  }

  return (
    <div ref={setNodeRef} style={style} className='relative'>
      {/* Drag handle only shown when enabled */}
      {!disabled && (
        <button
          aria-label='Drag to reorder'
          className='absolute top-2 left-2 z-50 inline-flex items-center justify-center rounded-md bg-black/40 p-1 text-white hover:bg-black/60'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4' />
        </button>
      )}
      {children}
    </div>
  )
}

export default function ContentSection() {
  const t = useTranslations('CourseDetails')
  const tc = useTranslations('common')
  const router = useRouter()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST

  const lessonsQuery = useAppSelector((state) => state.lesson)
  useEffect(() => {
    dispatch(setPageSize(50))
  }, [dispatch])

  const { courseId } = useParams()
  console.log(courseId)
  // const courseId = params.courseId

  const { data: lessons } = useSearchLessonQuery({
    ...lessonsQuery,
    courseId: Number(courseId),
    orderBy: 'orderindex',
    sortDirection: 'Asc'
  })
  const [deleteLesson] = useDeleteLessonMutation()
  const [updateCourseLessonOrder] = useUpdateLessonOrderMutation()
  const [sendLessonRequest] = useUpdateLessonMutation()

  const [items, setItems] = useState<Lesson[]>([])

  useEffect(() => {
    if (lessons?.data?.items) setItems(lessons.data.items)
  }, [lessons?.data?.items])

  const isReadOnly = userRole === UserRole.STUDENT || userRole === UserRole.GUEST

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }
  const handleNavigateUpsertLesson = (lessonId?: number) => {
    if (lessonId) {
      router.push(`/resource/lesson/update/${lessonId}`)
    } else {
      router.push(`/resource/lesson/create?courseId=${courseId}`)
    }
  }

  const handleSendLessonRequest = async (lessonId: number) => {
    try {
      await sendLessonRequest({
        id: lessonId,
        body: { courseId: Number(courseId), status: LessonStatus.PENDING }
      }).unwrap()
      toast.success('Lesson submitted for review')
    } catch (error) {
      toast.error('Failed to submit lesson for review')
      console.error('Send lesson request error:', error)
    }
  }

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      await deleteLesson(lessonId).unwrap()
      toast.success('Lesson deleted successfully')
    } catch (error) {
      toast.error('Failed to delete lesson')
      console.error('Delete lesson error:', error)
    }
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    const newItems = arrayMove(items, oldIndex, newIndex)
    setItems(newItems)
  }

  const handleSaveOrder = async () => {
    try {
      const orderedLessonIds = items.map((item) => item.id)
      await updateCourseLessonOrder({
        id: Number(courseId),
        orderedLessonIds
      }).unwrap()
      toast.success('Lesson order saved successfully')
    } catch (e) {
      toast.error('Failed to save lesson order')
    }
  }

  if (!lessons?.data || lessons.data.items.length === 0) {
    return (
      <>
        {isReadOnly ? (
          <div className='bg-white py-12'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='text-center'>
                <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  {t('notEnrolled.notFound.title')}
                </h2>
                <p className='text-lg text-gray-600'>{t('notEnrolled.notFound.description')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mt-30 mb-12 text-center'>
              <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                {t('notEnrolled.lesson.title')}
              </h2>
              <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>{t('notEnrolled.lesson.description')}</p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div
                className='shadow-6 mx-auto mb-30 flex h-[350px] w-[264px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 px-4 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
                onClick={() => router.push(`/resource/lesson/create?courseId=${courseId}`)}
              >
                <PlusCircle size={70} className='text-gray-500' />
                <p className='mt-4 text-sm font-medium text-gray-500'>{tc('button.createLesson')}</p>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <motion.section
      id='lessons'
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={fadeInUp}
      className='bg-white py-30'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {t('notEnrolled.lesson.title')}
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>{t('notEnrolled.lesson.description')}</p>
        </div>
        {!isReadOnly && (
          <div className='mb-4 flex justify-end gap-2 px-4 lg:px-8'>
            <Button variant={'ghost'} onClick={() => setItems(lessons?.data?.items || [])}>
              {tc('button.cancel')}
            </Button>
            <Button className='bg-amber-custom-400' onClick={handleSaveOrder}>
              {tc('button.order')}
            </Button>
          </div>
        )}

        {isReadOnly ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {items.map((lesson) => (
              <CardLayout key={lesson.id} imageSrc={lesson.imageUrl || '/images/fallback.png'}>
                <div className='flex min-h-0 flex-1 flex-col'>
                  <h3 className='line-clamp-1 text-lg font-semibold'>{lesson.title}</h3>
                  <p className='line-clamp-4 text-sm text-gray-600'>{lesson.description}</p>
                  <div className='mt-auto flex items-center gap-2'>
                    <Badge className='bg-blue-100 text-blue-800'>{lesson.ageRangeLabel}</Badge>
                    <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
                  </div>
                </div>
              </CardLayout>
            ))}
          </div>
        ) : (
          <div>
            {/* Create card */}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                  <div
                    className='shadow-6 mr-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
                    onClick={() => {
                      router.push(`/resource/lesson/create?courseId=${courseId}`)
                    }}
                  >
                    <PlusCircle size={70} className='mt-20 text-gray-500' />
                    <p className='mt-4 mb-20 text-sm font-medium text-gray-500'>
                      {tc('button.createLesson')}
                    </p>
                  </div>
                  {items.map((lesson) => (
                    <SortableLessonCard key={lesson.id} lesson={lesson} disabled={false}>
                      <Link href={`/resource/lesson/${lesson.id}`}>
                        <CardLayout
                          imageSrc={lesson.imageUrl || '/images/fallback.png'}
                          infor={
                            <Badge className={`${getStatusBadgeClass(lesson.status)}`}>
                              {capitalizeFirst(lesson.status)}
                            </Badge>
                          }
                        >
                          <div className='flex min-h-0 flex-1 flex-col'>
                            <div className='absolute top-2 right-2 text-white'>
                              <SDropDown
                                trigger={<EllipsisVertical className='h-6.5 w-5 rounded-sm bg-gray-400 text-white' />}
                                items={[
                                  <p
                                    key={`view-detail-${lesson.id}`}
                                    className='text-sm'
                                    onClick={() => router.push(`/resource/lesson/${lesson.id}`)}
                                  >
                                    {tc('button.view')}
                                  </p>,
                                  <p
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleNavigateUpsertLesson(lesson.id)
                                    }}
                                    key='update'
                                    className='text-sm'
                                  >
                                    {tc('button.updateLesson')}
                                  </p>,
                                  lesson.status === LessonStatus.DRAFT ? (
                                    <p
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSendLessonRequest(lesson.id)
                                      }}
                                      key={`send-request-${lesson.id}`}
                                      className='text-sm'
                                    >
                                      {tc('button.sendRequest')}
                                    </p>
                                  ) : null,
                                  lesson.status === LessonStatus.DRAFT ? (
                                    <p
                                      key={`delete-lesson-${lesson.id}`}
                                      className='text-sm'
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openModal('confirm', {
                                          message: `${tc('button.deleteConfirm')}`,
                                          onConfirm: () => handleDeleteLesson(lesson.id)
                                        })
                                      }}
                                    >
                                      {tc('button.deleteLesson')}
                                    </p>
                                  ) : null
                                ].filter(Boolean)}
                              />
                            </div>
                            <h3 className='line-clamp-1 text-lg font-semibold'>{lesson.title}</h3>
                            <p className='line-clamp-4 text-sm text-gray-600'>{lesson.description}</p>
                            <div className='mt-auto flex items-center gap-2'>
                              <Badge className='bg-blue-100 text-blue-800'>{lesson.ageRangeLabel}</Badge>
                              <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
                            </div>
                          </div>
                        </CardLayout>
                      </Link>
                    </SortableLessonCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* {lessons.data.totalPages > 1 && (
          <SPagination
            pageNumber={lessons.data.pageNumber}
            totalPages={lessons.data.totalPages}
            onPageChanged={handlePageChange}
            className='mt-10'
          />
        )} */}
      </div>
    </motion.section>
  )
}
