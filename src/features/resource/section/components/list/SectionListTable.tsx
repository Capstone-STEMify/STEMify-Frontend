import React from 'react'
import { useTranslations } from 'next-intl'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { SectionQueryParams } from '@/features/resource/section/types/section.type'
import useGetSectionTableColumn from '@/features/resource/section/components/list/SectionTableColumn'
import { useModal } from '@/providers/ModalProvider'

type SectionListTableProps = {
  lessonId: number
}

export default function SectionListTable({ lessonId }: SectionListTableProps) {
  const t = useTranslations('section')
  const tc = useTranslations('common')
  const { openModal } = useModal()

  const queryParams: SectionQueryParams = {
    lessonId,
    pageNumber: 1,
    pageSize: 50,
    orderBy: 'orderindex',
    sortDirection: 'Asc'
  }
  const { data: sectionData } = useSearchSectionQuery(queryParams, { skip: !lessonId })
  const columns = useGetSectionTableColumn()

  if (!sectionData) return null
  return (
    <div>
      <hr className='my-10' />
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <h2 className='text-center text-2xl'>{t('list.title')}</h2>
        <Button
          className='bg-amber-custom-400 my-5'
          onClick={() => {
            openModal('upsertSection', { lessonId })
          }}
        >
          <Plus className='mr-1 h-4 w-4' />
          {tc('button.addSection')}
        </Button>
      </div>

      <DataTable data={sectionData.data.items || []} columns={columns} enableRowSelection pagingData={sectionData} />
    </div>
  )
}
