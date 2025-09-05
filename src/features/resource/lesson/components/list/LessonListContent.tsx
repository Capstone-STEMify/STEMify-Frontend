'use client'

import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SDropDown } from '@/components/shared/SDropDown'
import { SkeletonCard } from '@/components/shared/skeleton/SkeletonCard'
import { SPagination } from '@/components/shared/SPagination'
import { useLazySearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import { useDeleteLessonMutation, useSearchLessonQuery } from '@/features/resource/lesson/api/lessonApi'
import { setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { LessonQueryParams, LessonStatus } from '@/features/resource/lesson/types/lesson.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { UserRole } from '@/types/userRole'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'
import { EllipsisVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LessonListContent() {
  const { openModal } = useModal()
  const router = useRouter()
  const locale = useLocale()
  const { status } = useSession()
  const t = useTranslations('LessonList')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const role = useAppSelector((state) => state.auth.user?.role) || UserRole.GUEST
  const userId = useAppSelector((state) => state.auth.user?.id)

  const PUBLIC_ROLES = UserRole.STUDENT || UserRole.GUEST || UserRole.TEACHER

  const dispatch = useAppDispatch()
  const lessonParams = useAppSelector((state) => state.lesson)

  useEffect(() => {
    dispatch(setPageSize(10))
  }, [dispatch])

  const queryParams: LessonQueryParams = {
    courseId: lessonParams.courseId,
    createdByUserId: lessonParams.createdByUserId,
    ageRangeId: lessonParams.ageRangeId,
    topicId: lessonParams.topicId,
    skillId: lessonParams.skillId,
    standardId: lessonParams.standardId,
    pageNumber: lessonParams.pageNumber,
    pageSize: lessonParams.pageSize,
    search: lessonParams.search,
    status: PUBLIC_ROLES ? LessonStatus.PUBLISHED : lessonParams.status
  }

  const { data: lessonData, isLoading } = useSearchLessonQuery(queryParams)
  const [deleteLesson] = useDeleteLessonMutation()
  const [fetchEnrollment] = useLazySearchEnrollmentQuery()

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const isReadOnly = role === UserRole.STUDENT || role === UserRole.GUEST || role === UserRole.TEACHER

  const handleStudentClick = async (lessonId: number, courseId: number) => {
    try {
      const result = await fetchEnrollment({ courseId, studentId: userId }).unwrap()
      const enrolled = result?.data?.items?.length > 0

      if (enrolled) {
        router.push(`/${locale}/resource/lesson/${lessonId}`)
      } else {
        router.push(`/${locale}/resource/course/${courseId}`)
      }
    } catch (error) {
      console.error('Error handling student click:', error)
    }
  }

  const handleDelete = async (e: React.MouseEvent, lessonId: number) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      openModal('confirm', {
        message: 'Are you sure you want to delete this lesson?',
        onConfirm: async () => {
          await deleteLesson(lessonId).unwrap()
          toast.success(tt('successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  if (isLoading) {
    return (
      <div className='my-5 grid h-screen grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
        <SkeletonCard size='sm' />
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  if (!lessonData || lessonData.data.items.length === 0) {
    return <SEmpty title={t('noLesson')} description={t('noLessonFound')} />
  }

  const content = isReadOnly ? (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {lessonData.data.items.map((lesson) => (
          <div key={lesson.id} className='relative flex gap-1'>
            <CardLayout
              imageSrc={lesson.imageUrl}
              size='sm'
              isScale={false}
              onClick={() => handleStudentClick(lesson.id, lesson.courseId)}
            >
              <div>
                <p className='text-muted-foreground text-xs font-medium'>{t('lesson')}</p>
                <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
              </div>

              <div className='mt-auto flex flex-wrap items-center gap-2'>
                <Badge className='bg-sky-custom-300'>
                  <div className='mr-0.5'>{t('tags.ageRange')}:</div>
                  {lesson.ageRangeLabel}
                </Badge>
                <Badge className='bg-red-300'>{lesson.duration} mins</Badge>
              </div>
            </CardLayout>
          </div>
        ))}
      </div>

      {lessonData.data.totalPages > 1 && (
        <SPagination
          pageNumber={lessonParams.pageNumber}
          totalPages={lessonData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-10'
        />
      )}
    </div>
  ) : (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {lessonData.data.items.map((lesson) => (
          <div key={lesson.id} className='relative flex gap-1'>
            <Link href={`/resource/lesson/${lesson.id}`}>
              <CardLayout
                imageSrc={lesson.imageUrl}
                size='sm'
                isScale={false}
                badge={
                  <Badge className={`${getStatusBadgeClass(lesson.status)}`}>{capitalizeFirst(lesson.status)}</Badge>
                }
              >
                <div
                  key={lesson.id}
                  className='absolute top-2 right-2 flex rounded-sm bg-gray-500/70 px-1 pb-1 text-white backdrop:blur-sm'
                >
                  <SDropDown
                    trigger={<EllipsisVertical className='mt-1 h-5 w-5 text-white' />}
                    items={[
                      <Link
                        href={`/resource/lesson/update/${lesson.id}`}
                        key={`update-${lesson.id}`}
                        className='text-sm'
                      >
                        <p>{tc('button.update')}</p>
                      </Link>,
                      <button
                        key={`delete-${lesson.id}`}
                        className='text-sm'
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDelete(e, lesson.id)
                        }}
                      >
                        {tc('button.delete')}
                      </button>
                    ]}
                  />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-medium'>{t('lesson')}</p>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{lesson.title}</h3>
                  <p className='line-clamp-2 text-xs text-gray-600'>{lesson.description}</p>
                </div>

                <div className='mt-auto flex flex-wrap items-center gap-2'>
                  <Badge className='bg-sky-custom-300'>{lesson.ageRangeLabel}</Badge>
                  <Badge className='bg-red-300'>{lesson.duration} mins</Badge>
                </div>
              </CardLayout>
            </Link>
          </div>
        ))}
      </div>

      {lessonData.data.totalPages > 1 && (
        <SPagination
          pageNumber={lessonParams.pageNumber}
          totalPages={lessonData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-10'
        />
      )}
    </div>
  )

  return content
}
