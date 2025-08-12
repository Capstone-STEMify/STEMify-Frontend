import { motion } from 'framer-motion'
import { fadeInUp } from '@/utils/motion'
import CardLayout from '@/components/shared/card/CardLayout'
import { Badge } from '@/components/shadcn/badge'
import { formatDuration } from '@/utils/index'
import { BookOpen, Clock, EllipsisVertical, PlusCircle, Target } from 'lucide-react'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteLessonMutation, useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useEffect } from 'react'
import { SDropDown } from '@/components/shared/SDropDown'
import { UserRole } from '@/types/userRole'
import { useModal } from '@/providers/ModalProvider'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export default function ContentSection() {
  const t = useTranslations('CourseDetails')
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

  if (!lessons?.data || lessons.data.items.length === 0) {
    return (
      <>
        {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? (
          <div className='bg-white py-12'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
              <div className='text-center'>
                <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>{t('notEnrolled.notFound.title')}</h2>
                <p className='text-lg text-gray-600'>{t('notEnrolled.notFound.description')}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className='mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8'>
            <div className='mt-30 mb-12 text-center'>
              <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>{t('notEnrolled.lesson.title')}</h2>
              <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
                {t('notEnrolled.lesson.description')}
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              <div
                className='shadow-6 mx-auto mb-30 flex h-[350px] w-[264px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 px-4 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
                onClick={() => openModal('upsertLesson', { courseIdModal: Number(courseId) })}
              >
                <PlusCircle size={70} className='text-gray-500' />
                <p className='mt-4 text-sm font-medium text-gray-500'>{t('notEnrolled.button.create')}</p>
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
          <h2 className='mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>{t('notEnrolled.lesson.title')}</h2>
          <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600'>
            {t('notEnrolled.lesson.description')}
          </p>
        </div>

        {/* Lesson Cards Section */}
        {/* use pagination */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {lessons?.data.items.map((lesson, index) => (
            <CardLayout key={index} imageSrc={lesson.imageUrl || '/images/fallback.png'}>
              <div className='flex min-h-0 flex-1 flex-col'>
                {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? null : (
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
                          {t('notEnrolled.lesson.button.view')}
                        </p>,
                        <p onClick={() => handleNavigateUpsertLesson(lesson.id)} key='update' className='text-sm'>
                          {t('notEnrolled.lesson.button.update')}
                        </p>,
                        <p
                          key='delete-lesson'
                          className='text-sm'
                          onClick={() =>
                            openModal('confirm', {
                              message: `${t('notEnrolled.lesson.button.deleteConfirm')}`,
                              onConfirm: () => handleDeleteLesson(lesson.id)
                            })
                          }
                        >
                          {t('notEnrolled.lesson.button.delete')}
                        </p>
                      ]}
                    />
                  </div>
                )}
                <h3 className='line-clamp-1 text-lg font-semibold'>{lesson.title}</h3>
                <p className='line-clamp-4 text-sm text-gray-600'>{lesson.description}</p>
                <div className='mt-auto flex items-center gap-2'>
                  <Badge className='bg-blue-100 text-blue-800'>{lesson.ageRangeLabel}</Badge>
                  <Badge className='bg-green-100 text-green-800'>{formatDuration(lesson.duration)}</Badge>
                </div>
              </div>
            </CardLayout>
          ))}
          {userRole === UserRole.STUDENT || userRole === UserRole.GUEST ? null : (
            <div
              className='shadow-6 mr-5 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition hover:scale-102 hover:border-blue-400 hover:bg-blue-50'
              onClick={() => openModal('upsertLesson', { courseIdModal: Number(courseId) })}
            >
              <PlusCircle size={70} className='text-gray-500' />
              <p className='mt-4 text-sm font-medium text-gray-500'>{t('notEnrolled.lesson.button.create')}</p>
            </div>
          )}
        </div>
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
