import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import SearchBar from '@/components/shared/search/SearchBar'
import { useSearchEmulationsQuery } from '@/features/emulator/api/emulatorApi'
import { useAddEmulationToCurriculumMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { useGetEmulatorColumn } from '@/features/resource/curriculum/components/list/EmulatorColum'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { toast } from 'sonner'

type AdminCurriculumSelectEmulatorListProps = {
  curriculumId: number
  onSuccess?: () => void
  emulatorIds?: string[]
}

export default function AdminCurriculumSelectEmulatorList({
  curriculumId,
  onSuccess,
  emulatorIds
}: AdminCurriculumSelectEmulatorListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const t = useTranslations('curriculum')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { closeModal } = useModal()
  const columns = useGetEmulatorColumn()
  const visibleKeys = ['select', 'name', 'thumbnailUrl']
  const filteredColumns = columns.filter((col) =>
    'accessorKey' in col ? visibleKeys.includes(col.accessorKey as string) : visibleKeys.includes(col.id ?? '')
  )
  const extendedColumns = [
    ...filteredColumns,
    {
      id: 'selectedStatus',
      header: '',
      cell: ({ row }: any) => {
        const id = row.original.id
        if (emulatorIds?.includes(id)) {
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

  const queryParams = {
    search: searchTerm,
    page: pageNumber,
    limit: 6
  }

  const { data } = useSearchEmulationsQuery(queryParams)
  const [addEmulationToCurriculum] = useAddEmulationToCurriculumMutation()
  const rows = React.useMemo(
    () =>
      (data?.data.items ?? []).map((item) => ({
        id: item.emulationId,
        ...item
      })),
    [data]
  )
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
  }

  const handleAddEmulatorsToCurriculum = async (emulatorIds: string[]) => {
    await addEmulationToCurriculum({ curriculumId, emulationIds: emulatorIds })
    toast.success(tt('successMessage.addToCurriculum'))
    onSuccess?.()
  }

  if (!data) return null
  return (
    <div className='space-y-3'>
      <div className='flex justify-between'>
        <SearchBar
          className='w-72'
          placeholder={t('custom.searchEmulatorPlaceholder')}
          onDebouncedSearch={(value) => setSearchTerm(value)}
        />

        <div className='flex items-center gap-2'>
          <Badge variant={'outline'} className='bg-sky-100 text-blue-500'>
            {t('custom.selectedEmulators')}: {selectedIds.length}
          </Badge>
          <div className='space-x-2'>
            <Button type='button' variant='outline' onClick={closeModal}>
              {tc('button.cancel')}
            </Button>
            <Button className='bg-amber-custom-400' onClick={() => handleAddEmulatorsToCurriculum(selectedIds)}>
              {tc('button.save')}
            </Button>
          </div>
        </div>
      </div>
      <DataTable
        data={rows}
        columns={extendedColumns as any}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
        rowSelection={selectedIds}
        onSelectionChange={(ids) => {
          setSelectedIds(ids.map((id) => String(id)))
        }}
        disabledRowIds={emulatorIds}
      />
    </div>
  )
}
