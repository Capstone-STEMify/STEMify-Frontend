'use client'

import { useState } from 'react'
import { ChevronRight, Settings, PanelLeft } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import QuizCreate from '@/features/resource/quiz/components/builder/quiz-creator/QuizCreator'
import QuizSettings from '@/features/resource/quiz/components/builder/quiz-creator/QuizSettingsSidebar'
import { Sheet, SheetContent, SheetTitle } from '@/components/shadcn/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

export default function QuizCreationLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className='flex flex-col md:h-[80vh] md:flex-row lg:h-[80vh] xl:h-[87vh] 2xl:h-[90vh]'>
      {/* Main Content */}
      <div className='relative flex-1 overflow-auto'>
        {isMobile && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute top-2 right-2 z-10 bg-white shadow-md'
            onClick={() => setMobileOpen(true)}
          >
            <PanelLeft className='h-5 w-5' />
          </Button>
        )}

        <QuizCreate />
      </div>

      {!isMobile && (
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-80' : 'w-16'}`}>
          <div
            className={`h-full ${
              sidebarOpen ? 'w-80' : 'w-16'
            } border-border bg-card flex flex-col border-l transition-all duration-300`}
          >
            {/* Sidebar Header */}
            <div
              className={`flex items-center ${
                sidebarOpen ? 'justify-between' : 'justify-center'
              } border-border border-b p-4`}
            >
              {sidebarOpen && <h2 className='text-foreground text-lg font-semibold'>Question Settings</h2>}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='hover:bg-muted h-8 w-8 p-0'
              >
                {sidebarOpen ? <ChevronRight className='h-4 w-4' /> : <Settings className='h-4 w-4' />}
              </Button>
            </div>

            {sidebarOpen && (
              <div className='flex-1 overflow-auto p-4'>
                <QuizSettings />
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side='right' className='w-[90vw] p-4 sm:w-[400px]'>
            <SheetTitle className='mb-4 text-2xl font-semibold'>Question Settings</SheetTitle>
            <QuizSettings />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
