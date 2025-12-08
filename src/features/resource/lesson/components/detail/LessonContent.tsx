'use client'

import React from 'react'
import { useSearchContentQuery } from '@/features/resource/content/api/contentApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useUpdateSectionStudentProgressMutation } from '@/features/student-progress/api/studentProgressApi'
import { studentProgressSlice } from '@/features/student-progress/slice/studentProgressSlice'
import { ProgressStatus, StudentProgress } from '@/features/student-progress/types/studentProgress.type'
import { toast } from 'sonner'
import { Button } from '@/components/shadcn/button'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { ApiSuccessResponse, PaginatedResult } from '@/types/baseModel'
import { useTranslations } from 'next-intl'
import { signIn, useSession } from 'next-auth/react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { Info } from 'lucide-react'
import dynamic from 'next/dynamic'
import { ContentType } from '@/features/resource/content/types/content.type'
import QuizViewer from '@/features/resource/quiz/components/viewer/QuizViewer'
import { setStudentQuizId } from '@/features/resource/quiz/slice/quiz-player-slice'
import AssignmentAttempt from '@/features/assignment/components/attempt/AssigmentAttempt'

const TiptapViewer = dynamic(() => import('@/components/tiptap/TiptapViewer'), { ssr: false })

type LessonContentProps = {
  token: string | null
  sectionId?: number
  lessonId: number
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
  enrollmentId?: number
}

export default function LessonContent({ token, lessonId, sectionStatus, enrollmentId }: LessonContentProps) {
  const sectionId = useAppSelector((state) => state.lessonDetail.selectedSectionId)
  const dispatch = useAppDispatch()

  const t = useTranslations('LessonDetails')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  // const { data: userData, status } = useSession()
  const user = useAppSelector((state) => state.auth.user)
  // Check if user is not logged in
  const isLoggedIn = !!user

  const { data: content, isLoading: fetchingContent, isError, error } = useSearchContentQuery({ sectionId })
  const [completeSection, { isLoading }] = useUpdateSectionStudentProgressMutation()

  function normalizeMarkdown(text: string): string {
    return text.replace(/\\n/g, '\n')
  }

  const currentSectionProgress = sectionStatus?.data.items.find((item) => item.sectionId === sectionId)

  if (fetchingContent) {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  if (!sectionId) {
    return <div className='p-6 text-gray-500'>{t('notFound.no_section')}</div>
  }

  if (!content || content.data.items.length === 0) {
    return <div className='p-6 text-gray-500'>{t('notFound.no_section')}</div>
  }

  const handleCompleteSection = async () => {
    try {
      if (enrollmentId) {
        await completeSection({ enrollmentId, lessonId, sectionId, status: ProgressStatus.COMPLETED }).unwrap()
        // dispatch(studentProgressSlice.actions.setSelectedSectionStatus(ProgressStatus.COMPLETED))
        toast.success(tt('successMessage.sectionComplete'))
      }
    } catch (err: any) {
      toast.error(tt('errorMessage'))
    }
  }

  const lastItem = content.data.items[content.data.items.length - 1]

  if (lastItem.contentType === ContentType.QUIZ) {
    return (
      <ScrollArea className='h-[600px]'>
        <QuizViewer
          quiz={lastItem}
          studentQuizId={currentSectionProgress?.studentQuizId}
          sectionStatus={sectionStatus?.data}
        />
      </ScrollArea>
    )
  } else if (lastItem.contentType === ContentType.ASSIGNMENT) {
    return (
      <ScrollArea className='h-[600px]'>
        <AssignmentAttempt
          studentAssignmentId={currentSectionProgress?.studentAssignmentId}
          assignmentId={lastItem.assignmentId}
        />
      </ScrollArea>
    )
  }

  return (
    <div className='relative flex min-h-[650px] flex-col gap-6 p-6'>
      {/* Content */}
      <div className={`flex-1 ${!isLoggedIn ? 'blur-xs' : ''}`}>
        <ScrollArea className='h-[600px]'>
          <TiptapViewer content={normalizeMarkdown(lastItem.contentBody)} />
        </ScrollArea>
      </div>

      {/* Complete section button */}
      {isLoggedIn && currentSectionProgress?.status === ProgressStatus.IN_PROGRESS && (
        <div className='flex justify-end'>
          <Button onClick={handleCompleteSection} disabled={isLoading}>
            {isLoading ? tc('button.submitting') : tc('button.markAsComplete')}
          </Button>
        </div>
      )}

      {/* Login overlay */}
      {!isLoggedIn && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/80'>
          <div className='bg-sky-custom-300 flex max-w-md flex-col items-center gap-4 rounded-lg p-6 text-white shadow-lg'>
            <Info size={24} className='text-white' />
            <div className='text-center'>
              <h3 className='mb-2 text-lg font-semibold'>{t('requestSignIn.title')}</h3>
              <p className='text-sm'>{t('requestSignIn.description')}</p>
            </div>
            <Button
              className='bg-white text-sky-500 hover:bg-gray-50'
              onClick={() => signIn('oidc', { callbackUrl: '/', prompt: 'login' })}
            >
              {t('requestSignIn.button')}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
