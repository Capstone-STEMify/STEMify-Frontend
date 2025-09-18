'use client'

import { Button } from '@/components/shadcn/button'
import SToolTip from '@/components/shared/SToolTip'
import { type Editor } from '@tiptap/react'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Image,
  Undo,
  Redo,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Save,
  Boxes,
  HelpCircle,
  Notebook
} from 'lucide-react'
import { useState, useCallback, useRef, ChangeEvent } from 'react'

type Props = {
  editor: Editor | null
  onSave: () => void
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  disabled
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  disabled?: boolean
}) => (
  <button
    type='button'
    onClick={onClick}
    disabled={disabled}
    className={`rounded-md p-2 transition-colors duration-200 ${isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
  >
    {children}
  </button>
)

export const Toolbar = ({ editor, onSave }: Props) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [url, setUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (!editor || !event.target.files || event.target.files.length === 0) {
        return
      }
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        editor
          .chain()
          .focus()
          .setImage({ src: reader.result as string })
          .run()
      }
      // Reset the input value to allow uploading the same file again
      event.target.value = ''
    },
    [editor]
  )

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const setLink = useCallback(() => {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      setShowLinkInput(false)
      setUrl('')
      return
    }
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      setShowLinkInput(false)
      setUrl('')
    }
  }, [editor, url])

  if (!editor) {
    return (
      <div className='h-[48px] animate-pulse rounded-t-lg border-b border-gray-200 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800'></div>
    )
  }

  return (
    <div className='flex flex-wrap items-center justify-start gap-1 rounded-t-lg border-b border-gray-200 bg-gray-50 p-1.5 pr-10 dark:border-gray-700 dark:bg-gray-900'>
      <input type='file' ref={fileInputRef} onChange={handleFileChange} className='hidden' accept='image/*' />
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
      >
        <Heading3 className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <Bold className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <Italic className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
      >
        <Underline className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')}>
        <Strikethrough className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} isActive={editor.isActive('code')}>
        <Code className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton onClick={handleImageClick}>
        <Image className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton onClick={() => setShowLinkInput(!showLinkInput)} isActive={editor.isActive('link')}>
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
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive('superscript')}
      >
        <SuperIcon className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive('subscript')}
      >
        <SubIcon className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
      >
        <AlignLeft className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
      >
        <AlignCenter className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
      >
        <AlignRight className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        isActive={editor.isActive({ textAlign: 'justify' })}
      >
        <AlignJustify className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        <List className='h-4 w-4' />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        <ListOrdered className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>
      <ToolbarButton
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'stepBlock',
              attrs: {
                steps: [
                  { title: 'Step 1: Start', content: 'Mô tả bước 1...', imageUrl: '' },
                  { title: 'Step 2: Continue', content: 'Mô tả bước 2...', imageUrl: '' },
                  { title: 'Step 3: Finish', content: 'Mô tả bước 3...', imageUrl: '' }
                ],
                currentStep: 0
              }
            })
            .run()
        }}
      >
        <Boxes className='h-4 w-4' />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'quizBlock',
              attrs: {
                question: 'What is the main difference between a freshwater biome and a marine biome?',
                options: [
                  { id: 'A', text: 'The temperature.', isCorrect: false },
                  { id: 'B', text: 'Freshwater biomes have more bubbles than marine biomes.', isCorrect: false },
                  { id: 'C', text: "Freshwater biomes doesn't maintain enough biodiversity.", isCorrect: false },
                  {
                    id: 'D',
                    text: 'Freshwater has less salt than a marine biome.',
                    isCorrect: true,
                    explanation: 'Marine biomes have higher salt concentration than freshwater.'
                  }
                ]
              }
            })
            .run()
        }}
      >
        <HelpCircle className='h-4 w-4' />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => {
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'noteBlock',
              attrs: {
                title: 'Teacher Note Title',
                content: 'This is a note for teachers. Students will not see this.'
              }
            })
            .run()
        }}
      >
        <Notebook className='h-4 w-4' />
      </ToolbarButton>
      <span className='mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600'></span>

      <div className='flex justify-end'>
        <SToolTip content='Lưu' side='bottom'>
          <Button variant={'ghost'} onClick={onSave}>
            <Save className='h-4 w-4' />
          </Button>
        </SToolTip>
      </div>
    </div>
  )
}
