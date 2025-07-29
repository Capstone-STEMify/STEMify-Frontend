import { Button } from '@/components/shadcn/button'
import { useUpdateStudentProgressMutation } from '@/features/student-progress/api/studentProgressApi'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Bookmark, Plus, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'

export default function LessonAction({ lessonId }: { lessonId: number }) {
  const dispatch = useAppDispatch()
  const lessonStatus = useAppSelector((state) => state.studentProgress.selectedLessonStatus)
  const enrollmentId = useAppSelector((state) => state.studentProgress.selectedEnrollmentId)
  const [startLesson, { isLoading }] = useUpdateStudentProgressMutation()

  const handleStartLearningLesson = async () => {
    try {
      if (enrollmentId) {
        await startLesson({ id: enrollmentId, body: { lessonId } }).unwrap()
        dispatch(studentProgressSlice.actions.setSelectedLessonStatus(ProgressStatus.IN_PROGRESS))
        toast.success('Lesson started!')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to start lesson')
    }
  }
  return (
    <section className='mt-3 mb-5 flex flex-col items-center'>
      <div className='h-[0.1px] w-52 bg-gray-300'></div>

      {lessonStatus === ProgressStatus.NOT_STARTED && (
        <div className='mt-4'>
          <Button
            size='default'
            className='bg-yellow-400 font-semibold text-black shadow-md hover:bg-yellow-500'
            onClick={handleStartLearningLesson}
            disabled={isLoading}
          >
            <div className='text-xs uppercase'>{isLoading ? 'Starting...' : 'Start Learning'}</div>
          </Button>
        </div>
      )}

      {/* Secondary actions */}
      <div className='text-muted-foreground mt-6 grid w-full max-w-md grid-cols-3 gap-6 text-center text-xs'>
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
