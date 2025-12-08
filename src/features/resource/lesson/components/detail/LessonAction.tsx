import { Button } from '@/components/shadcn/button'
import { useUpdateLessonStudentProgressMutation } from '@/features/student-progress/api/studentProgressApi'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Bookmark, Plus, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { useTranslations } from 'next-intl'
import { LicenseType, UserRole } from '@/types/userRole'
import { useModal } from '@/providers/ModalProvider'
import { setIsPrintModalOpen } from '@/features/resource/lesson/slice/lessonDetailSlice'
import ExportRSAButton from '@/components/shared/button/ExportRSAButton'
import { useParams } from 'next/navigation'

export default function LessonAction({ lessonId }: { lessonId: number }) {
  const { courseId } = useParams()
  const t = useTranslations('LessonDetails')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole)
  const lessonStatus = useAppSelector((state) => state.studentProgress.selectedLessonStatus)
  const enrollmentId = useAppSelector((state) => state.studentProgress.selectedEnrollmentId)
  const [startLesson, { isLoading }] = useUpdateLessonStudentProgressMutation()

  const handleStartLearningLesson = async () => {
    try {
      if (enrollmentId) {
        await startLesson({ lessonId, enrollmentId }).unwrap()
        dispatch(studentProgressSlice.actions.setSelectedLessonStatus(ProgressStatus.IN_PROGRESS))
        toast.success(tt('successMessage.lessonStart'))
      }
    } catch (err: any) {
      toast.error(tt('errorMessage'))
    }
  }
  return (
    <section className='mt-3 mb-5 flex flex-col items-center'>
      <div className='h-[0.1px] w-52 bg-gray-300'></div>

      <div className='mt-4 flex items-center justify-between gap-4'>
        <Button size='default' onClick={() => dispatch(setIsPrintModalOpen(true))}>
          {tc('button.downloadAndPrint')}
        </Button>
        <ExportRSAButton courseId={Number(courseId)} className='w-fit' />
      </div>

      {/* {lessonStatus === ProgressStatus.NOT_STARTED && (
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
      )} */}

      {/* Secondary actions */}
    </section>
  )
}
