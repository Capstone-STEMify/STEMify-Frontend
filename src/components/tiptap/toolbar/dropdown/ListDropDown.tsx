import { ChevronDown, List, ListOrdered } from 'lucide-react'
import { SPopover } from '@/components/shared/SPopover'
import { ToolbarButton } from '@/components/tiptap/toolbar/ToolbarButton'
import { Editor } from '@tiptap/react'
import { Button } from '@/components/shadcn/button'

export function ListDropdown({
  editor,
  isBulletList,
  isOrderedList
}: {
  editor: Editor
  isBulletList: boolean
  isOrderedList: boolean
}) {
  let CurrentIcon = List
  if (isOrderedList) CurrentIcon = ListOrdered

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
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={isBulletList}>
          <List className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={isOrderedList}>
          <ListOrdered className='h-4 w-4' />
        </ToolbarButton>
      </div>
    </SPopover>
  )
}
