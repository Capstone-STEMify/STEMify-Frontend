import { Input } from '@/components/shadcn/input'
import type { Table } from '@tanstack/react-table'

type Props<TData> = {
  table: Table<TData>
  filterColumnId?: string
  placeholder?: string
  className?: string
}

/** Toolbar for the data table */
export function DataTableToolbar<TData>({ table, filterColumnId, placeholder, className }: Props<TData>) {
  const column = filterColumnId ? table.getColumn(filterColumnId) : undefined
  return (
    <div className={className}>
      <Input
        placeholder={placeholder ?? 'Filter...'}
        value={(column?.getFilterValue() as string) ?? ''}
        onChange={(e) => column?.setFilterValue(e.target.value)}
        className='max-w-sm'
      />
    </div>
  )
}
