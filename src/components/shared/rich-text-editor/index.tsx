'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import MenuBar from './menu-bar'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Image from '@tiptap/extension-image'
import ResizeImage from 'tiptap-extension-resize-image'

import { handleFiles } from '@/components/shared/rich-text-editor/handleFiles'
import { Video } from '@/components/shared/rich-text-editor/Video'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}
export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3'
          }
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight,
      HorizontalRule,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md my-4 max-w-full h-auto'
        }
      }),
      ResizeImage,
      Video
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'min-h-[300px] border rounded-md bg-slate-50 py-2 px-3 ring-0 focus:outline-none focus:ring-2 focus:ring-blue-200 mt-3'
      },
      handleDOMEvents: {
        dragover: (view, event) => {
          event.preventDefault()
          return true
        },
        drop: (view, event: DragEvent) => {
          event.preventDefault()
          const files = event?.dataTransfer?.files
          if (!files?.length) return false

          handleFiles(files, view)
          return true
        },
        paste: (view, event: ClipboardEvent) => {
          const items = event.clipboardData?.items
          if (!items?.length) return false

          const files = Array.from(items)
            .filter((item) => item.type.indexOf('image') !== -1)
            .map((item) => item.getAsFile())
            .filter(Boolean) as File[]

          if (files.length) {
            handleFiles(files, view)
            return true
          }

          return false
        }
      }
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    }
  })

  return (
    <div>
      <MenuBar editor={editor} />
      <div>
        <input
          type='file'
          accept='image/*'
          hidden
          onChange={(e) => {
            const files = e.target.files
            if (files?.length && editor) {
              handleFiles(files, editor.view)
            }
          }}
        />
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
