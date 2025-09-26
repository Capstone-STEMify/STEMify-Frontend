'use client'

import { Button } from '@/components/shadcn/button'
import { useMarkActive, useNodeActive } from '@/components/tiptap/extension/tiptapHelper'
import { AlignDropdown } from '@/components/tiptap/toolbar/dropdown/AlignDropdown'
import { ListDropdown } from '@/components/tiptap/toolbar/dropdown/ListDropDown'
import { TextColorDropdown } from '@/components/tiptap/toolbar/dropdown/TextColorDropdown'
import { ToolbarButton } from '@/components/tiptap/toolbar/ToolbarButton'
import { triggerSave } from '@/features/resource/content/slice/editorSlice'
import { Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Save,
  Highlighter
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'

type Props = {
  editor: Editor | null
}

export const Toolbar = ({ editor }: Props) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [url, setUrl] = useState('')
  const dispatch = useDispatch()

  const setLink = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
    setShowLinkInput(false)
    setUrl('')
  }, [editor, url])

  // dùng hooks custom
  const isBold = useMarkActive(editor, 'bold')
  const isItalic = useMarkActive(editor, 'italic')
  const isUnderline = useMarkActive(editor, 'underline')
  const isStrike = useMarkActive(editor, 'strike')
  const isCode = useMarkActive(editor, 'code')
  const isLink = useMarkActive(editor, 'link')
  const isHighlight = useMarkActive(editor, 'highlight')

  const isHeading1 = useNodeActive(editor, 'heading', { level: 1 })
  const isHeading2 = useNodeActive(editor, 'heading', { level: 2 })
  const isHeading3 = useNodeActive(editor, 'heading', { level: 3 })

  const isSuperscript = useMarkActive(editor, 'superscript')
  const isSubscript = useMarkActive(editor, 'subscript')

  const isBulletList = useNodeActive(editor, 'bulletList')
  const isOrderedList = useNodeActive(editor, 'orderedList')
  const isBlockquote = useNodeActive(editor, 'blockquote')

  const isAlignLeft = useNodeActive(editor, 'paragraph', { textAlign: 'left' })
  const isAlignCenter = useNodeActive(editor, 'paragraph', { textAlign: 'center' })
  const isAlignRight = useNodeActive(editor, 'paragraph', { textAlign: 'right' })
  const isAlignJustify = useNodeActive(editor, 'paragraph', { textAlign: 'justify' })

  if (!editor) {
    return (
      <div className='h-[48px] animate-pulse rounded-t-lg border-b border-gray-200 bg-gray-100 p-2'>
        Something went wrong
      </div>
    )
  }

  return (
    <div className='flex w-fit flex-wrap items-center gap-1 p-2'>
      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className='h-4 w-4' />
      </ToolbarButton>

      <TextColorDropdown editor={editor} />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={!!isHighlight}>
        <Highlighter className='h-4 w-4' />
      </ToolbarButton>

      {/* Headings */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={!!isHeading1}>
        <Heading1 className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={!!isHeading2}>
        <Heading2 className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={!!isHeading3}>
        <Heading3 className='h-4 w-4' />
      </ToolbarButton>

      {/* Marks */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={!!isBold}>
        <Bold className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={!!isItalic}>
        <Italic className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={!!isUnderline}>
        <Underline className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={!!isStrike}>
        <Strikethrough className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={!!isCode}>
        <Code className='h-4 w-4' />
      </ToolbarButton>

      {/* Link */}
      <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} isActive={!!isLink}>
        <LinkIcon className='h-4 w-4' />
      </ToolbarButton>
      {showLinkInput && (
        <div className='ml-2 flex items-center gap-1'>
          <input
            type='text'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setLink()}
            placeholder='https://example.com'
            className='rounded-md border bg-gray-100 px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100'
          />
          <ToolbarButton onClick={setLink}>Lưu</ToolbarButton>
        </div>
      )}

      {/* Script */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={!!isSuperscript}>
        <SuperIcon className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={!!isSubscript}>
        <SubIcon className='h-4 w-4' />
      </ToolbarButton>

      {/* Alignment */}
      <AlignDropdown
        editor={editor}
        isAlignLeft={!!isAlignLeft}
        isAlignCenter={!!isAlignCenter}
        isAlignRight={!!isAlignRight}
        isAlignJustify={!!isAlignJustify}
      />

      {/* Lists */}
      <ListDropdown editor={editor} isBulletList={!!isBulletList} isOrderedList={!!isOrderedList} />

      {/* Blockquote */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={!!isBlockquote}>
        <Quote className='h-4 w-4' />
      </ToolbarButton>

      {/* Save */}
      <Button variant='ghost' onClick={() => dispatch(triggerSave())}>
        <Save className='h-4 w-4' />
      </Button>
    </div>
  )
}
