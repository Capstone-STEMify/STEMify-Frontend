'use client'

import { EditorContent } from '@tiptap/react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'
import { EditorProvider } from '@/components/tiptap/EditorContext'
import { Toolbar } from './toolbar/Toolbar'
import TipTapSidebar from '@/components/tiptap/sidebar/TipTapSidebar'

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
      <div className='relative flex h-[90vh] w-full flex-row bg-white'>
        <TipTapSidebar />

        <div className='flex flex-1 flex-col'>
          <div className='sticky top-0 z-50 border-b bg-white'>
            <Toolbar editor={editor} />
          </div>
          <div className='flex-1 overflow-auto'>
            <EditorContent editor={editor} className='h-full w-full' />
            {children}
          </div>
        </div>
      </div>
    </EditorProvider>
  )
}
