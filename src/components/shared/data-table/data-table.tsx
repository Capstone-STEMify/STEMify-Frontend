import * as React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  useReactTable,
  Row
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { SPagination } from '../SPagination'

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter
} from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslations } from 'next-intl'

export type DataTableProps<TData extends { id: string | number }, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  filterColumnId?: string
  placeholder?: string
  enableRowSelection?: boolean
  className?: string
  toolbarRight?: React.ReactNode
  pagingData?: any
  pagingParams?: any
  rowSelection?: (string | number)[]
  onSelectionChange?: (ids: (string | number)[]) => void
  handlePageChange?: (page: number) => void
  enableDnd?: boolean
  onReorder?: (newData: TData[]) => void
}

function DraggableRow<TData extends { id: string | number }>({ row }: { row: Row<TData> }) {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({ id: row.original.id })

  return (
    <TableRow
      // ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-dragging
      {...attributes}
      {...listeners}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable<TData extends { id: string | number }, TValue>({
  data,
  columns,
  filterColumnId,
  placeholder,
  enableRowSelection,
  className,
  toolbarRight,
  pagingData,
  pagingParams,
  rowSelection,
  onSelectionChange,
  handlePageChange,
  enableDnd,
  onReorder
}: DataTableProps<TData, TValue>) {
  const tc = useTranslations('common')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [localData, setLocalData] = React.useState(data)
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string | number, boolean>>({})

  React.useEffect(() => {
    setLocalData(data)
  }, [data])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 80,
        tolerance: 5
      }
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  )
  const itemIds = React.useMemo(() => localData.map((d) => d.id), [localData])

  const table = useReactTable({
    data: localData,
    columns,
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setInternalRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection: internalRowSelection },
    enableRowSelection
  })

  React.useEffect(() => {
    const selectedIds = Object.keys(internalRowSelection)
      .filter((key) => internalRowSelection[key as any])
      .map((id) => (isNaN(Number(id)) ? id : Number(id)))
    onSelectionChange?.(selectedIds)
  }, [table.getState().rowSelection])

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!active || !over || active.id === over.id) return
      const oldIndex = data.findIndex((item) => item.id === active.id)
      const newIndex = data.findIndex((item) => item.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return
      const newData = arrayMove(data, oldIndex, newIndex)
      setLocalData(newData)
      onReorder?.(newData)
    },
    [localData, onReorder]
  )
  return (
    <div className={className}>
      <div className='overflow-hidden rounded-md border'>
        {enableDnd ? (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} sensors={sensors}>
            <SortableContext key={Date.now()} items={itemIds} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader className='bg-muted sticky top-0 z-10'>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((h) => (
                        <TableHead key={h.id}>
                          {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => <DraggableRow key={row.id} row={row} />)
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllLeafColumns().length} className='h-24 text-center'>
                        {placeholder || tc('tableHeader.empty')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        ) : (
          <Table>
            <TableHeader className='bg-muted sticky top-0 z-10'>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllLeafColumns().length} className='h-24 text-center'>
                    {placeholder || tc('tableHeader.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className='flex items-center justify-between gap-2 py-4'>
        {enableRowSelection && (
          <div className='text-muted-foreground w-full text-sm'>
            {table.getFilteredSelectedRowModel().rows.length} {tc('paging.of')}{' '}
            {table.getFilteredRowModel().rows.length} {tc('paging.row')} {tc('paging.select')}.
          </div>
        )}
        {pagingData?.data?.totalPages > 1 && (
          <SPagination
            pageNumber={pagingParams?.pageNumber}
            totalPages={pagingData.data.totalPages}
            onPageChanged={handlePageChange ?? (() => {})}
            className='w-fit'
          />
        )}
      </div>
    </div>
  )
}
