'use client'

import { useEditor } from '@tiptap/react'
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
import { Typography } from '@tiptap/extension-typography'
import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { StepBlock } from '@/components/tiptap/block/step/StepBlock'
import { QuizBlock } from '@/components/tiptap/block/quiz/QuizBlock'
import { NoteBlock } from '@/components/tiptap/block/note/NoteBlock'
import { LinkButtonBlock } from '@/components/tiptap/block/button/link/LinkButtonBlock'
import { Video } from '@/components/tiptap/block/asset/video/VideoBlock'
import { CustomImage } from '@/components/tiptap/block/asset/image/CustomImage'
import { useMemo } from 'react'
import { debounce } from 'lodash-es'
import { ColorHighlighter } from '@/components/tiptap/extension/colorHighlighter'
import { SmilieReplacer } from '@/components/tiptap/extension/smilieReplacer'

interface UseTiptapEditorProps {
  content?: string
  onChange?: (richText: string) => void
  isEditable?: boolean
}

export function useTiptapEditor({ content, onChange, isEditable = true }: UseTiptapEditorProps) {
  const debouncedOnChange = useMemo(
    () =>
      debounce((html: string) => {
        onChange?.(html)
      }, 300),
    [onChange]
  )

  const editor = useEditor({
    editable: isEditable,
    extensions: [
      StarterKit.configure({
        link: false,
        code: false,
        paragraph: false,
        document: false,
        text: false,
        underline: false,
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
      CustomImage.configure({
        allowBase64: true,
        inline: true
      }),
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
      Document,
      Paragraph,
      Text,
      Code,
      ColorHighlighter,
      SmilieReplacer,
      Underline,
      Superscript,
      Typography,
      Subscript,
      TextStyle,
      Color.configure({ types: ['textStyle'] }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung ở đây...',
        emptyEditorClass: 'before:content-[attr(data-placeholder)] before:text-gray-400  before:absolute '
      }),
      LinkButtonBlock,
      NoteBlock,
      QuizBlock,
      Highlight,
      StepBlock.configure({
        allowBase64: true,
        inline: true
      })
    ],
    content: content || '',
    onUpdate({ editor }) {
      debouncedOnChange(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-7xl py-6 px-15 focus:outline-none '
      }
    }
  })

  return editor
}
