'use client'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { SCard } from '@/components/shared/card/SCard'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, Clock, Edit, SquarePen, Trash2 } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { CourseLevel, CourseStatus } from '@/features/resource/course/types/course.type'
import {
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation
} from '@/features/resource/course/api/courseApi'
import LessonTable from '@/features/resource/lesson/components/list/LessonTable'
import { useModal } from '@/providers/ModalProvider'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'

const levelBadgeClass = (level?: string): string => {
  const map: Record<string, string> = {
    [CourseLevel.BEGINNER]: 'bg-green-100 text-green-800 border-green-300',
    [CourseLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [CourseLevel.ADVANCED]: 'bg-red-100 text-red-800 border-red-300'
  }
  return map[level ?? ''] ?? 'bg-muted text-muted-foreground'
}

const getCourseStatusBadgeClass = (status?: CourseStatus): string => {
  const map: Record<CourseStatus, string> = {
    [CourseStatus.DRAFT]: 'bg-gray-200 text-gray-800 border-gray-300',
    [CourseStatus.PUBLISHED]: 'bg-blue-100 text-blue-800 border-blue-300',
    [CourseStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    [CourseStatus.DELETED]: 'bg-red-100 text-red-800 border-red-300',
    [CourseStatus.PENDING]: 'bg-amber-100 text-amber-800 border-amber-300',
    [CourseStatus.REJECTED]: 'bg-red-200 text-red-900 border-red-300',
    [CourseStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-300'
  }

  return status ? (map[status] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground'
}

export default function CourseDetailForAdmin() {
  const t = useTranslations('Admin.course_details')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')

  const locale = useLocale()
  const params = useParams()
  const router = useRouter()
  const { openModal } = useModal()

  // Set courseId in Redux store
  const courseIdParam = params?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  // Fetch course details
  const { data: course, error, isLoading, refetch } = useGetCourseByIdQuery(Number(courseId))
  const [updateCourseStatus] = useUpdateCourseMutation()
  const [deleteCourse] = useDeleteCourseMutation()

  if (isLoading)
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  if (error) return <div className='p-8 text-red-500'>Error loading course details.</div>
  if (!course?.data)
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <SEmpty
          title='Course not found'
          description='The course you are looking for does not exist or has been removed.'
          icon={<BookOpen className='h-12 w-12 text-gray-400' />}
        />
      </div>
    )

  const createdAt = course.data.createdDate ? new Date(course.data.createdDate).toLocaleString() : 'N/A'
  const updatedAt = course.data.lastModifiedDate ? new Date(course.data.lastModifiedDate).toLocaleString() : 'N/A'
  const createdBy = course.data.createdByUserName?.trim() || 'STEMify Staff'

  const handleUpdateCourseStatus = async (status: CourseStatus) => {
    try {
      await updateCourseStatus({
        id: course.data.id,
        body: {
          status
        }
      }).unwrap()
      toast.success(`${tt('successMessage.update', { title: status || '' })}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
      console.error('Failed to update course status:', error)
    }
  }
  const handleUpdate = () => {
    router.push(`/${locale}/admin/course/update/${courseId}`)
  }

  const handleDelete = () => {
    if (!courseId) {
      return toast.error(tt('errorSpecific.id'))
    }
    try {
      const res = deleteCourse(courseId).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
      console.error('Failed to delete course:', error)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-12 md:grid-cols-3'>
      {/* LEFT: Course content */}
      <div className='flex flex-col md:col-span-2'>
        {/* Course Header */}
        <div className='flex items-center gap-2'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{course.data.title}</h1>
          <span className='cursor-pointer text-blue-500'>
            <SquarePen
              onClick={() => {
                openModal('upsertLesson', { lesson: course.data.id })
              }}
            />
          </span>
          <span className='cursor-pointer text-red-500'>
            <Trash2
              onClick={() => {
                openModal('confirm', {
                  message: `${tt('confirmMessage.delete', { title: course.data.title })}`,
                  onConfirm: () => handleDelete()
                })
              }}
            />
          </span>
        </div>

        <div className='mb-4 flex flex-wrap gap-2 text-sm'>
          <p className='text-sm text-gray-700 italic'>
            By <span className='font-semibold'>{course.data.createdByUserName || 'STEMify'}</span>
          </p>
          <p>Ngày tạo: {createdAt}</p>
          <p>Chỉnh sửa gần nhất: {updatedAt}</p>
        </div>
        <div className='mb-4 flex flex-wrap gap-4 text-sm'>
          <span>
            {t('status')}:{' '}
            <Badge className={getStatusBadgeClass(course.data.status)}>{capitalizeFirst(course.data.status)}</Badge>
          </span>
          <span>
            {t('age')}: <Badge className='border-rose-300 bg-rose-100 text-rose-800'>{course.data.ageRangeLabel}</Badge>
          </span>
          <span>
            {t('level')}:{' '}
            <Badge className={levelBadgeClass(course.data.level)}>{capitalizeFirst(course.data.level)}</Badge>
          </span>
        </div>
        <hr className='mb-6 border-gray-300' />

        {/* Description */}
        <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('description')}</h3>
        <p className='whitespace-pre-line text-gray-700'>{course.data.description}</p>

        <hr className='my-6 border-gray-300' />
        {/* Student Tasks */}
        <div>
          <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('task')}</h3>
          {!course.data.studentTasks ? (
            <p className='text-muted-foreground italic'>{t('nodata.task')}</p>
          ) : (
            <p className='leading-relaxed whitespace-pre-line text-gray-700'>{course.data.studentTasks}</p>
          )}
        </div>

        <hr className='my-6 border-gray-300' />
        {/* Prerequisites */}
        <div>
          <h3 className='mb-2 text-sm font-bold tracking-wide text-gray-800 uppercase'>{t('prerequisites')}</h3>
          {!course.data.prerequisites ? (
            <p className='text-muted-foreground italic'>{t('nodata.prerequisites')}</p>
          ) : (
            <p className='leading-relaxed whitespace-pre-line text-gray-700'>{course.data.prerequisites}</p>
          )}
        </div>
      </div>

      {/* RIGHT: Thumbnail, Metadata, Actions */}
      <div className='space-y-6'>
        {/* Thumbnail */}
        <div className='relative aspect-video w-full overflow-hidden rounded-2xl shadow-md'>
          <Image
            src={course.data.imageUrl || '/images/fallback.png'}
            alt={course.data.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        {/* Metadata */}
        <SCard
          content={
            <div className='space-y-4'>
              {/* Topics */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>{t('topic')}</p>
                {course.data.topicNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.topicNames.map((topic) => (
                      <Badge key={topic} variant='secondary' className='bg-red-100 text-red-800'>
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>{t('nodata.topic')}</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>{t('skill')}</p>
                {course.data.skillNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.skillNames.map((skill) => (
                      <Badge key={skill} variant='outline' className='bg-emerald-100 text-emerald-700'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>{t('nodata.skill')}</p>
                )}
              </div>

              {/* Standards */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>{t('standard')}</p>
                {course.data.standardNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.standardNames.map((standard) => (
                      <Badge key={standard} variant='outline' className='bg-yellow-custom-50 text-orange-custom-500'>
                        {standard}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>{t('nodata.standard')}</p>
                )}
              </div>
            </div>
          }
        />

        {/* Action Buttons */}

        {(course.data.status === CourseStatus.PENDING || course.data.status === CourseStatus.DRAFT) && (
          <div className='space-y-4'>
            <Button
              onClick={() => handleUpdateCourseStatus(CourseStatus.PUBLISHED)}
              className='text-sky-custom-600 w-full cursor-pointer bg-gray-200 font-semibold shadow'
              variant='outline'
            >
              {t('button.approve')}
            </Button>
            <Button
              onClick={() => handleUpdateCourseStatus(CourseStatus.REJECTED)}
              variant='outline'
              className='w-full border-red-600 text-red-600'
            >
              {t('button.reject')}
            </Button>
          </div>
        )}
      </div>
      {/* Divider Section before Lesson Table */}
      <div className='pt-5 md:col-span-3'>
        <div className='flex items-center gap-3 pb-3'>
          <hr className='flex-grow border-t border-gray-300' />
          <h1 className='text-sky-custom-600 text-3xl font-semibold'>{t('lesson')}</h1>
          <hr className='flex-grow border-t border-gray-300' />
        </div>
        <LessonTable courseIdSelected={course.data.id} refetch={refetch} />
      </div>
    </div>
  )
}
