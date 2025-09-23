import { ToolbarButton } from '@/components/tiptap/toolbar/ToolbarButton'
import { ExternalLink, HelpCircle, ListChecks, NotebookPen, Quote } from 'lucide-react'
import { type Editor } from '@tiptap/react'
import React from 'react'

export default function TemplateContent() {
  const editor = null as Editor | null
  if (!editor) {
    return (
      <div className='h-[48px] animate-pulse rounded-t-lg border-b border-gray-200 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800'></div>
    )
  }
  return (
    <div>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>

      <ToolbarButton
        tooltip='Blockquote'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>

      <ToolbarButton
        tooltip='Link Button'
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'linkButtonBlock',
              attrs: {
                label: 'EXPLORE NOW',
                url: ''
              }
            })
            .run()
        }}
      >
        <ExternalLink className='h-4 w-4' />
      </ToolbarButton>

      <ToolbarButton
        tooltip='Step'
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'stepBlock',
              attrs: {
                steps: [{ title: 'Step 1: Start', content: 'Mô tả bước 1...', imageUrl: '' }],
                currentStep: 0
              }
            })
            .run()
        }}
      >
        <ListChecks className='h-4 w-4' />
      </ToolbarButton>

      <ToolbarButton
        tooltip='Quiz'
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'quizBlock',
              attrs: {
                question: 'What is the main difference between a freshwater biome and a marine biome?',
                options: [{ id: 'A', text: '', isCorrect: false }]
              }
            })
            .run()
        }}
      >
        <HelpCircle className='h-4 w-4' />
      </ToolbarButton>

      <ToolbarButton
        tooltip='Teacher Note'
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'noteBlock',
              attrs: {
                title: '',
                content: ''
              }
            })
            .run()
        }}
      >
        <NotebookPen className='h-4 w-4' />
      </ToolbarButton>
    </div>
  )
}
