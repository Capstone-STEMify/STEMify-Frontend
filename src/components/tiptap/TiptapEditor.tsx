'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import CodeBlock from '@tiptap/extension-code-block'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Toolbar } from './Toolbar'
import { useEffect, useMemo } from 'react'
import { StepBlock } from '@/components/tiptap/block/step/StepBlock'
import { QuizBlock } from '@/components/tiptap/block/quiz/QuizBlock'
import { NoteBlock } from '@/components/tiptap/block/note/NoteBlock'
import { LinkButtonBlock } from '@/components/tiptap/block/button/link/LinkButtonBlock'
import { Video } from '@/components/tiptap/block/asset/VideoBlock'
import { CustomImage } from '@/components/tiptap/block/asset/CustomImage'
import { debounce } from 'lodash-es'

interface TiptapEditorProps {
  content?: string
  onChange: (richText: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const debouncedOnChange = useMemo(
    () =>
      debounce((html: string) => {
        onChange?.(html)
      }, 300),
    [onChange]
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer'
        }
      }),
      CustomImage,
      Video,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-800 text-white p-2 my-2 rounded-md font-mono'
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc pl-5'
        }
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal pl-5'
        }
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic my-4'
        }
      }),
      Underline,
      Superscript,
      Subscript,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung ở đây...',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none before:absolute '
      }),
      LinkButtonBlock,
      NoteBlock,
      QuizBlock,
      Highlight,
      StepBlock
    ],
    content: content || '',
    onUpdate({ editor }) {
      debouncedOnChange(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-7xl py-6 px-15 focus:outline-none'
      }
    }
  })
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])
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
