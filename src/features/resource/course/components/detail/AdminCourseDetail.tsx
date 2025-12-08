'use client'
import React from 'react'
import { Button } from '@/components/shadcn/button'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { SCard } from '@/components/shared/card/SCard'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { BookOpen, SquarePen, Trash2 } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { CourseStatus } from '@/features/resource/course/types/course.type'
import {
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useUpdateCourseMutation
} from '@/features/resource/course/api/courseApi'
import LessonTable from '@/features/resource/lesson/components/list/LessonTable'
import { useModal } from '@/providers/ModalProvider'
import { getLevelBadgeClass, getStatusBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst, useLevelTranslation, useStatusTranslation } from '@/utils/index'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setPageIndex, setPageSize } from '@/features/resource/lesson/slice/lessonSlice'
import { useLazyExportToRSAQuery } from '@/features/resource/export/api/exportApi'
import ExportRSAButton from '@/components/shared/button/ExportRSAButton'
import KitListSection from '@/features/resource/kit/components/list/KitListSection'

export default function AdminCourseDetail() {
  const t = useTranslations('Admin.course_details')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const translateStatus = useStatusTranslation()
  const translateLevel = useLevelTranslation()

  // Get current user
  const user = useAppSelector((state) => state.auth.user)
  const params = useParams()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()

  // Set courseId in Redux store
  const courseIdParam = params?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  // Fetch course details
  const { data: course, error, isLoading, refetch } = useGetCourseByIdQuery(Number(courseId))
  const [triggerExport, { data: exportData, isLoading: isExporting }] = useLazyExportToRSAQuery()
  const [updateCourseStatus] = useUpdateCourseMutation()
  const [deleteCourse] = useDeleteCourseMutation()

  React.useEffect(() => {
    dispatch(resetParams())
    dispatch(setPageIndex(1)) // Reset to first page when courseId changes
    dispatch(setPageSize(50)) // Reset to default page size when courseId changes
  }, [courseId, refetch])

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

  if (isExporting) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  const createdAt = course.data.createdDate ? new Date(course.data.createdDate).toLocaleString() : 'N/A'
  const updatedAt = course.data.lastModifiedDate ? new Date(course.data.lastModifiedDate).toLocaleString() : 'N/A'

  const handleUpdateCourseStatus = async (status: CourseStatus) => {
    try {
      await updateCourseStatus({
        id: course.data.id,
        body: {
          status
        }
      }).unwrap()
      toast.success(`${tt('successMessage.updateNoTitle')}`)
    } catch (error) {
      toast.error(tt('errorMessage'))
      console.error('Failed to update course status:', error)
    }
  }

  const handleDelete = async () => {
    if (!courseId) {
      return toast.error(tt('errorSpecific.id'))
    }
    try {
      deleteCourse(courseId).unwrap()
      toast.success(tt('successMessage.delete'))
    } catch (error) {
      toast.error(tt('errorMessage'))
      console.error('Failed to delete course:', error)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-12 xl:grid-cols-3'>
      <div className='xl:col-span-2'>
        <h2 className='mb-2 text-sm text-gray-500 uppercase'>{course.data.code}</h2>
        <div className='flex items-center gap-2'>
          <h1 className='mb-4 text-4xl font-bold text-gray-900'>{course.data.title}</h1>
          <span className='cursor-pointer text-blue-500'>
            <SquarePen
              onClick={() => {
                openModal('upsertCourse', { courseId: course.data.id })
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
            Tạo bởi <span className='font-semibold'>{course.data.createdByUserName || 'STEMify'}</span>
          </p>
          <p>Ngày tạo: {createdAt}</p>
          <p>Chỉnh sửa gần nhất: {updatedAt}</p>
        </div>
        <div className='mb-4 flex flex-wrap gap-4 text-sm'>
          <span>
            {t('status')}:{' '}
            <Badge className={getStatusBadgeClass(course.data.status)}>{translateStatus(course.data.status)}</Badge>
          </span>
          <span>
            {t('age')}: <Badge className='border-rose-300 bg-rose-100 text-rose-800'>{course.data.ageRangeLabel}</Badge>
          </span>
          <span>
            {t('level')}:{' '}
            <Badge className={getLevelBadgeClass(course.data.level)}>{translateLevel(course.data.level)}</Badge>
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
      <div className='space-y-6 xl:col-span-1'>
        {/* Thumbnail */}
        <div className='relative mx-auto aspect-[4/3] max-w-[300px] overflow-hidden rounded-2xl shadow-md xl:max-w-xs'>
          <Image
            src={course.data.imageUrl || '/images/fallback.png'}
            alt={course.data.title}
            fill
            className='object-cover'
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
                      <Badge key={topic} variant='secondary' className='border-red-300 bg-red-100 text-red-800'>
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
                      <Badge
                        key={skill}
                        variant='outline'
                        className='border-emerald-300 bg-emerald-100 text-emerald-700'
                      >
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
                      <Badge
                        key={standard}
                        variant='outline'
                        className='bg-yellow-custom-50 text-orange-custom-500 border-yellow-300'
                      >
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

        {/* review Buttons (only for admin users) */}
        {/* {user && user.userRole === UserRole.ADMIN && course.data.status === CourseStatus.PENDING && (
          <div className='space-y-4'>
            <Button
              onClick={() => handleUpdateCourseStatus(CourseStatus.PUBLISHED)}
              className='text-sky-custom-600 w-full cursor-pointer bg-gray-200 font-semibold shadow'
              variant='outline'
            >
              {tc('button.approve')}
            </Button>
            <Button
              onClick={() => handleUpdateCourseStatus(CourseStatus.REJECTED)}
              variant='outline'
              className='w-full border-red-600 text-red-600'
            >
              {tc('button.reject')}
            </Button>
          </div>
        )} */}
        {/* if user is the creator and course is in draft status */}
        {user && user.userId === course.data.createdByUserId && course.data.status === CourseStatus.DRAFT && (
          <div className='space-y-4'>
            <Button
              onClick={() => handleUpdateCourseStatus(CourseStatus.PUBLISHED)}
              className='bg-sky-custom-600 w-full cursor-pointer font-semibold text-white shadow'
              variant='outline'
            >
              {tc('button.publish')}
            </Button>
          </div>
        )}

        {/* if staff user is the creator and course is in draft status */}
        {/* {user &&
          user.userRole === UserRole.STAFF &&
          user.userId === course.data.createdByUserId &&
          course.data.status === CourseStatus.DRAFT && (
            <div className='space-y-4'>
              <Button
                onClick={() => handleUpdateCourseStatus(CourseStatus.PENDING)}
                className='bg-sky-custom-600 w-full cursor-pointer font-semibold text-white shadow'
                variant='outline'
              >
                {tc('button.sendRequest')}
              </Button>
            </div>
          )} */}
        {/* Pending Review Message */}
        {/* {user &&
          user.userRole === UserRole.STAFF &&
          user.userId === course.data.createdByUserId &&
          course.data.status === CourseStatus.PENDING && (
            <div className='flex w-full items-center gap-3 rounded-md border border-yellow-300 bg-yellow-50 p-2'>
              <p className='text-xs font-medium text-yellow-700'>{t('reviewMessage')}</p>
            </div>
          )} */}

        {/* <ExportRSAButton courseId={course.data.id} /> */}
      </div>
      {/* Kit Section */}
      <div className='xl:col-span-3'>
        <hr className='mb-5 border-gray-300' />
        <KitListSection context='course' kitId={course.data.kitId} />
      </div>
      {/* Divider Section before Lesson Table */}
      <div className='col-span-1 pt-5 xl:col-span-3'>
        <div className='mb-5 flex items-center gap-3'>
          <hr className='flex-grow border-t border-gray-300' />
          <h1 className='text-sky-custom-600 text-3xl font-semibold'>{t('lesson')}</h1>
          <hr className='flex-grow border-t border-gray-300' />
        </div>
        <LessonTable courseIdSelected={course.data.id} />
      </div>
    </div>
  )
}
