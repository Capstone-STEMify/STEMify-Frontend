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
import Placeholder from '@tiptap/extension-placeholder'

import { Toolbar } from './Toolbar'
import { useEffect } from 'react'
import { ScrollArea } from '@/components/shadcn/scroll-area'

interface TiptapEditorProps {
  content?: string
  onChange: (richText: string) => void
  onSave: () => void
}

export default function TiptapEditor({ content, onChange, onSave }: TiptapEditorProps) {
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
      Image.configure({
        inline: true,
        allowBase64: true
      }),
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
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: 'Bắt đầu viết nội dung ở đây...',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-400 before:pointer-events-none before:absolute before:left-20 before:top-6'
      })
    ],
    content: content || '',
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-7xl py-6 pl-20 pr-5 focus:outline-none'
      }
    }
  })
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [content, editor])
  return (
    <div className='min-h-[90vh] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900'>
      <Toolbar onSave={onSave} editor={editor} />
      <ScrollArea className='h-[calc(80vh-100px)]'>
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  )
}
