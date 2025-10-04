import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import SearchBar from '@/components/shared/search/SearchBar'
import { useCreateKitComponentsMutation, useSearchComponentQuery } from '@/features/kit-components/api/kitComponentApi'
import { useGetComponentColumn } from '@/features/kit-components/components/list/ComponentColumn'
import { setPageIndex, setPageSize, setSearchTerm } from '@/features/kit-components/slice/componentSlice'
import { ComponentSliceParams, KitComponent } from '@/features/kit-components/types/kit-component.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type SelectComponentListModalProps = {
  kitId: number
  onSuccess?: () => void
  componentIds?: number[]
}

export default function SelectComponentList({ kitId, onSuccess, componentIds }: SelectComponentListModalProps) {
  const t = useTranslations('components')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tb = useTranslations('tableHeader')
  const dispatch = useAppDispatch()
  const { closeModal } = useModal()

  const columns = useGetComponentColumn({ isPopup: true })
  const visibleKeys = ['imageUrl', 'name', 'select']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )
  // Thêm column Quantity
  const extendedColumns = [
    ...filteredColumns,
    {
      id: 'quantity',
      header: tb('quantity'),
      cell: ({ row }: any) => {
        const selected = selectedComponents.find((c) => c.componentId === row.original.id)
        return (
          <Input
            type='number'
            min={1}
            className='w-15 rounded-md border px-2 py-1 text-sm'
            value={selected?.quantity ?? 1}
            disabled={!selected}
            onChange={(e) => {
              const value = Number(e.target.value)
              setSelectedComponents((prev) =>
                prev.map((c) => (c.componentId === row.original.id ? { ...c, quantity: value } : c))
              )
            }}
          />
        )
      }
    },
    {
      id: 'selectedStatus',
      header: '',
      cell: ({ row }: any) => {
        const id = row.original.id
        if (componentIds?.includes(id)) {
          return (
            <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600'>
              {tc('badge.selected')}
            </span>
          )
        }
        return null
      }
    }
  ]

  const [selectedComponents, setSelectedComponents] = React.useState<Partial<KitComponent>[]>([])
  const componentParams = useAppSelector((state) => state.component)

  const queryParams: ComponentSliceParams = {
    pageNumber: componentParams.pageNumber,
    pageSize: componentParams.pageSize,
    search: componentParams.search
  }

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const { data } = useSearchComponentQuery(queryParams)
  const [addComponentsToKit] = useCreateKitComponentsMutation()
  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleAddComponentsToKit = async (components: Partial<KitComponent>[]) => {
    await addComponentsToKit({ kitId, components })
    toast.success(tt('successMessage.addComponentToKit'))
    onSuccess?.()
  }

  if (!data) return null
  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <SearchBar
          className='w-80'
          placeholder={t('list.placeholder.search')}
          onDebouncedSearch={(value) => dispatch(setSearchTerm(value))}
        />

        <div className='flex items-center gap-2'>
          <div className='space-x-2'>
            <Button type='button' variant='outline' onClick={closeModal}>
              {tc('button.cancel')}
            </Button>
            <Button className='bg-amber-custom-400' onClick={() => handleAddComponentsToKit(selectedComponents)}>
              {tc('button.save')}
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        data={rows}
        columns={extendedColumns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        rowSelection={selectedComponents.map((component) => Number(component.componentId))}
        onSelectionChange={(ids) => {
          const newSelected = rows
            .filter((row) => ids.includes(row.id))
            .map((row) => {
              const existing = selectedComponents.find((c) => c.componentId === row.id)
              return { componentId: row.id, quantity: existing?.quantity ?? 1 }
            })
          setSelectedComponents(newSelected)
        }}
        disabledRowIds={componentIds}
      />
    </div>
  )
}
