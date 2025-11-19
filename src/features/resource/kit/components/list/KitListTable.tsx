import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SearchBar from '@/components/shared/search/SearchBar'
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { useSearchKitQuery } from '@/features/resource/kit/api/kitProductApi'
import { useGetKitColumn } from '@/features/resource/kit/components/list/KitColumn'
import { setPageIndex, setSearchTerm } from '@/features/resource/kit/slice/kitProductSlice'
import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type KitListTableProps = {
  onSuccess?: () => void
  kitId?: number
}

export default function KitListTable({ onSuccess, kitId }: KitListTableProps) {
  const t = useTranslations('curriculum')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const { courseId } = useParams()
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const [selectedId, setSelectedId] = React.useState<number | undefined>(kitId)
  const columns = [
    ...useGetKitColumn(),
    {
      id: 'selectedStatus',
      header: '',
      cell: ({ row }: any) => {
        const id = row.original.id
        if (id === kitId) {
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

  const queryParams: KitSliceParams = useAppSelector((state) => state.kit)
  const { data: kitData, isLoading } = useSearchKitQuery(queryParams)
  const rows = React.useMemo(() => kitData?.data.items ?? [], [kitData])

  const [addKitsToCourse, { isLoading: isSaving }] = useUpdateCourseMutation()

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleAddKitCourse = async () => {
    if (!selectedId || !courseId) return
    try {
      await addKitsToCourse({
        id: Number(courseId),
        body: { kitId: selectedId }
      }).unwrap()
      toast.success(tt('successMessage.addToCourse'))
      onSuccess?.()
    } catch (error) {
      toast.error(tt('errorMessage.general'))
    }
  }

  if (isLoading) {
    return <LoadingComponent />
  }

  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <SearchBar
          className='w-72'
          placeholder={t('custom.searchKitPlaceholder')}
          onDebouncedSearch={(value) => dispatch(setSearchTerm(value))}
        />

        <div className='flex items-center gap-2'>
          <Button type='button' variant='outline' onClick={closeModal}>
            {tc('button.cancel')}
          </Button>
          <Button className='bg-amber-custom-400' onClick={handleAddKitCourse} disabled={!selectedId || isSaving}>
            {tc('button.save')}
          </Button>
        </div>
      </div>

      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={kitData}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        rowSelection={selectedId !== undefined ? [selectedId] : []}
        onSelectionChange={(ids) => {
          const firstId = Array.from(ids as number[])[0]
          setSelectedId(Number(firstId) ?? undefined)
        }}
        disabledRowIds={kitId ? [kitId] : undefined}
      />
    </div>
  )
}
