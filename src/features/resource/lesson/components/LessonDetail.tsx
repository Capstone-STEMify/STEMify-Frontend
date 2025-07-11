'use client'
import { useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import dynamic from 'next/dynamic'

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
  const [selected, setSelected] = useState(1)

  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto max-w-7xl py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title='Intro: Wetlands Biome' size={'md'} color={'yellow'} weight={'semibold'} />
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
                    content: <LessonDescription />
                  },
                  {
                    value: 'sections',
                    label: 'Sections',
                    content: <LessonOutline selectedId={selected} onSelect={(id) => setSelected(id)} />
                  }
                ]}
              />
            </ResizablePanel>
            <ResizableHandle />

            {/* Content */}
            <ResizablePanel defaultSize={70} minSize={40}>
              <LessonContent selectedId={selected} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}
