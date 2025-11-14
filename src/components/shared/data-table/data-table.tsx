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
import { DragHandle } from '@/components/shared/data-table/columns-helpers'

export type DataTableProps<TData extends { id: string | number }, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  filterColumnId?: string
  placeholder?: string | React.ReactNode
  enableRowSelection?: boolean
  className?: string
  toolbarRight?: React.ReactNode
  pagingData?: any
  pagingParams?: any
  rowSelection?: (string | number)[]
  onSelectionChange?: (ids: number[] | string[]) => void
  handlePageChange?: (page: number) => void
  enableDnd?: boolean
  onReorder?: (newData: TData[]) => void
  disabledRowIds?: (string | number)[]
  onRowClick?: (row: TData) => void
  expandedContentRenderer?: (row: TData) => React.ReactNode
}

function DraggableRow<TData extends { id: string | number }>({ row }: { row: Row<TData> }) {
  const { setNodeRef, transform, transition, attributes, listeners } = useSortable({
    id: row.original.id
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <TableRow ref={setNodeRef} style={style} data-dragging>
      <TableCell className='w-6'>
        <DragHandle listeners={listeners} attributes={attributes} />
      </TableCell>

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
  onReorder,
  disabledRowIds,
  onRowClick,
  expandedContentRenderer
}: DataTableProps<TData, TValue>) {
  const tc = useTranslations('common')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [localData, setLocalData] = React.useState(data)
  const [internalRowSelection, setInternalRowSelection] = React.useState<Record<string | number, boolean>>({})
  const [expandedRowId, setExpandedRowId] = React.useState<number | null>(null)

  React.useEffect(() => {
    setLocalData(data)
  }, [data])

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection: internalRowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: pagingParams?.pageSize || 50
      }
    },
    enableRowSelection
  })

  React.useEffect(() => {
    const selectedIds = Object.keys(internalRowSelection).filter((key) => internalRowSelection[key as any])
    onSelectionChange?.(selectedIds)
  }, [internalRowSelection])

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
                      <TableHead className='w-6' />
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
                table.getRowModel().rows.map((row) => {
                  const isDisabled = disabledRowIds?.includes(row.original.id)
                  const isExpanded = expandedRowId === row.original.id

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && 'selected'}
                        className={isDisabled ? 'pointer-events-none bg-blue-50 opacity-60' : ''}
                        onClick={() => {
                          if (isDisabled) return
                          setExpandedRowId(isExpanded ? null : (row.original.id as number))
                          onRowClick?.(row.original)
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const meta = (row.original as any).__cellMeta?.[cell.column.id]

                          if (meta?.skip) {
                            return null
                          }

                          return (
                            <TableCell
                              key={cell.id}
                              rowSpan={meta?.rowSpan || 1}
                              className={` ${meta?.rowSpan > 1 ? 'pr-12 align-top' : ''} ${(cell.column.columnDef.meta as any)?.className || ''} `}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          )
                        })}
                      </TableRow>

                      {isExpanded && expandedContentRenderer && expandedContentRenderer(row.original) && (
                        <TableRow className='bg-slate-50'>
                          <TableCell colSpan={row.getVisibleCells().length}>
                            {/* Nội dung mở rộng — bạn có thể render curriculum tại đây */}
                            {expandedContentRenderer?.(row.original)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })
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
