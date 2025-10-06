'use client'
import { useEffect, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import { useParams, useRouter } from 'next/navigation'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import LessonDescription from '@/features/resource/lesson/components/detail/LessonDescription'
import LessonOutline from '@/features/resource/lesson/components/detail/LessonOutline'
import LessonContent from '@/features/resource/lesson/components/detail/LessonContent'
import { useGetSectionStudentProgressQuery } from '@/features/student-progress/api/studentProgressApi'
import { useTranslations } from 'next-intl'
import PrintPreviewModal from '@/components/shared/modals/PrintPreviewModal'
import LessonPrintableContent from './LessonPrintableContent'
import { useSearchCourseEnrollmentQuery } from '@/features/enrollment/api/courseEnrollmentApi'

export default function LessonDetail({ id }: { id?: number }) {
  const t = useTranslations('LessonDetails')
  const tc = useTranslations('common.message')
  const userId = useAppSelector((state) => state.auth.user?.userId)
  const params = useParams()
  const lessonId = params?.lessonId ? Number(params.lessonId) : id
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const token = useAppSelector((state) => state.auth.token)
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(Number(lessonId))
  const { data: sections } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !lessonId })

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)

  const courseId = lessonData?.data.courseId

  const sectionData = sections?.data?.items ?? []

  const { data: enrollment } = useSearchCourseEnrollmentQuery(
    { studentId: userId, courseId, pageNumber: 1, pageSize: 10 },
    {
      skip: !userId || !courseId
    }
  )

  const enrollmentId = enrollment?.data.items?.[0]?.id || 0

  const { data: sectionStatus } = useGetSectionStudentProgressQuery(
    {
      enrollmentId: enrollmentId,
      lessonId: Number(lessonId)
    },
    {
      skip: !enrollmentId
    }
  )

  useEffect(() => {
    if (sectionData.length > 0) {
      const firstSection = [...sectionData].sort((a, b) => a.orderIndex - b.orderIndex)[0]
      setSelectedSectionId(firstSection.id)
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
                    content: (
                      <LessonDescription
                        lessonData={lessonData}
                        lessonLoading={lessonLoading}
                        onPrintClick={() => setIsPrintModalOpen(true)}
                      />
                    )
                  },
                  {
                    value: 'sections',
                    label: `${t('sections')}`,
                    content: (
                      <LessonOutline
                        sectionData={sectionData}
                        selectedSectionId={selectedSectionId}
                        onSelectSection={setSelectedSectionId}
                        sectionStatus={sectionStatus}
                      />
                    )
                  }
                ]}
              />
            </ResizablePanel>
            <ResizableHandle />

            {/* Content */}
            <ResizablePanel defaultSize={70} minSize={40}>
              {selectedSectionId ? (
                <LessonContent
                  sectionId={selectedSectionId || 1}
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
      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={tc('printPreview')}
      >
        <LessonPrintableContent lessonData={lessonData} sectionData={sectionData} />
      </PrintPreviewModal>
    </div>
  )
}
