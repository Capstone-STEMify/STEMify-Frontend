'use client'

import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import { Plus } from 'lucide-react'
import { useSearchLearningOutcomeQuery } from '../../api/learningOutcomeApi'
import { LearningOutcomeQueryParams } from '../../types/learningOutcome.type'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { useTranslations } from 'next-intl'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { useGetLearningOutcomeAction } from './LearningOutcomeAction'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'

type LearningOutcomeTableProps = {
  curriculumId?: number
}

export default function LearningOutcomeTable({ curriculumId }: LearningOutcomeTableProps) {
  const t = useTranslations('LearningOutcome')
  const tc = useTranslations('common')
  const { openModal } = useModal()

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const queryParams: LearningOutcomeQueryParams = {
    curriculumId
  }
  const { data: learningOutcomes, isLoading } = useSearchLearningOutcomeQuery(queryParams)
  const rows = React.useMemo(() => learningOutcomes?.data.items ?? [], [learningOutcomes])
  const columns = useGetLearningOutcomeAction()

  const handleCreate = () => {
    openModal('upsertLearningOutcome', { curriculumId })
  }
  const handlePageChange = (page: number) => {
    // dispatch(setPageIndex(page))
  }

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div className='mx-auto my-10 w-full max-w-7xl space-y-4 rounded-lg border p-4 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2 text-lg font-semibold'>
          <label htmlFor='select-backlog' className='cursor-default'>
            {t('list.title')}
          </label>
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{learningOutcomes?.data.totalCount}</span>
        </div>
        {/* Create learning outcome */}
        {!selectedOrganizationId && (
          <Button size='sm' className='bg-amber-400 text-sm' onClick={handleCreate}>
            <Plus className='mr-1 h-4 w-4' />
            {tc('button.add')}
          </Button>
        )}
      </div>

      {/* Empty learning outcomes */}
      {isLoading || !learningOutcomes || learningOutcomes?.data.items.length === 0 ? (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          {t('list.noData')}
        </Card>
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          enableRowSelection
          pagingData={learningOutcomes}
          pagingParams={queryParams}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  )
}
