import { Button } from '@/components/shadcn/button'
import { useUpdateCourseMutation, useUpdateCourseWithFormDataMutation } from '@/features/resource/course/api/courseApi'
import { Course, CourseStatus } from '@/features/resource/course/types/course.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'
import { Bookmark, Plus, Share2 } from 'lucide-react'

type CourseActionProps = {
  course: Course
}

export default function CourseAction({ course }: CourseActionProps) {
  const userRole = useAppSelector((state) => state.auth.user?.role)
  const [updateCourseStatus] = useUpdateCourseWithFormDataMutation()
  const handleUpdateCourseStatus = async (status: CourseStatus) => {
    try {
      const formData = new FormData()
      formData.append('status', status)
      await updateCourseStatus({
        id: course.id,
        body: formData
      }).unwrap()
    } catch (error) {
      console.error('Failed to update course status:', error)
    }
  }
  return (
    <section className='mt-3 flex flex-col items-center'>
      <div className='h-[0.1px] w-52 bg-gray-300'></div>

      {userRole === UserRole.ADMIN && course.status != CourseStatus.PUBLISHED && (
        <div className='mt-4 space-x-8'>
          <Button
            size='default'
            className='shadow-6 bg-red-500 font-semibold text-white'
            onClick={() => handleUpdateCourseStatus(CourseStatus.REJECTED)}
          >
            <div className='text-xs uppercase'>Reject</div>
          </Button>
          <Button
            size='default'
            className='shadow-6 bg-green-500 font-semibold text-white'
            onClick={() => handleUpdateCourseStatus(CourseStatus.PUBLISHED)}
          >
            <div className='text-xs uppercase'>Approve</div>
          </Button>
        </div>
      )}

      {/* Secondary actions */}
      <div className='text-muted-foreground mt-4 grid w-full max-w-md grid-cols-3 gap-6 text-center text-xs'>
        <div className='flex flex-col items-center gap-1'>
          <Plus className='h-5 w-5' />
          <span>Add to course</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Bookmark className='h-5 w-5' />
          <span>Add to favorites</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Share2 className='h-5 w-5' />
          <span>Share</span>
        </div>
      </div>
    </section>
  )
}
