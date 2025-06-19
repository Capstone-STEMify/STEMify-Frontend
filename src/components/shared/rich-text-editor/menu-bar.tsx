import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image,
  Italic,
  List,
  ListOrdered,
  MessageSquareQuote,
  SquareSplitVertical,
  Strikethrough
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toggle } from '@/components/shadcn/toggle'

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null
  }

  const Options = [
    {
      icon: <Image className='size-4' />,
      onClick: () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*, video/*'
        input.style.display = 'none'

        input.addEventListener('change', () => {
          const file = input.files?.[0]
          if (!file) return

          const reader = new FileReader()
          reader.onload = () => {
            const result = reader.result as string
            const isImage = file.type.startsWith('image/')
            const isVideo = file.type.startsWith('video/')

            const chain = editor.chain().focus()

            if (isImage) {
              chain.setImage({ src: result }).run()
            } else if (isVideo && editor.schema.nodes.video) {
              chain
                .insertContent({
                  type: 'video',
                  attrs: { src: result }
                })
                .run()
            }
          }
          reader.readAsDataURL(file)
          input.remove()
        })

        document.body.appendChild(input)
        input.click()
      },
      pressed: false
    },
    {
      icon: <SquareSplitVertical className='size-4' />,
      onClick: () => editor.chain().focus().setHorizontalRule().run(),
      pressed: editor.isActive('blockquote')
    },
    {
      icon: <MessageSquareQuote className='size-4' />,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      pressed: editor.isActive('blockquote')
    },
    {
      icon: <Heading1 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive('heading', { level: 1 })
    },
    {
      icon: <Heading2 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive('heading', { level: 2 })
    },
    {
      icon: <Heading3 className='size-4' />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive('heading', { level: 3 })
    },
    {
      icon: <Bold className='size-4' />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive('bold')
    },
    {
      icon: <Italic className='size-4' />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive('italic')
    },
    {
      icon: <Strikethrough className='size-4' />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive('strike')
    },
    {
      icon: <AlignLeft className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('left').run(),
      pressed: editor.isActive({ textAlign: 'left' })
    },
    {
      icon: <AlignCenter className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('center').run(),
      pressed: editor.isActive({ textAlign: 'center' })
    },
    {
      icon: <AlignRight className='size-4' />,
      onClick: () => editor.chain().focus().setTextAlign('right').run(),
      pressed: editor.isActive({ textAlign: 'right' })
    },
    {
      icon: <List className='size-4' />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive('bulletList')
    },
    {
      icon: <ListOrdered className='size-4' />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive('orderedList')
    },
    {
      icon: <Highlighter className='size-4' />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive('highlight')
    }
  ]

  return (
    <div className='z-50 mb-1 space-x-2 rounded-md border bg-slate-50 p-1'>
      {Options.map((option, index) => (
        <Toggle key={index} pressed={option.pressed} onPressedChange={option.onClick}>
          {option.icon}
        </Toggle>
      ))}
    </div>
  )
}
