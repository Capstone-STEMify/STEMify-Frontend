'use client'
import { useEffect, useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useGetLessonByIdQuery } from '@/features/resource/lesson/api/lessonApi'
import { Button } from '@/components/shadcn/button'

const LessonDescription = dynamic(() => import('@/features/resource/lesson/components/detail/LessonDescription'), {
  ssr: false
})

const LessonContent = dynamic(() => import('@/features/resource/lesson/components/detail/LessonContent'), {
  ssr: false
})

const LessonOutline = dynamic(() => import('@/features/resource/lesson/components/detail/LessonOutline'), {
  ssr: false
})

export default function LessonDetail() {
  const { lessonId } = useParams()
  const router = useRouter()
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null)
  const token = useAppSelector((state) => state.auth.token)
  const { data: lessonData, isLoading: lessonLoading } = useGetLessonByIdQuery(Number(lessonId))
  const { data: sections } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !lessonId || !token })
  const sectionData = sections?.data.items || []

  useEffect(() => {
    if (sectionData.length > 0) {
      const firstSection = [...sectionData].sort((a, b) => a.orderIndex - b.orderIndex)[0]
      setSelectedSectionId(firstSection.id)
    }
  }, [sectionData])

  const handleUpdate = () => {
    router.push(`/resource/lesson/update/${lessonData?.data.id}`)
  }

  const handleCreate = () => {
    router.push(`/resource/lesson/create`)
  }

  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-5'>
              <BackButton />
              <SBreadcrumb title='Intro: Wetlands Biome' size={'md'} color={'yellow'} weight={'semibold'} />
            </div>
            <div className='flex items-center gap-5'>
              <Button onClick={handleUpdate} className='bg-amber-custom-400'>
                Update Lesson
              </Button>
              <Button onClick={handleCreate} className='bg-sky-custom-300'>
                Create Lesson
              </Button>
            </div>
          </div>

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
                    content: <LessonDescription lessonData={lessonData} lessonLoading={lessonLoading} />
                  },
                  {
                    value: 'sections',
                    label: 'Sections',
                    content: (
                      <LessonOutline
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
              {selectedSectionId && (
                <LessonContent
                  sectionId={selectedSectionId}
                  token={token}
                  courseId={lessonData?.data.courseId}
                  lessonId={Number(lessonId)}
                />
              )}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
