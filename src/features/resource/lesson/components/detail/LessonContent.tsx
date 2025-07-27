'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useGetContentByIdQuery } from '@/features/content/api/contentApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  useSearchStudentProgressQuery,
  useUpdateStudentProgressMutation
} from '@/features/student-progress/api/studentProgressApi'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { ProgressStatus } from '@/features/student-progress/types/studentProgress.type'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'

type LessonContentProps = {
  sectionId: number
  token: string | null
  courseId?: number
  lessonId: number
}
export default function LessonContent({ sectionId, token, courseId, lessonId }: LessonContentProps) {
  const dispatch = useAppDispatch()
  const userId = useAppSelector((state) => state.auth.user?.userId)

  const { data: content } = useGetContentByIdQuery(sectionId, {
    skip: !sectionId || !token
  })

  const { data: enrollment } = useSearchEnrollmentQuery(
    { studentId: userId, courseId },
    {
      skip: !userId || !courseId
    }
  )

  const enrollmentId = enrollment?.data.items?.[0]?.id || 0

  const { data: sectionStatus } = useSearchStudentProgressQuery({ enrollmentId: enrollmentId, lessonId })
  const [completeSection, { isLoading }] = useUpdateStudentProgressMutation()

  const handleCompleteSection = async () => {
    try {
      if (enrollmentId) {
        await completeSection({ id: enrollmentId, body: { lessonId, sectionId } }).unwrap()
        dispatch(studentProgressSlice.actions.setSelectedSectionStatus(ProgressStatus.COMPLETED))
        toast.success('Section completed!')
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to complete section')
    }
  }

  if (content) {
    return (
      <div className='flex min-h-[650px] flex-col gap-6 p-6'>
        <div key={content.data.id} className='prose flex-1'>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content.data.contentName}
          </ReactMarkdown>
        </div>

        {sectionStatus?.data.items[0]?.status === ProgressStatus.IN_PROGRESS && (
          <div className='mt-auto self-end'>
            <Button className='bg-amber-custom-400' onClick={handleCompleteSection} disabled={isLoading}>
              {isLoading ? 'Completing...' : 'Mark as Complete'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return <div>No Content Available For This Section</div>
}
