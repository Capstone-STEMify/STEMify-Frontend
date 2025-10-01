'use client'

import { EditorContent } from '@tiptap/react'

import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'
import { useEffect } from 'react'

interface TiptapViewerProps {
  content: string
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useTiptapEditor({ content, isEditable: false })

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

  if (!editor && !content) return <div>No editor, please try again</div>

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
