'use client'

import { Toggle } from '@/components/shadcn/toggle'
import { type Editor } from '@tiptap/react'

export function isSelectionFullyMark(editor: Editor, markType: string) {
  const { from, to } = editor.state.selection
  let fullyActive = true

  editor.state.doc.nodesBetween(from, to, (node) => {
    if (node.isText) {
      const hasMark = node.marks.some((mark) => mark.type.name === markType)
      if (!hasMark) {
        fullyActive = false
      }
    }
  })

  return fullyActive
}

export const ToolbarButton = ({
  onClick,
  isActive,
  children,
  disabled
}: {
  onClick?: () => void
  isActive?: boolean
  children: React.ReactNode
  disabled?: boolean
}) => {
  return (
    <Toggle
      type='button'
      pressed={isActive}
      onPressedChange={onClick}
      disabled={disabled}
      className='rounded-md p-2 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-600 dark:data-[state=on]:bg-blue-900 dark:data-[state=on]:text-blue-300'
    >
      {children}
    </Toggle>
  )
}
