'use client'

import { EditorContent } from '@tiptap/react'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTiptapEditor } from '@/components/tiptap/useTiptapEditor'
import { EditorProvider } from '@/components/tiptap/EditorContext'
import { Toolbar } from './toolbar/Toolbar'
import TipTapSidebar from '@/components/tiptap/sidebar/TipTapSidebar'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { usePostLessonAssetsMutation } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { fileToBase64 } from '@/utils/index'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface TiptapEditorProps {
  content?: string
  onChange: (richText: string) => void
  children?: React.ReactNode
}

export default function TiptapEditor({ content, onChange, children }: TiptapEditorProps) {
  const tc = useTranslations('toast')
  const { lessonId } = useParams()
  const storageKey = `tiptap_draft_${lessonId ?? 'default'}`

  // Prefer locally saved draft for initial content if available
  const localDraft = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
  const initialContent = localDraft ?? content

  const editor = useTiptapEditor({
    content: initialContent,
    onChange: (html: string) => {
      try {
        localStorage.setItem(storageKey, html)
      } catch (e) {
        // ignore storage errors
      }
      onChange(html)
    },
    isEditable: true
  })
  const [uploadFiles, { isLoading }] = usePostLessonAssetsMutation()

  useEffect(() => {
    if (!editor) return
    // Only override with server content if there is no local draft
    const hasLocal = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
    if (content !== undefined && !hasLocal && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor, storageKey])

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!editor) return <div className='p-4 text-sm text-red-500'>Something wrong, please contact support</div>

  const uploadAndInsert = async (files: File[], editor: any, lessonId: number) => {
    const lessonAssets = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file)
        return {
          name: file.name,
          assetBytes: base64
        }
      })
    )

    const res = await uploadFiles({
      lessonId: Number(lessonId),
      body: { lessonAssets }
    }).unwrap()
    toast.success(tc('successMessage.uploadFile'))
    res.data.assets.forEach((asset: any) => {
      editor.chain().focus().setImage({ src: asset.assetUrl, alt: asset.name }).run()
    })
  }
  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault()

    const url = event.dataTransfer.getData('text/uri-list') || event.dataTransfer.getData('text/plain')
    if (url && url.startsWith('http')) {
      editor.chain().focus().setImage({ src: url }).run()
      return
    }

    const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (files.length > 0) {
      await uploadAndInsert(files, editor, Number(lessonId))
    }
  }

  const handlePaste = async (event: React.ClipboardEvent) => {
    const files: File[] = []
    for (const item of event.clipboardData.items) {
      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      event.preventDefault()
      await uploadAndInsert(files, editor, Number(lessonId))
    }
  }

  return (
    <EditorProvider editor={editor}>
      <div className='flex h-full w-full bg-white'>
        <div className=''>
          <TipTapSidebar />
        </div>
        <div className='flex flex-1 flex-col'>
          {/* Toolbar giống header */}
          <div className='w-full border-b'>
            <Toolbar editor={editor} />
          </div>

          <ScrollArea className='h-[83.1vh] w-full overflow-hidden lg:h-[calc(100vh-9.9rem)] xl:h-[calc(100vh-7.3rem)]'>
            <div
              className='mx-auto w-full max-w-7xl'
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onPaste={handlePaste}
            >
              <EditorContent editor={editor} className='h-full w-full outline-none' />
            </div>
          </ScrollArea>
        </div>
      </div>
    </EditorProvider>
  )
}
