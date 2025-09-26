import { AlignLeft, AlignCenter, AlignRight, AlignJustify, ChevronDown } from 'lucide-react'
import { SPopover } from '@/components/shared/SPopover'
import { ToolbarButton } from '@/components/tiptap/toolbar/ToolbarButton'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/shadcn/button'

export function AlignDropdown({
  editor,
  isAlignLeft,
  isAlignCenter,
  isAlignRight,
  isAlignJustify
}: {
  editor: Editor
  isAlignLeft: boolean
  isAlignCenter: boolean
  isAlignRight: boolean
  isAlignJustify: boolean
}) {
  let CurrentIcon = AlignLeft
  if (isAlignCenter) CurrentIcon = AlignCenter
  else if (isAlignRight) CurrentIcon = AlignRight
  else if (isAlignJustify) CurrentIcon = AlignJustify
  return (
    <SPopover
      side='bottom'
      align='start'
      trigger={
        <Button variant={'ghost'} className='p-2 hover:bg-gray-100'>
          <CurrentIcon className='h-4 w-4' />
          <ChevronDown className='h-4 w-4' />
        </Button>
      }
    >
      <div className='flex flex-col gap-1 p-1'>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={isAlignLeft}>
          <AlignLeft className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={isAlignCenter}>
          <AlignCenter className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={isAlignRight}>
          <AlignRight className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={isAlignJustify}>
          <AlignJustify className='h-4 w-4' />
        </ToolbarButton>
      </div>
    </SPopover>
  )
}
