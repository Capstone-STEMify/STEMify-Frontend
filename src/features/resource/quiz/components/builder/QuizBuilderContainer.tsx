'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import QuestionsSidebar from '@/features/resource/quiz/components/builder/QuestionsSidebar'
import QuestionEditor from '@/features/resource/quiz/components/builder/QuestionEditor'

export default function QuizBuilderContainer() {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='bg-background flex h-screen'>
      {/* Mobile Header */}
      {isMobile && (
        <div className='bg-card border-border fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b px-4'>
          <h1 className='text-lg font-semibold'>Create Quiz</h1>
          <Button variant='ghost' size='icon' onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </Button>
        </div>
      )}

      {/* Sidebar */}
      {(!isMobile || sidebarOpen) && (
        <>
          {isMobile && <div className='fixed inset-0 z-40 bg-black/50' onClick={() => setSidebarOpen(false)} />}
          <div
            className={`${
              isMobile ? 'fixed top-16 bottom-0 left-0 z-50 w-80' : 'border-border w-80 border-r'
            } bg-card overflow-y-auto`}
          >
            <QuestionsSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'mt-16' : ''}`}>
        <QuestionEditor />
      </div>
    </div>
  )
}
