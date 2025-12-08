import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SearchBar from '@/components/shared/search/SearchBar'
import {
  useCreateKitComponentsMutation,
  useSearchComponentQuery,
  useUpdateKitComponentsMutation
} from '@/features/kit-components/api/kitComponentApi'
import { useGetComponentColumn } from '@/features/kit-components/components/list/ComponentColumn'
import { resetParams, setPageIndex, setPageSize, setSearchTerm } from '@/features/kit-components/slice/componentSlice'
import { ComponentSliceParams, KitComponent } from '@/features/kit-components/types/kit-component.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type SelectComponentListProps = {
  kitId: number
  onSuccess?: () => void
  existedComponents?: KitComponent[]
  refetch?: () => void
}

export default function SelectComponentList({
  kitId,
  onSuccess,
  existedComponents = [],
  refetch
}: SelectComponentListProps) {
  const t = useTranslations('components')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const tb = useTranslations('tableHeader')
  const dispatch = useAppDispatch()
  const { closeModal } = useModal()
  const locale = useLocale()

  const columns = useGetComponentColumn({ isPopup: true })
  const visibleKeys = ['imageUrl', 'name', 'select']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )

  const [selectedComponents, setSelectedComponents] = React.useState<Partial<KitComponent>[]>([])
  const [existedComponentState, setExistedComponentState] = React.useState<KitComponent[]>(existedComponents)
  const [activeTab, setActiveTab] = useState<'available' | 'existed'>('available')

  const componentParams = useAppSelector((state) => state.component)

  const queryParams: ComponentSliceParams = {
    pageNumber: componentParams.pageNumber,
    pageSize: componentParams.pageSize,
    search: componentParams.search
  }

  useEffect(() => {
    dispatch(resetParams())
  }, [dispatch])

  const { data, isLoading } = useSearchComponentQuery(queryParams)
  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const [addComponentsToKit] = useCreateKitComponentsMutation()
  const [updateKitComponents] = useUpdateKitComponentsMutation()

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleAddComponentsToKit = async (components: Partial<KitComponent>[]) => {
    await addComponentsToKit({ kitId, components })
    refetch?.()
    toast.success(tt('successMessage.addComponentToKit'))
    onSuccess?.()
  }

  const handleUpdateKitComponents = async (components: Partial<KitComponent>[]) => {
    await updateKitComponents({ components })
    refetch?.()
    toast.success(tt('successMessage.updateComponentInKit'))
    onSuccess?.()
  }

  // Extended columns: quantity + status
  const extendedColumns = [
    ...filteredColumns,
    {
      id: 'quantity',
      header: tb('quantity'),
      cell: ({ row }: any) => {
        const id = row.original.id
        const selected = selectedComponents.find((c) => c.componentId === id)
        const isExisted = existedComponentState.some((c) => c.componentId === id)
        const existed = existedComponentState.find((c) => c.componentId === id)

        const quantityValue = isExisted ? (existed?.quantity ?? 1) : (selected?.quantity ?? 1)

        return (
          <Input
            type='number'
            min={1}
            className='w-20 rounded-md border px-2 py-1 text-sm'
            value={quantityValue}
            disabled={!isExisted && !selected}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (isExisted) {
                setExistedComponentState((prev) =>
                  prev.map((c) => (c.componentId === id ? { ...c, quantity: value } : c))
                )
              } else {
                setSelectedComponents((prev) => prev.map((c) => (c.componentId === id ? { ...c, quantity: value } : c)))
              }
            }}
          />
        )
      }
    }
  ]
  if (isLoading) return <LoadingComponent />

  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <SearchBar
          className='w-80'
          placeholder={t('list.placeholder.search')}
          onDebouncedSearch={(value) => dispatch(setSearchTerm(value))}
        />

        <div className='flex items-center gap-2'>
          <Button type='button' variant='outline' onClick={closeModal}>
            {tc('button.cancel')}
          </Button>
          <Button
            className='bg-amber-custom-400'
            onClick={async () => {
              if (activeTab === 'available') {
                await handleAddComponentsToKit(selectedComponents)
              } else if (activeTab === 'existed') {
                await handleUpdateKitComponents(existedComponentState)
              }
            }}
          >
            {tc('button.save')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue='available' onValueChange={(val) => setActiveTab(val as 'available' | 'existed')}>
        <TabsList className='rounded-lg bg-gray-100 p-1'>
          <TabsTrigger
            value='available'
            className='cursor-pointer rounded-md px-4 py-2 transition hover:bg-sky-50 data-[state=active]:bg-sky-600 data-[state=active]:text-white'
          >
            {t('list.availableComponents')}
          </TabsTrigger>

          <TabsTrigger
            value='existed'
            className='cursor-pointer rounded-md px-4 py-2 transition hover:bg-sky-50 data-[state=active]:bg-sky-600 data-[state=active]:text-white'
          >
            {t('list.existedComponents')}
          </TabsTrigger>
        </TabsList>

        {/* Components chưa có */}
        <TabsContent value='available'>
          <DataTable
            data={rows.filter((row) => !existedComponentState.some((e) => e.componentId === row.id))}
            columns={extendedColumns}
            enableRowSelection
            pagingData={data}
            pagingParams={queryParams}
            handlePageChange={handlePageChange}
            rowSelection={selectedComponents.map((component) => Number(component.componentId))}
            onSelectionChange={(ids: string[] | number[]) => {
              const numericIds = ids.map((id) => (typeof id === 'string' ? parseInt(id, 10) : id))
              const newSelected = rows
                .filter((row) => numericIds.includes(row.id))
                .map((row) => {
                  const existing = selectedComponents.find((c) => c.componentId === row.id)
                  return { componentId: row.id, quantity: existing?.quantity ?? 1 }
                })
              setSelectedComponents(newSelected)
            }}
            placeholder={t.rich('list.noAvailableComponents', {
              link: (chunks) => (
                <Link
                  href={`/${locale}/admin/component`}
                  target='_blank'
                  className='text-sky-500 underline hover:text-sky-600'
                >
                  {chunks}
                </Link>
              )
            })}
          />
        </TabsContent>

        {/* Components đã có */}
        <TabsContent value='existed'>
          <DataTable
            data={existedComponentState.map((c) => ({
              ...c, // giữ componentId, quantity
              id: c.componentId // map lại để dùng chung column logic
            }))}
            columns={extendedColumns}
            pagingData={data}
            pagingParams={queryParams}
            handlePageChange={handlePageChange}
            enableRowSelection={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
