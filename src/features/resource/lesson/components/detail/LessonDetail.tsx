'use client'
import { useEffect, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import { useParams, useRouter } from 'next/navigation'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import LessonDescription from '@/features/resource/lesson/components/detail/LessonDescription'
import LessonOutline from '@/features/resource/lesson/components/detail/LessonOutline'
import LessonContent from '@/features/resource/lesson/components/detail/LessonContent'
import { useGetSectionStudentProgressQuery } from '@/features/student-progress/api/studentProgressApi'
import { useTranslations } from 'next-intl'
import PrintPreviewModal from '@/components/shared/modals/PrintPreviewModal'
import LessonPrintableContent from './LessonPrintableContent'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'
import { clearLesson, setSelectedSectionId } from '@/features/resource/lesson/slice/lessonDetailSlice'
import QuizPlayerContainer from '@/features/resource/quiz/components/player/QuizPlayerContainer'
import { clearRefetchSectionProgress } from '@/features/student-progress/slice/studentProgressSlice'

export default function LessonDetail() {
  // translations
  const t = useTranslations('LessonDetails')
  const tc = useTranslations('common.message')

  // redux
  const dispatch = useAppDispatch()
  const { selectedOrgUserId } = useAppSelector((state) => state.selectedOrganization)
  const { selectedSectionId, mode } = useAppSelector((state) => state.lessonDetail)
  const token = useAppSelector((state) => state.auth.token)
  const shouldRefetch = useAppSelector((state) => state.studentProgress.shouldRefetchSectionProgress)

  // router
  const { lessonId } = useParams()

  // api and data fetching
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(Number(lessonId))
  const { data: sections } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !lessonId })

  const courseId = lessonData?.data.courseId
  const sectionData = sections?.data?.items ?? []

  const { data: enrollment } = useSearchCourseEnrollmentQuery(
    { studentId: selectedOrgUserId!, courseId, pageNumber: 1, pageSize: 10 },
    {
      skip: !selectedOrgUserId || !courseId
    }
  )

  const enrollmentId = enrollment?.data.items?.[0]?.id || 0

  const { data: sectionStatus } = useGetSectionStudentProgressQuery(
    {
      enrollmentId: enrollmentId,
      lessonId: Number(lessonId)
    },
    {
      skip: !enrollmentId,
      refetchOnMountOrArgChange: true
    }
  )

  // useEffect(() => {
  //   dispatch(clearLesson())
  // }, [])

  useEffect(() => {
    if (!selectedSectionId && sectionData.length > 0) {
      const firstSection = [...sectionData].sort((a, b) => a.orderIndex - b.orderIndex)[0]
      dispatch(setSelectedSectionId(firstSection.id))
    }
  }, [sectionData])

  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title={lessonData?.data.title} size={'md'} color={'yellow'} weight={'semibold'} />
          </div>

          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={40} minSize={20} className='min-h-[500px]'>
              <STabs
                customStyle={{
                  list: 'px-4 py-8 rounded-none bg-[#f8fbff] shadow-6 gap-3 mb-3 w-full',
                  trigger:
                    'py-5 bg-white text-sky-700 rounded-lg border border-gray-200 hover:bg-sky-50 hover:text-sky-700 transition duration-200 data-[state=active]:bg-sky-300 data-[state=active]:text-white'
                }}
                defaultValue='description'
                items={[
                  {
                    value: 'description',
                    label: `${t('description')}`,
                    content: <LessonDescription lessonData={lessonData} lessonLoading={lessonLoading} />
                  },
                  {
                    value: 'sections',
                    label: `${t('sections')}`,
                    content: <LessonOutline sectionData={sectionData} sectionStatus={sectionStatus} />
                  }
                ]}
              />
            </ResizablePanel>
            <ResizableHandle />

            {/* Content */}
            <ResizablePanel defaultSize={70} minSize={40}>
              {selectedSectionId ? (
                <LessonContent
                  token={token}
                  lessonId={Number(lessonId)}
                  sectionStatus={sectionStatus}
                  enrollmentId={enrollmentId}
                />
              ) : (
                <div className=''>{t('notFound.no_section')}</div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Render Modal */}
      <PrintPreviewModal title={tc('printPreview')}>
        <LessonPrintableContent lessonData={lessonData} sectionData={sectionData} />
      </PrintPreviewModal>
    </div>
  )
}
