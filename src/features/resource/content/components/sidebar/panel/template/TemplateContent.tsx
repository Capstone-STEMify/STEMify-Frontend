import { ExternalLink, HelpCircle, ListChecks, NotebookPen } from 'lucide-react'
import React from 'react'
import { useEditorCtx } from '@/components/tiptap/EditorContext'
import { Button } from '@/components/shadcn/button'
import { useTranslations } from 'next-intl'

export default function TemplateContent() {
  const tc = useTranslations('common')
  const tContent = useTranslations('content')
  const editor = useEditorCtx()
  if (!editor) {
    return <div className='p-4 text-sm text-red-500'>{tc('somethingWrong')}</div>
  }

  return (
    <div className='my-2 px-4'>
      <h3 className='mb-3 text-sm font-semibold text-gray-700'>{tContent('insertBlock')}</h3>

      <div className='grid grid-cols-2 gap-3'>
        {/* Link Button */}
        <Button
          variant='outline'
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent([
                {
                  type: 'linkButtonBlock',
                  attrs: { label: 'EXPLORE NOW', url: '' }
                },
                { type: 'paragraph' }
              ])
              .run()
          }
          className='p-8'
        >
          <div className='flex flex-col items-center gap-1'>
            <ExternalLink className='h-5 w-5' />
            <span className='text-[11px]'>{tContent('buttonLink')}</span>
          </div>
        </Button>

        {/* Step */}
        <Button
          variant='outline'
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent([
                {
                  type: 'stepBlock',
                  attrs: {
                    steps: [{ title: 'Step 1: Start', content: 'Mô tả bước 1...', imageUrl: '' }],
                    currentStep: 0
                  }
                },
                { type: 'paragraph' }
              ])
              .run()
          }
          className='p-8'
        >
          <div className='flex flex-col items-center gap-1'>
            <ListChecks className='h-5 w-5' />
            <span className='text-[11px]'>{tContent('step')}</span>
          </div>
        </Button>

        {/* Quiz */}
        <Button
          variant='outline'
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent([
                {
                  type: 'quizBlock',
                  attrs: {
                    question: 'What is the main difference between a freshwater biome and a marine biome?',
                    options: [{ id: 'A', text: '', isCorrect: false }]
                  }
                },
                { type: 'paragraph' }
              ])
              .run()
          }
          className='p-8'
        >
          <div className='flex flex-col items-center gap-1'>
            <HelpCircle className='h-5 w-5' />
            <span className='text-[11px]'>{tContent('quiz')}</span>
          </div>
        </Button>

        {/* Teacher Note */}
        <Button
          variant='outline'
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent([
                {
                  type: 'noteBlock',
                  attrs: { title: '', content: '' }
                },
                { type: 'paragraph' }
              ])
              .run()
          }
          className='p-8'
        >
          <div className='flex flex-col items-center gap-1'>
            <NotebookPen className='h-5 w-5' />
            <span className='text-[11px]'>{tContent('note')}</span>
          </div>
        </Button>
      </div>
    </div>
  )
}
