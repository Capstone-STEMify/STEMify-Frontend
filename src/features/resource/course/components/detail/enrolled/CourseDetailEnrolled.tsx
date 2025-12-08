'use client'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useGetCourseByIdQuery } from '@/features/resource/course/api/courseApi'
import CourseDetailContent from '@/features/resource/course/components/detail/enrolled/CourseDetailContent'
import CourseDetailDescription from '@/features/resource/course/components/detail/enrolled/CourseDetailDescription'
import { useTranslations } from 'next-intl'

type CourseDetailEnrolledProps = {
  courseId: number
  enrollmentId: number
}

export default function CourseDetailEnrolled({ courseId, enrollmentId }: CourseDetailEnrolledProps) {
  const { data, isLoading: courseLoading, isFetching: courseFetching } = useGetCourseByIdQuery(courseId)

  if (courseLoading || courseFetching)
    return (
      <div className='flex h-fit items-center justify-center'>
        <LoadingComponent size={150} />
      </div>
    )

  if (!data) return <SEmpty title='Không có khóa học nào' />
  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title={data?.data.title} size={'md'} color={'yellow'} weight={'semibold'} />
          </div>

          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={35} minSize={20} className='h-fit'>
              <CourseDetailDescription courseData={data?.data} />
            </ResizablePanel>
            <ResizableHandle />

            {/* Content */}
            <ResizablePanel defaultSize={70} minSize={40} className='h-fit'>
              <CourseDetailContent courseId={courseId} enrollmentId={enrollmentId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
