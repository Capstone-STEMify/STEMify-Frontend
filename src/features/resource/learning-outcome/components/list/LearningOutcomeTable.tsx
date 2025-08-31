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
import { useAppDispatch } from '@/hooks/redux-hooks'

export default function LearningOutcomeTable({ curriculumId }: { curriculumId?: number }) {
  const t = useTranslations('LearningOutcome')
  const { openModal } = useModal()
  const dispatch = useAppDispatch()
  const queryParams: LearningOutcomeQueryParams = {
    curriculumId
  }
  const { data: learningOutcomes, isLoading } = useSearchLearningOutcomeQuery(queryParams)
  const rows = React.useMemo(() => learningOutcomes?.data.items ?? [], [learningOutcomes])
  const columns = useGetLearningOutcomeAction()

  const handleCreate = () => {
    openModal('upsertLearningOutcome')
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
    <div className='mx-auto my-10 w-full max-w-7xl space-y-4 rounded-lg border bg-blue-50 p-4 shadow-sm'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2 text-lg font-semibold'>
          <label htmlFor='select-backlog' className='cursor-default'>
            {t('PLO.title')}
          </label>
          <span className='rounded bg-green-200 px-2 text-sm'>0</span>
        </div>
        {/* Create learning outcome */}
        <Button size='sm' className='bg-amber-400 text-sm' onClick={handleCreate}>
          <Plus className='mr-1 h-4 w-4' />
          {t('add_btn')}
        </Button>
      </div>

      {/* Empty learning outcomes */}
      {isLoading || !learningOutcomes || learningOutcomes?.data.items.length === 0 ? (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          {t('PLO.empty')}
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
