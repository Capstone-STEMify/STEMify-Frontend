'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import { StepBlock } from '@/components/tiptap/StepBlock'

interface TiptapViewerProps {
  content: string
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    editable: false,
    content: content || '<p>No content</p>',
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline'
        }
      }),
      Image.configure({ inline: true, allowBase64: true }),
      CodeBlock,
      Blockquote,
      BulletList,
      OrderedList,
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      StepBlock
    ],
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert h-full w-full max-w-full focus:outline-none'
      }
    },
    immediatelyRender: false
  })

  if (!editor) return null

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
