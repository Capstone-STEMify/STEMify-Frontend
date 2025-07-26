'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Button } from '@/components/shadcn/button'
import { useGetContentByIdQuery } from '@/features/content/api/contentApi'
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import {
  useSearchStudentProgressQuery,
  useUpdateStudentProgressMutation
} from '@/features/student-progress/api/studentProgressApi'
import { toast } from 'sonner'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'

export default function LessonContent() {
  const dispatch = useAppDispatch()
  const selectedSectionId = useAppSelector((state) => state.studentProgress.selectedSectionId)
  const { data } = useGetContentByIdQuery(selectedSectionId ?? 0, { skip: !selectedSectionId })
  const lessonStatus = useAppSelector((state) => state.studentProgress.selectedLessonStatus)
  const sectionStatus = useAppSelector((state) => state.studentProgress.selectedSectionStatus)
  const enrollmentId = useAppSelector((state) => state.studentProgress.selectedEnrollmentId)
  const lessonId = useAppSelector((state) => state.studentProgress.selectedLessonId)

  const [completeSection, { isLoading }] = useUpdateStudentProgressMutation()
  const handleCompleteSection = async () => {
    try {
      if (enrollmentId) {
        await completeSection({ id: enrollmentId, body: { lessonId: lessonId, sectionId: selectedSectionId } }).unwrap()
        dispatch(studentProgressSlice.actions.setSelectedSectionStatus(ProgressStatus.COMPLETED))
        toast.success('Section completed!')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to complete section')
    }
  }

  return (
    <div className='flex h-[700px] flex-col p-6'>
      <div className='flex-1 overflow-auto'>
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {data?.data.contentName}
        </ReactMarkdown>
      </div>{' '}
      {lessonStatus === ProgressStatus.IN_PROGRESS && sectionStatus === ProgressStatus.IN_PROGRESS && (
        <div className='mt-auto self-end'>
          <Button className='bg-amber-custom-400' onClick={handleCompleteSection} disabled={isLoading}>
            {isLoading ? 'Completing...' : 'Mark as Complete'}
          </Button>
        </div>
      )}
    </div>
  )
}
