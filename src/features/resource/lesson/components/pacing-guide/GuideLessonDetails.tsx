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
import { useDeleteLessonMutation, useUpdateLessonMutation } from '@/features/resource/lesson/api/lessonApi'
import { toast } from 'sonner'
import { Clock, SquarePen, Trash2 } from 'lucide-react'
import { useModal } from '@/providers/ModalProvider'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'
import { SCard } from '@/components/shared/card/SCard'
import Image from 'next/image'

type GuideLessonDetailsProps = {
  lesson: Lesson
}

export default function GuideLessonDetails({ lesson }: GuideLessonDetailsProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('LessonDetails')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const role = useAppSelector((state) => state.auth.user?.role)
  const { openModal } = useModal()

  const [updateLesson] = useUpdateLessonMutation()
  const [deleteLesson] = useDeleteLessonMutation()

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
      toast.success(tt('successMessage.lessonStatus', { status }))
    } catch (error) {
      toast.error(tt('errorMessage'))
      console.error('Error updating lesson status:', error)
    }
  }

  const handleDelete = async () => {
    await deleteLesson(Number(lesson.id)).unwrap()
    toast.success(`${tt('successMessage.delete', { title: lesson.title })}`)
  }

  const fallback = 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1200&auto=format&fit=crop'
  return (
    <div>
      <div className='grid grid-cols-1 items-start gap-10 lg:grid-cols-3'>
        <div className='col-span-2 flex flex-col'>
          <div className='flex items-center gap-2'>
            <h1 className='mb-4 text-4xl font-bold text-gray-900'>{lesson.title}</h1>
            <span className='cursor-pointer text-blue-500'>
              <SquarePen
                onClick={() => {
                  openModal('upsertLesson', { lesson: lesson.id })
                }}
              />
            </span>
            <span className='cursor-pointer text-red-500'>
              <Trash2
                onClick={() => {
                  openModal('confirm', {
                    message: `${tt('confirmMessage.delete', { title: lesson.title })}`,
                    onConfirm: () => handleDelete()
                  })
                }}
              />
            </span>
          </div>

          <div className='mb-4 flex flex-wrap gap-2'>
            <p className='text-sm text-gray-700 italic'>
              By <span className='font-semibold'>{lesson.createdByUserName || 'STEMify'}</span>
            </p>
            <Badge className={getStatusBadgeClass(lesson.status)}>{capitalizeFirst(lesson.status)}</Badge>
            <Badge className='border-amber-300 bg-amber-100 text-amber-800'>
              {tc('unit.age')} {lesson.ageRangeLabel}
            </Badge>
            <Badge className='border-green-300 bg-green-100 text-green-800'>
              <Clock className='mr-1' /> {lesson.duration} {tc('unit.minute')}
            </Badge>
          </div>
          <hr className='mb-6 border-gray-300' />
          {/* Description */}
          <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('description')}</h3>
          <p
            className={`leading-relaxed whitespace-pre-line text-gray-700 ${!lesson.description ? 'text-sm italic' : ''}`}
          >
            {lesson.description || t('notFound.noDescription')}
          </p>

          <hr className='my-6 border-gray-300' />
          {/* Learning Outcome */}
          <div>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('learningOutcome')}</h3>
            <p
              className={`leading-relaxed whitespace-pre-line text-gray-700 ${!lesson.learningOutcome ? 'text-sm italic' : ''}`}
            >
              {lesson.learningOutcome || t('notFound.noOutcomes')}
            </p>
          </div>

          <hr className='my-6 border-gray-300' />

          <div>
            <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('requirements')}</h3>
            <p
              className={`leading-relaxed whitespace-pre-line text-gray-700 ${!lesson.requirement ? 'text-sm italic' : ''}`}
            >
              {lesson.requirement || t('notFound.noRequirements')}
            </p>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md'>
            <Image src={lesson.imageUrl || fallback} alt='Lesson artwork' fill className='object-cover' />
          </div>
          <div className='mt-6'>
            <div className='space-y-6'>
              <SCard
                className='gap-2'
                content={
                  <div className='space-y-4'>
                    <div>
                      <h4 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>
                        {t('lesson.skill')}
                      </h4>
                      {lesson.skillNames.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {lesson.skillNames.map((skill) => (
                            <Badge key={skill} className='border border-rose-300 bg-rose-100 text-sm text-rose-800'>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className='text-sm text-gray-500 italic'>{t('notFound.noSkills')}</p>
                      )}
                    </div>
                    <div>
                      <h4 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>
                        {t('lesson.topic')}
                      </h4>
                      {lesson.topicNames.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {lesson.topicNames.map((topic) => (
                            <Badge key={topic} className='border border-orange-300 bg-orange-100 text-orange-800'>
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className='text-sm text-gray-500 italic'>{t('notFound.noTopics')}</p>
                      )}
                    </div>
                    <div>
                      <h4 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>
                        {t('lesson.standard')}
                      </h4>
                      {lesson.standardNames.length > 0 ? (
                        <div className='flex flex-wrap gap-2'>
                          {lesson.standardNames.map((standard) => (
                            <Badge key={standard} className='border border-cyan-300 bg-cyan-100 text-cyan-800'>
                              {standard}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className='text-sm text-gray-500 italic'>{t('notFound.noStandards')}</p>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          </div>

          <div>
            {(lesson.status === LessonStatus.PENDING || lesson.status === LessonStatus.DRAFT) &&
              role === UserRole.ADMIN && (
                <div className='mt-5 mr-2 flex gap-x-2'>
                  <Button
                    onClick={() => handleUpdateLessonStatus(lesson.id, LessonStatus.REJECTED)}
                    className='w-1/2 border-red-500 text-red-500'
                    variant={'outline'}
                  >
                    {tc('button.reject')}
                  </Button>
                  <Button
                    onClick={() => handleUpdateLessonStatus(lesson.id, LessonStatus.PUBLISHED)}
                    className='w-1/2 bg-green-500 text-white'
                  >
                    {tc('button.approve')}
                  </Button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
