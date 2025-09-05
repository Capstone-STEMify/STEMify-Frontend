'use client'

import React from 'react'
import { useSearchContentQuery } from '@/features/content/api/contentApi'
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

const TiptapViewer = dynamic(() => import('@/components/tiptap/TiptapViewer'), { ssr: false })

type LessonContentProps = {
  sectionId: number
  token: string | null
  lessonId: number
  sectionStatus?: ApiSuccessResponse<PaginatedResult<StudentProgress>>
  enrollmentId?: number
}

export default function LessonContent({ sectionId, token, lessonId, sectionStatus, enrollmentId }: LessonContentProps) {
  const dispatch = useAppDispatch()

  const t = useTranslations('LessonDetails')
  const tt = useTranslations('toast')

  const { data: userData, status } = useSession()

  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  const { data: content } = useSearchContentQuery(
    { sectionId },
    {
      skip: !sectionId
    }
  )

  const [completeSection, { isLoading }] = useUpdateSectionStudentProgressMutation()

  const handleCompleteSection = async () => {
    try {
      if (enrollmentId) {
        await completeSection({ enrollmentId, lessonId, sectionId }).unwrap()
        dispatch(studentProgressSlice.actions.setSelectedSectionStatus(ProgressStatus.COMPLETED))
        toast.success(tt('successMessage.sectionComplete'))
      }
    } catch (err: any) {
      toast.error(tt('errorMessage'))
    }
  }

  function normalizeMarkdown(text: string): string {
    return text.replace(/\\n/g, '\n')
  }

  const currentSectionProgress = sectionStatus?.data.items.find((item) => item.sectionId === sectionId)

  // Check if user is not logged in
  const isLoggedIn = !!userData

  if (content) {
    return (
      <div className='relative flex min-h-[650px] flex-col gap-6 p-6'>
        {/* Content with conditional blur */}
        <div className={`flex-1 ${!isLoggedIn ? 'blur-xs' : ''}`}>
          {content.data.items.map((c) => (
            <div key={c.id} className='prose flex-1'>
              <ScrollArea className='h-[650px]'>
                <TiptapViewer content={normalizeMarkdown(c.contentName)} />
              </ScrollArea>
            </div>
          ))}
        </div>

        {/* Login overlay when not logged in */}
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

        {/* Complete section button - only show if logged in */}
        {isLoggedIn && currentSectionProgress?.status === ProgressStatus.IN_PROGRESS && (
          <div className='mt-auto self-end'>
            <Button className='bg-amber-custom-400' onClick={handleCompleteSection} disabled={isLoading}>
              {isLoading ? 'Completing...' : 'Mark as Complete'}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return <div>{t('notFound.no_section')}</div>
}
