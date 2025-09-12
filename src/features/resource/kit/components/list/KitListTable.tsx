import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SearchBar from '@/components/shared/search/SearchBar'
import { useUpdateCurriculumMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { useSearchKitQuery } from '@/features/resource/kit/api/kitApi'
import { useGetKitColumn } from '@/features/resource/kit/components/list/KitColumn'
import { setPageIndex, setSearchTerm } from '@/features/resource/kit/slice/kitSlice'
import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type KitListTableProps = {
  onSuccess?: () => void
  kitIds?: number[]
}

export default function KitListTable({ onSuccess, kitIds }: KitListTableProps) {
  const t = useTranslations('curriculum')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const { curriculumId } = useParams()
  const { closeModal } = useModal()
  const dispatch = useAppDispatch()
  const [selectedIds, setSelectedIds] = React.useState<number[]>([...(kitIds ?? [])])
  const columns = useGetKitColumn()

  const queryParams: KitSliceParams = useAppSelector((state) => state.kit)
  const { data: kitData, isLoading } = useSearchKitQuery(queryParams)
  const rows = React.useMemo(() => kitData?.data.items ?? [], [kitData])

  const [addKitsToCurriculum] = useUpdateCurriculumMutation()

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleAddKitsToCurriculum = async (newKitIds: number[]) => {
    await addKitsToCurriculum({
      id: Number(curriculumId),
      body: { kitIds: { values: newKitIds } }
    }).unwrap()
    toast.success(tt('successMessage.addToCurriculum'))
    onSuccess?.()
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
          <Badge variant={'outline'} className='bg-sky-100 text-blue-500'>
            {t('custom.selectedKits')}: {selectedIds.length}
          </Badge>
          <div className='space-x-2'>
            <Button type='button' variant='outline' onClick={closeModal}>
              {tc('button.cancel')}
            </Button>
            <Button className='bg-amber-custom-400' onClick={() => handleAddKitsToCurriculum(selectedIds)}>
              {tc('button.save')}
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={kitData}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        rowSelection={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
        }}
      />
    </div>
  )
}
