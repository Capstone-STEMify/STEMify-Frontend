import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import CourseDescription from './enrolled/CourseDetailDescription'
import CourseDetailContent from './enrolled/CourseDetailContent'
import { Button } from '@/components/shadcn/button'
import { useRouter } from 'next/navigation'

type CourseDetailEnrolledProps = {
  courseId: number
  enrollmentId: number
}

export default function CourseDetailEnrolled({ courseId, enrollmentId }: CourseDetailEnrolledProps) {
  const router = useRouter()
  const handleCreate = () => {
    router.push(`/resource/lesson/create?courseId=${courseId}`)
  }
  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title='Intro: Wetlands Biome' size={'md'} color={'yellow'} weight={'semibold'} />
          </div>

          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={30} minSize={20} className='h-fit'>
              <CourseDescription courseId={Number(courseId)} />
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
