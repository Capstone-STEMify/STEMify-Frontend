import { Button } from '@/components/shadcn/button'
import { useUpdateLessonStudentProgressMutation } from '@/features/student-progress/api/studentProgressApi'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Bookmark, Plus, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { useTranslations } from 'next-intl'
import { UserRole } from '@/types/userRole'
import Link from 'next/link'

export default function LessonAction({ lessonId }: { lessonId: number }) {
  const t = useTranslations('LessonDetails')
  const dispatch = useAppDispatch()
  const userRole = useAppSelector((state) => state.auth.user?.role) || UserRole.GUEST
  const lessonStatus = useAppSelector((state) => state.studentProgress.selectedLessonStatus)
  const enrollmentId = useAppSelector((state) => state.studentProgress.selectedEnrollmentId)
  const [startLesson, { isLoading }] = useUpdateLessonStudentProgressMutation()

  const handleStartLearningLesson = async () => {
    try {
      if (enrollmentId) {
        await startLesson({ lessonId, enrollmentId }).unwrap()
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

      {(userRole === UserRole.STAFF || userRole === UserRole.TEACHER) && (
        <Link target='_blank' href={`/resource/lesson/${lessonId}/pacing-guide`}>
          <Button size='default' className='mt-4 bg-yellow-400 font-semibold text-black shadow-md hover:bg-yellow-500'>
            Pacing guide
          </Button>
        </Link>
      )}

      {lessonStatus === ProgressStatus.NOT_STARTED && (
        <div className='mt-4'>
          <Button
            size='default'
            className='bg-yellow-400 font-semibold text-black shadow-md hover:bg-yellow-500'
            onClick={handleStartLearningLesson}
            disabled={isLoading}
          >
            <div className='text-xs uppercase'>
              {isLoading ? `${t('action.start_loading')}` : `${t('action.learning')}`}
            </div>
          </Button>
        </div>
      )}

      {/* Secondary actions */}
      <div className='text-muted-foreground mt-6 grid w-full max-w-md grid-cols-3 gap-6 text-center text-xs'>
        <div className='flex flex-col items-center gap-1'>
          <Plus className='h-5 w-5' />
          <span>{t('action.add')}</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Bookmark className='h-5 w-5' />
          <span>{t('action.favor')}</span>
        </div>
        <div className='flex flex-col items-center gap-1'>
          <Share2 className='h-5 w-5' />
          <span>{t('action.share')}</span>
        </div>
      </div>
    </section>
  )
}
