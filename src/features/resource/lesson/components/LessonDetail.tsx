'use client'

import * as React from 'react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/shadcn/resizable'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import BackButton from '@/components/shared/button/BackButton'
import STabs from '@/components/shared/STabs'
import LessonDescription from '@/features/resource/lesson/components/lesson-detail/LessonDescription'
import LessonOutline from '@/features/resource/lesson/components/lesson-detail/LessonOutline'
import LessonContent from '@/features/resource/lesson/components/lesson-detail/LessonContent'

export default function LessonDetail() {
  const [selected, setSelected] = React.useState(1)

  const description = `The Wetlands is a unique ecosystem covered or saturated with water for most of the year, and this biome
              includes marshes, swamps, and bogs. The slow-moving waters and nutrients abundant in wetlands support a
              unique ecosystem with birds, fish, reptiles, and insects specially adapted to these conditions. Wetlands
              are also important in regulating the water cycle, as they help to reduce the impact of floods and droughts
              by absorbing and releasing water over time. The Wetlands is a unique ecosystem covered or saturated with
              water for most of the year, and this biome includes marshes, swamps, and bogs. The slow-moving waters and
              nutrients abundant in wetlands support a unique ecosystem with birds, fish, reptiles, and insects
              specially adapted to these conditions. Wetlands are also important in regulating the water cycle, as they
              help to reduce the impact of floods and droughts by absorbing and releasing water over time.`
  const title = 'Intro: Wetlands Biome'
  const author = 'Strawbees Team'
  const categories = ['Biology', 'Animals', 'History']
  const imageUrl =
    'https://images.unsplash.com/photo-1528732262645-b06fa3a79c9e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title='Intro: Wetlands Biome' size={'md'} color={'yellow'} weight={'semibold'} />
          </div>

          <ResizablePanelGroup direction='horizontal' className='shadow-6 mt-6 h-screen rounded-lg bg-white'>
            <ResizablePanel defaultSize={30} minSize={20} className='min-h-[500px]'>
              <STabs
                customStyle={{
                  list: 'bg-light py-7 flex items-center justify-between ',
                  trigger:
                    'py-5 data-[state=active]:bg-white data-[state=active]:shadow-6 text-blue-700 data-[state=active]:font-bold'
                }}
                defaultValue='description'
                items={[
                  {
                    value: 'description',
                    label: 'Description',
                    content: (
                      <LessonDescription
                        lessonId={1}
                        imageUrl={imageUrl}
                        author={author}
                        description={description}
                        categories={categories}
                        title={title}
                      />
                    )
                  },
                  {
                    value: 'sections',
                    label: 'Sections',
                    content: (
                      <LessonOutline
                        sections={[
                          { id: 1, label: 'Introdcution Wetlands Biome' },
                          { id: 2, label: 'Animals in Wetlands' },
                          { id: 3, label: 'Water Cycle' },
                          { id: 4, label: 'Environmental Impact' }
                        ]}
                        selectedId={selected}
                        onSelect={(id) => setSelected(id)}
                      />
                    )
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
