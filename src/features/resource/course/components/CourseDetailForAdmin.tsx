'use client'
import React, { useEffect } from 'react'
import LessonTable from '../../lesson/components/table/LessonManagement'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import Image from 'next/image'
import { Badge } from '@/components/shadcn/badge'
import { Course, CourseLevel, CourseStatus } from '../types/course.type'
import { SCard } from '@/components/shared/card/SCard'
import { useDeleteCourseMutation, useGetCourseByIdQuery, useUpdateCourseMutation } from '../api/courseApi'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, Edit } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useAppDispatch } from '@/hooks/redux-hooks'
import { setParam } from '../slice/courseSlice'

const levelBadgeClass = (level?: string): string => {
  const map: Record<string, string> = {
    [CourseLevel.BEGINNER]: 'bg-green-100 text-green-800',
    [CourseLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
    [CourseLevel.ADVANCED]: 'bg-red-100 text-red-800'
  }
  return map[level ?? ''] ?? 'bg-muted text-muted-foreground'
}

const getCourseStatusBadgeClass = (status?: CourseStatus): string => {
  const map: Record<CourseStatus, string> = {
    [CourseStatus.DRAFT]: 'bg-gray-200 text-gray-800',
    [CourseStatus.PUBLISHED]: 'bg-blue-100 text-blue-800',
    [CourseStatus.ARCHIVED]: 'bg-yellow-100 text-yellow-800',
    [CourseStatus.DELETED]: 'bg-red-100 text-red-800',
    [CourseStatus.PENDING]: 'bg-amber-100 text-amber-800',
    [CourseStatus.REJECTED]: 'bg-red-200 text-red-900',
    [CourseStatus.APPROVED]: 'bg-green-100 text-green-800'
  }

  return status ? (map[status] ?? 'bg-muted text-muted-foreground') : 'bg-muted text-muted-foreground'
}

export default function CourseDetailPage() {
  const t = useTranslations('CourseDetails')

  const locale = useLocale()
  const params = useParams()
  const router = useRouter()

  // Set courseId in Redux store
  const courseIdParam = params?.courseId
  const courseId = courseIdParam ? Number(courseIdParam) : undefined

  // Fetch course details
  const { data: course, error, isLoading } = useGetCourseByIdQuery(Number(courseId))
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
      toast.success(`Course status updated to ${status}`)
    } catch (error) {
      toast.error('Failed to review course')
      console.error('Failed to update course status:', error)
    }
  }
  const handleUpdate = () => {
    router.push(`/${locale}/admin/course/update/${courseId}`)
  }

  const handleDelete = () => {
    if (!courseId) {
      return toast.error('Course ID is required to delete a course.')
    }
    try {
      const res = deleteCourse(courseId).unwrap()
      toast.success(`Course deleted successfully.`)
    } catch (error) {
      toast.error('Failed to delete course')
      console.error('Failed to delete course:', error)
    }
  }

  return (
    <div className='grid grid-cols-1 gap-8 md:grid-cols-12'>
      {/* LEFT: Course content */}
      <div className='space-y-6 md:col-span-8'>
        {/* Course Header */}
        <SCard
          title={course.data.title}
          titleClassName='text-3xl font-bold tracking-tight'
          content={
            <div className='text-muted-foreground mt-3 flex flex-wrap items-center gap-4 text-sm'>
              <span>
                Code: <strong>{course.data.code}</strong>
              </span>
              <span>
                Status: <Badge className={getCourseStatusBadgeClass(course.data.status)}>{course.data.status}</Badge>
              </span>
              <span>
                Level: <Badge className={levelBadgeClass(course.data.level)}>{course.data.level}</Badge>
              </span>
              <span>
                Age Range: <Badge className='bg-red-100 text-red-800'>{course.data.ageRangeLabel}</Badge>
              </span>
            </div>
          }
        />

        {/* Description */}
        <SCard
          title='Description'
          content={
            course.data.description ? (
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>{course.data.description}</p>
            ) : (
              <p className='text-muted-foreground italic'>No description provided.</p>
            )
          }
        />

        {/* Student Tasks */}
        <SCard
          title='Student Tasks'
          content={
            course.data.studentTasks ? (
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>{course.data.studentTasks}</p>
            ) : (
              <p className='text-muted-foreground italic'>No student tasks listed.</p>
            )
          }
        />

        {/* Prerequisites */}
        <SCard
          title='Prerequisites'
          content={
            course.data.prerequisites ? (
              <p className='text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>{course.data.prerequisites}</p>
            ) : (
              <p className='text-muted-foreground italic'>No prerequisites listed.</p>
            )
          }
        />

        <SCard
          title='Tags'
          content={
            <div className='space-y-4'>
              {/* Topics */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>Topics</p>
                {course.data.topicNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.topicNames.map((topic) => (
                      <Badge key={topic} variant='secondary' className='bg-red-100 text-red-800'>
                        {topic}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>No topics listed.</p>
                )}
              </div>

              {/* Skills */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>Skills</p>
                {course.data.skillNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.skillNames.map((skill) => (
                      <Badge key={skill} variant='outline' className='bg-emerald-100 text-emerald-700'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>No skills listed.</p>
                )}
              </div>

              {/* Standards */}
              <div>
                <p className='mb-1 text-sm font-semibold text-gray-600'>Standards</p>
                {course.data.standardNames?.length > 0 ? (
                  <div className='flex flex-wrap gap-2'>
                    {course.data.standardNames.map((standard) => (
                      <Badge key={standard} variant='outline' className='bg-yellow-custom-50 text-orange-custom-500'>
                        {standard}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className='text-muted-foreground text-sm italic'>No standards assigned.</p>
                )}
              </div>
            </div>
          }
        />
      </div>

      {/* RIGHT: Thumbnail, Metadata, Actions */}
      <div className='space-y-6 md:col-span-4'>
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
          title='Metadata'
          content={
            <div className='space-y-1 text-sm text-gray-700'>
              <div>
                <strong>Created at: </strong> {createdAt}
              </div>
              <div>
                <strong>Last Modified: </strong> {updatedAt}
              </div>
              <div>
                <strong>Created By: </strong> {createdBy}
              </div>
            </div>
          }
        />

        {/* Action Buttons */}
        <div className='space-y-4'>
          <Button
            onClick={handleUpdate}
            className='text-sky-custom-600 w-full cursor-pointer bg-gray-200 font-semibold shadow'
            variant='outline'
          >
            {t('notEnrolled.button.update')}
          </Button>
          <Button onClick={handleDelete} variant='outline' className='w-full border-red-600 text-red-600'>
            {t('notEnrolled.button.delete')}
          </Button>
        </div>
        {(course.data.status === CourseStatus.PENDING || course.data.status === CourseStatus.DRAFT) && (
          <div className='flex flex-wrap justify-center gap-3'>
            <Button
              className='cursor-pointer bg-red-600 font-semibold text-white shadow'
              onClick={() => handleUpdateCourseStatus(CourseStatus.REJECTED)}
            >
              {t('enrolled.action.reject')}
            </Button>
            <Button
              className='cursor-pointer bg-green-600 font-semibold text-white shadow'
              onClick={() => handleUpdateCourseStatus(CourseStatus.PUBLISHED)}
            >
              {t('enrolled.action.approve')}
            </Button>
          </div>
        )}
      </div>
      {/* Divider Section before Lesson Table */}
      <div className='pt-5 md:col-span-12'>
        <div className='flex items-center gap-3 pb-3'>
          <hr className='flex-grow border-t border-gray-300' />
          <h1 className='text-sky-custom-600 text-3xl font-semibold'>Lessons List</h1>
          <hr className='flex-grow border-t border-gray-300' />
        </div>
        <LessonTable courseIdSelected={course.data.id} />
      </div>
    </div>
  )
}
