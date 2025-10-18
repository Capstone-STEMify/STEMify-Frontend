'use client'

import { Button } from '@/components/shadcn/button'
import { ImageIcon } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { Textarea } from '@/components/shadcn/textarea'
import BackButton from '@/components/shared/button/BackButton'
import { Label } from '@/components/shadcn/label'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'

export default function QuizCreate() {
  const { openModal } = useModal()
  return (
    <div className='mx-auto mt-4 max-w-3xl'>
      {/* Header */}
      <div className='mb-5 flex items-center justify-between'>
        <BackButton />
        <h1 className='text-xl font-semibold'>Create new Quiz</h1>
        <Button className='bg-blue-600 px-6 text-white hover:bg-blue-700' onClick={() => openModal('quizAI')}>Continue</Button>
      </div>

      <div>
        <div className='mb-3'>
          <div className='group relative flex h-40 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 transition-shadow hover:shadow-lg'>
            <div className='text-center text-white'>
              <div className='mb-2 text-5xl'>📚</div>
            </div>
            <Button size='sm' className='absolute right-3 bottom-3 gap-2 bg-white text-gray-800 hover:bg-gray-100'>
              <ImageIcon className='h-4 w-4' />
              Add thumbnail
            </Button>
          </div>
        </div>

        <h2 className='text-foreground mb-3 text-xl font-bold'>What is this Quiz?</h2>

        <div className='mb-3 flex flex-row items-center gap-2'>
          <Label className='whitespace-nowrap'>Estimate duration</Label>
          <Input className='w-fit' placeholder='e.g., 1 hour' type='time' />
        </div>

        {/* Quiz Description */}
        <div>
          <Label className='mb-2'>Description</Label>
          <div className='relative'>
            <Textarea placeholder='Type description here...' className='resize-none pr-12' />
            <span className='text-muted-foreground absolute right-3 bottom-2 text-xs'>0/400</span>
          </div>
        </div>
      </div>
    </div>
  )
}
