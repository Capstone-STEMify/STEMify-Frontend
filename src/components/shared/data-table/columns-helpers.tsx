'use client'

import * as React from 'react'
import { type ColumnDef, type Row } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Button } from '@/components/shadcn/button'
import { useSortable } from '@dnd-kit/sortable'
import { IconGripVertical } from '@tabler/icons-react'

export type ActionItem<T> = {
  label: string
  onClick?: (row: Row<T>) => void | Promise<void>
  separatorBefore?: boolean
  hidden?: (row: Row<T>) => boolean
  disabled?: (row: Row<T>) => boolean
  danger?: boolean
}

/** Common row selection column */
export function createSelectColumn<T>(): ColumnDef<T> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')}
        onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  }
}

/** Header sortable */
export function sortableHeader(label: string) {
  return function SortableHeader({ column }: { column: any }) {
    return (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        {label}
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    )
  }
}

export function createActionsColumnFromItems<T>(items: ActionItem<T>[], label = 'Actions'): ColumnDef<T> {
  return {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const visible = items.filter((i) => !i.hidden?.(row))
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            {visible.map((i, idx) => (
              <React.Fragment key={idx}>
                {i.separatorBefore && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  className={i.danger ? 'text-red-600' : undefined}
                  disabled={i.disabled?.(row)}
                  onClick={() => i.onClick?.(row)}
                >
                  {i.label}
                </DropdownMenuItem>
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
}

export function DragHandle({ id }: { id: number }) {
  const { attributes, listeners, setNodeRef } = useSortable({ id })

  return (
    <Button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      variant='ghost'
      size='icon'
      className='hover:cursor-grab active:cursor-grabbing'
    >
      <IconGripVertical className='text-muted-foreground size-3' />
      <span className='sr-only'>Drag to reorder</span>
    </Button>
  )
}
