'use client'
import { useEffect, useMemo, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import STabs from '@/components/shared/STabs'
import { useParams, useRouter } from 'next/navigation'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import LessonSectionDescription from './detail/LessonSectionDescription'
import LessonSectionOutline from './detail/LessonSectionOutline'
import LessonSectionContent from './detail/LessonSectionContent'

export default function UpdateSection() {
  const { lessonId } = useParams()
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const token = useAppSelector((state) => state.auth.token)
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(Number(lessonId))
  const { data: sections } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !lessonId || !token })

  const sectionData = useMemo(() => {
    return sections?.data?.items ?? []
  }, [sections?.data?.items])

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
          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={30} minSize={20} className='min-h-[500px]'>
              <STabs
                customStyle={{
                  list: 'px-4 py-8 rounded-none bg-[#f8fbff] shadow-6 gap-3 mb-3',
                  trigger:
                    'py-5 bg-white text-sky-700 rounded-lg border border-gray-200 hover:bg-sky-50 hover:text-sky-700 transition duration-200 data-[state=active]:bg-sky-300 data-[state=active]:text-white'
                }}
                defaultValue='description'
                items={[
                  {
                    value: 'description',
                    label: 'Description',
                    content: <LessonSectionDescription lessonData={lessonData} lessonLoading={lessonLoading} />
                  },
                  {
                    value: 'sections',
                    label: 'Sections',
                    content: (
                      <LessonSectionOutline
                        sectionData={sectionData}
                        selectedSectionId={selectedSectionId}
                        onSelectSection={setSelectedSectionId}
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
                <LessonSectionContent
                  sectionId={selectedSectionId}
                  token={token}
                  courseId={lessonData?.data.courseId}
                  lessonId={Number(lessonId)}
                />
              ) : (
                <div className=''>No Content Available For This Section</div>
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
