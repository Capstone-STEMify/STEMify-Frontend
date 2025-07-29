'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useSearchContentQuery } from '@/features/content/api/contentApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  useSearchStudentProgressQuery,
  useUpdateStudentProgressMutation
} from '@/features/student-progress/api/studentProgressApi'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { useSearchEnrollmentQuery } from '@/features/enrollment/api/enrollmentApi'
import MDEditor from '@uiw/react-md-editor'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'

type LessonContentProps = {
  sectionId: number
  token: string | null
  lessonId: number
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
  enrollmentId?: number
}
export default function LessonContent({ sectionId, token, lessonId, sectionStatus, enrollmentId }: LessonContentProps) {
  const dispatch = useAppDispatch()

  const { data: content } = useSearchContentQuery(
    { sectionId },
    {
      skip: !sectionId || !token
    }
  )

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

  function normalizeMarkdown(text: string): string {
    return text.replace(/\\n/g, '\n')
  }

  const currentSectionProgress = sectionStatus?.data.items.find((item) => item.sectionId === sectionId)

  if (content) {
    return (
      <div className='flex min-h-[650px] flex-col gap-6 p-6'>
        {content.data.items.map((c) => (
          <div key={c.id} className='prose flex-1'>
            <ScrollArea className='h-[650px]'>
              <MDEditor.Markdown
                source={normalizeMarkdown(c.contentName)}
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '1rem',
                  borderRadius: '8px'
                }}
                data-color-mode='light'
              />
            </ScrollArea>
          </div>
        ))}

        {currentSectionProgress?.status === ProgressStatus.IN_PROGRESS && (
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
