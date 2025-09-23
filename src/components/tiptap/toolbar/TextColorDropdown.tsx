import { Editor } from '@tiptap/react'
import { SPopover } from '@/components/shared/SPopover'
import { ChevronDown } from 'lucide-react'

const COLORS = ['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']

export const TextColorDropdown = ({ editor }: { editor: Editor }) => {
  const currentColor = editor.getAttributes('textStyle').color || '#000000'

  return (
    <SPopover
      trigger={
        <button
          type='button'
          className='flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          <span className='h-4 w-4 rounded-full border' style={{ backgroundColor: currentColor }} />
          <ChevronDown className='h-4 w-4 animate-pulse' />
        </button>
      }
    >
      <div className='grid grid-cols-5 gap-2 p-2'>
        {COLORS.map((color) => (
          <button
            key={color}
            onClick={() => editor.chain().focus().setColor(color).run()}
            className='h-6 w-6 rounded-full border'
            style={{ backgroundColor: color }}
          />
        ))}
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className='col-span-5 mt-2 w-full rounded border px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700'
        >
          Reset
        </button>
      </div>
    </SPopover>
  )
}
