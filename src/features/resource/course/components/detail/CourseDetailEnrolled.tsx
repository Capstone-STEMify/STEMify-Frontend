import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import CourseDescription from './enrolled/CourseDetailDescription'
import CourseDetailContent from './enrolled/CourseDetailContent'

type CourseDetailEnrolledProps = {
  courseId: number
  token?: string
}

export default function CourseDetailEnrolled({ courseId, token }: CourseDetailEnrolledProps) {
  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title='Intro: Wetlands Biome' size={'md'} color={'yellow'} weight={'semibold'} />
          </div>

          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={30} minSize={20} className='min-h-[500px]'>
              <CourseDescription courseId={Number(courseId)} token={token} />
            </ResizablePanel>
            <ResizableHandle />

            {/* Content */}
            <ResizablePanel defaultSize={70} minSize={40} className='min-h-[500px]'>
              <CourseDetailContent courseId={courseId} token={token} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
