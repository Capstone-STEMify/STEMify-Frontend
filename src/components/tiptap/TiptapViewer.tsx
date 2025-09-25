'use client'

import { EditorContent } from '@tiptap/react'

import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'

interface TiptapViewerProps {
  content: string
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useTiptapEditor({ content })

  if (!editor) return <div>No editor, please try again</div>

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
