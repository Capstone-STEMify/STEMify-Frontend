'use client'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useSearchSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useGetSkillAction } from '@/features/resource/skill/components/table/SkillAction'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'

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

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const { data, isLoading } = useSearchSkillQuery({
    search: debouncedSearchQuery
  })

  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleCreate = () => {
    openModal('upsertSkill')
  }

  return (
    <div>
      <div className='flex justify-between items-center py-4'>
        <Input
          placeholder='Search by skill name...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='max-w-sm'
        />
        <Button size={'icon'} className='bg-amber-custom-400 rounded-full' onClick={handleCreate}>
          <Plus />
        </Button>
      </div>
      <DataTable data={rows} columns={columns} enableRowSelection />
    </div>
  )
}
