import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { EllipsisVertical, GripVertical, PlusCircle } from 'lucide-react'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteLessonMutation, useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useEffect, useMemo, useState } from 'react'
import { SDropDown } from '@/components/shared/SDropDown'
import { UserRole } from '@/types/userRole'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'

// --- dnd-kit imports ---
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Lesson } from '@/features/resource/lesson/types/lesson.type'
import { Button } from '@/components/shadcn/button'
import { useUpdateCourseWithFormDataMutation } from '@/features/resource/course/api/courseApi'

function SortableLessonCard({
  lesson,
  children,
  disabled
}: {
  lesson: any
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
  const router = useRouter()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const userRole = auth.user?.role || UserRole.GUEST

  const lessonsQuery = useAppSelector((state) => state.lesson)
  useEffect(() => {
    dispatch(setPageSize(8))
  }, [dispatch])

  const params = useParams()
  const courseId = params.courseId

  const { data: lessons } = useSearchLessonQuery({ ...lessonsQuery, courseId: Number(courseId) })
  const [deleteLesson] = useDeleteLessonMutation()
  const [updateCourseLessonOrder] = useUpdateCourseWithFormDataMutation()

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
      const lessonIds = items.map((item) => item.id)
      const formData = new FormData()
      lessonIds.forEach((id) => formData.append('orderedLessonIds', String(id)))
      await updateCourseLessonOrder({
        id: Number(courseId),
        body: formData
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
                <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>No Lessons Found</h2>
                <p className='text-lg text-gray-600'>There are currently no lessons available for this course.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mt-30 mb-12 text-center'>
              <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Lesson Content</h2>
              <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
                Engaging activities designed to inspire learning and growth
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div
                className='shadow-6 mx-auto mb-30 flex h-[350px] w-[264px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 px-4 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
                onClick={() => openModal('upsertLesson', { courseIdModal: Number(courseId) })}
              >
                <PlusCircle size={70} className='text-gray-500' />
                <p className='mt-4 text-sm font-medium text-gray-500'>Create New Lesson</p>
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
          <h2 className='my-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>Lesson Content</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            Engaging activities designed to inspire learning and growth
          </p>
        </div>
        {!isReadOnly && (
          <div className='mb-4 flex justify-end gap-2 px-4 lg:px-8'>
            <Button variant={'ghost'} onClick={() => setItems(lessons?.data?.items || [])}>
              Cancel
            </Button>
            <Button className='bg-amber-custom-400' onClick={handleSaveOrder}>
              Save Order
            </Button>
          </div>
        )}

        {isReadOnly ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {items.map((lesson) => (
              <CardLayout key={lesson.id} imageSrc={lesson.imageUrl || '/images/fallback.png'}>
                <div className='flex min-h-0 flex-1 flex-col'>
                  {/* no dropdown for read-only */}
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {items.map((lesson) => (
                  <SortableLessonCard key={lesson.id} lesson={lesson} disabled={false}>
                    <CardLayout imageSrc={lesson.imageUrl || '/images/fallback.png'}>
                      <div className='flex min-h-0 flex-1 flex-col'>
                        <div className='absolute top-2 right-2 text-white'>
                          <SDropDown
                            trigger={
                              <EllipsisVertical className='mt-2 h-5 w-5 text-white hover:scale-[1.1] hover:text-yellow-400' />
                            }
                            items={[
                              <p
                                key='view-detail'
                                className='text-sm'
                                onClick={() => router.push(`/resource/lesson/${lesson.id}`)}
                              >
                                View Detail
                              </p>,
                              <p onClick={() => handleNavigateUpsertLesson(lesson.id)} key='update' className='text-sm'>
                                Update Lesson
                              </p>,
                              <p
                                key='delete-lesson'
                                className='text-sm'
                                onClick={() =>
                                  openModal('confirm', {
                                    message: 'Are you sure you want to delete this lesson?',
                                    onConfirm: () => handleDeleteLesson(lesson.id)
                                  })
                                }
                              >
                                Delete Lesson
                              </p>
                            ]}
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
                  </SortableLessonCard>
                ))}

                {/* Create card */}
                <div
                  className='shadow-6 mr-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
                  onClick={() => openModal('upsertLesson', { courseIdModal: Number(courseId) })}
                >
                  <PlusCircle size={70} className='text-gray-500' />
                  <p className='mt-4 text-sm font-medium text-gray-500'>Create New Lesson</p>
                </div>
              </div>
            </SortableContext>
          </DndContext>
        )}

        {lessons.data.totalPages > 1 && (
          <SPagination
            pageNumber={lessons.data.pageNumber}
            totalPages={lessons.data.totalPages}
            onPageChanged={handlePageChange}
            className='mt-10'
          />
        )}
      </div>
    </motion.section>
  )
}
