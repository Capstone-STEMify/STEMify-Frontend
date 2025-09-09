'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useState, useEffect } from 'react'
import { SkillQueryParams } from '../../types/skill.type'
import { setPageIndex } from '@/features/resource/skill/slice/skillSlice'
import { useGetSkillAction } from '@/features/resource/skill/components/list/SkillAction'

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export default function SkillTable() {
  const { openModal } = useModal()
  const columns = useGetSkillAction()
  const dispatch = useAppDispatch()

  const t = useTranslations('Admin.placeholder')

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const skillParams = useAppSelector((state) => state.skill)

  const queryParams: SkillQueryParams = {
    pageNumber: skillParams.pageNumber,
    pageSize: skillParams.pageSize,
    search: skillParams.search,
    status: skillParams.status
  }

  const { data, isLoading } = useSearchSkillQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertSkill')
  }

  const handlePageChange = (page: number) => {
    dispatch(setPageIndex(page))
  }

  return (
    <div>
      <div className='flex items-center justify-between py-4'>
        <Input
          placeholder={t('skillSearch')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable
        data={rows}
        columns={columns}
        enableRowSelection
        pagingData={data}
        pagingParams={queryParams}
        handlePageChange={handlePageChange}
      />
    </div>
  )
}
