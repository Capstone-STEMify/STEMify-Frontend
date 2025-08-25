import React from 'react'
import { motion } from 'framer-motion'
import { Lesson, LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import { itemVariants } from '@/utils/motion'
import { useLocale, useTranslations } from 'next-intl'
import { useAppSelector } from '@/hooks/redux-hooks'
import { Button } from '@/components/shadcn/button'
import Link from 'next/link'
import { UserRole } from '@/types/userRole'
import { useRouter } from 'next/navigation'
import { useUpdateLessonMutation } from '@/features/resource/lesson/api/lessonApi'
import { toast } from 'sonner'

type GuideLessonDetailsProps = {
  lesson: Lesson
}

export default function GuideLessonDetails({ lesson }: GuideLessonDetailsProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('PacingGuide')
  const role = useAppSelector((state) => state.auth.user?.role)

  const [updateLesson] = useUpdateLessonMutation()

  const handleNavigateUpdate = (lessonId: number) => {
    if (role === UserRole.ADMIN) {
      router.push(`/${locale}/admin/lesson/update/${lessonId}`)
    } else if (role === UserRole.STAFF) {
      router.push(`/${locale}/resource/lesson/update/${lessonId}`)
    }
  }

  const handleUpdateLessonStatus = async (lessonId: number, status: LessonStatus) => {
    try {
      await updateLesson({ id: lessonId, body: { status } }).unwrap()
      toast.success(`Lesson status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to update lesson status')
      console.error('Error updating lesson status:', error)
    }
  }

  const fallback = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop'
  return (
    <motion.section initial='hidden' animate='visible' variants={itemVariants} className='space-y-8'>
      <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.7fr_1fr]'>
        <div>
          <h1 className='mt-2 text-3xl font-bold text-gray-900 sm:text-4xl'>{lesson.title}</h1>
          <p className='mt-2 text-sm text-gray-700'>
            By <span className='font-semibold'>{lesson.createdByUserName || 'STEMify'}</span>
          </p>
          <p className='mt-4 whitespace-pre-line text-gray-700'>{lesson.description}</p>

          <hr className='my-6 border-gray-300' />

          <div>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('learningOutcome')}</h3>
            <p className='leading-relaxed whitespace-pre-line text-gray-700'>{lesson.learningOutcome}</p>
          </div>

          <hr className='my-6 border-gray-300' />

          <div>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('requirement')}</h3>
            <p className='leading-relaxed whitespace-pre-line text-gray-700'>
              {lesson.requirement || 'No requirements specified.'}
            </p>
          </div>

          <hr className='my-6 border-gray-300' />

          <div className='mt-8'>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('standards')}</h3>
            <p className='leading-relaxed text-gray-700'>
              {lesson.standardNames.join(', ') || 'No standards specified.'}
            </p>
          </div>

          <div className='mt-6'>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('skills')}</h3>
            <p className='leading-relaxed text-gray-700'>{lesson.skillNames.join(', ') || 'No skills specified.'}</p>
          </div>

          <div className='mt-6'>
            <h3 className='mb-3 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('topics')}</h3>
            <div className='flex flex-wrap gap-3 text-gray-700'>
              {lesson.topicNames.join(', ') || 'No topics specified.'}
            </div>
          </div>
        </div>

        <div className='lg:pl-2'>
          <div className='overflow-hidden rounded-2xl shadow-sm'>
            <img
              src={lesson.imageUrl || fallback}
              alt='Lesson artwork'
              className='aspect-[4/3] h-full w-full object-cover'
              loading='lazy'
            />
          </div>
          <div className='mt-6 flex flex-col gap-8 sm:flex-row'>
            <div className='flex items-start gap-3 border-l-4 border-l-gray-500 pl-1'>
              <div>
                <h3 className='text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('ageRange')}</h3>
                <p className='text-lg font-bold text-gray-900'>{lesson.ageRangeLabel}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 border-l-4 border-l-gray-500 pl-1'>
              <div>
                <h3 className='text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('duration')}</h3>
                <p className='text-lg font-bold text-gray-800'>{lesson.duration} mins</p>
              </div>
            </div>
          </div>

          <div>
            <Button
              onClick={() => handleNavigateUpdate(lesson.id)}
              className='bg-amber-custom-400 mt-8 w-full text-lg'
              size={'lg'}
            >
              Update Lesson
            </Button>

            {(lesson.status === LessonStatus.PENDING || lesson.status === LessonStatus.DRAFT) &&
              role === UserRole.ADMIN && (
                <div className='mt-5 mr-2 flex gap-x-2'>
                  <Button
                    onClick={() => handleUpdateLessonStatus(lesson.id, LessonStatus.REJECTED)}
                    className='w-1/2 border-red-500 text-red-500'
                    variant={'outline'}
                  >
                    {t('button.reject')}
                  </Button>
                  <Button
                    onClick={() => handleUpdateLessonStatus(lesson.id, LessonStatus.APPROVED)}
                    className='w-1/2 bg-green-500 text-white'
                  >
                    {t('button.approve')}
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
