'use client'

import { EditorContent } from '@tiptap/react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'
import { EditorProvider } from '@/components/tiptap/EditorContext'
import { Toolbar } from './toolbar/Toolbar'
import TipTapSidebar from '@/components/tiptap/sidebar/TipTapSidebar'
import { ScrollArea } from '@/components/shadcn/scroll-area'

interface TiptapEditorProps {
  content?: string
  onChange: (richText: string) => void
  children?: React.ReactNode
}

export default function TiptapEditor({ content, onChange, children }: TiptapEditorProps) {
  const editor = useTiptapEditor({ content, onChange })

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) return <div className='p-4 text-sm text-red-500'>Something wrong, please contact support</div>

  return (
    <EditorProvider editor={editor}>
      <div className='flex h-full w-full bg-white'>
        <div className=''>
          <TipTapSidebar />
        </div>
        <div className='flex flex-1 flex-col'>
          {/* Toolbar giống header */}
          <div className='w-full border-b'>
            <Toolbar editor={editor} />
          </div>

          <ScrollArea className='h-[83.1vh] w-full overflow-hidden lg:h-[calc(100vh-9.9rem)] xl:h-[calc(100vh-7.3rem)]'>
            <div className='mx-auto w-full max-w-7xl'>
              <EditorContent editor={editor} className='h-full w-full outline-none' />
            </div>
          </ScrollArea>
        </div>
      </div>
    </EditorProvider>
  )
}
