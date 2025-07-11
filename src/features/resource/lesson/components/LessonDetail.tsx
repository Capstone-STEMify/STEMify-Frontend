'use client'
import { useState } from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import LessonDescription from '@/features/resource/lesson/components/detail/LessonDescription'
import LessonOutline from '@/features/resource/lesson/components/detail/LessonOutline'
import LessonContent from '@/features/resource/lesson/components/detail/LessonContent'

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
                className='pt-4'
                customStyle={{
                  list: 'py-7 px-2 flex items-center justify-between bg-light mb-4 grid  grid-cols-2 p-4',
                  trigger:
                    'py-5 data-[state=active]:bg-white data-[state=active]:shadow-6 text-blue-700 data-[state=active]:font-bold '
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
