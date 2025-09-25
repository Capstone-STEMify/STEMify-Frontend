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
import { StepBlock } from '@/components/tiptap/block/step/StepBlock'
import { QuizBlock } from '@/components/tiptap/block/quiz/QuizBlock'
import { NoteBlock } from '@/components/tiptap/block/note/NoteBlock'
import { LinkButtonBlock } from '@/components/tiptap/block/button/link/LinkButtonBlock'
import { Video } from '@/components/tiptap/block/asset/video/VideoBlock'
import { CustomImage } from '@/components/tiptap/block/asset/image/CustomImage'
import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'

interface TiptapViewerProps {
  content: string
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useTiptapEditor({ content })

  if (!editor) return null

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  )
}
