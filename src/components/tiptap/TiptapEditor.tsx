'use client'

import { EditorContent } from '@tiptap/react'

import { Toolbar } from './toolbar/Toolbar'
import { useEffect } from 'react'

import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'

interface TiptapEditorProps {
  content?: string
  onChange: (richText: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useTiptapEditor({ content, onChange })

  useEffect(() => {
    return () => {
      // cleanup debounce
      editor?.destroy()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className='min-h-[90vh] bg-white'>
      {/* Sticky toolbar */}
      <div className='sticky top-0 z-50 border-b bg-white'>
        <Toolbar editor={editor} />
      </div>

      <div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
