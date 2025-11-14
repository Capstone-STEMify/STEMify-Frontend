'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { useGetClassroomColumn } from '@/features/classroom/components/list/table/ClassroomColumn'
import { useSearchClassroomsQuery } from '@/features/classroom/api/classroomApi'
import { useModal } from '@/providers/ModalProvider'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Input } from '@/components/shadcn/input'
import SSelect from '@/components/shared/SSelect'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setParam, setSearchTerm } from '@/features/classroom/slice/classroomSlice'
import useDebounce from '@/hooks/useDebounce'
import { SingleSelectWithSearch } from '@/components/shared/SingleSelectWithSearch'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { getOptions } from '@/utils/index'

export default function ClassroomTable() {
  const { openModal } = useModal()
  const router = useRouter()
  const locale = useLocale()
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState<string>('')

  const queryParams = useAppSelector((state) => state.classroom)
  const organizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const debouncedSearchQuery = useDebounce(search, 500)
  const { data } = useSearchClassroomsQuery({ ...queryParams, organizationId: organizationId })

  // Xử lý data để merge curriculum cells
  const rows = React.useMemo(() => {
    const items = data?.data.items ?? []

    // Sắp xếp theo curriculum.id để nhóm các classroom cùng curriculum lại
    const sorted = [...items].sort((a, b) => a.curriculum.id - b.curriculum.id)

    // Đếm số classroom cho mỗi curriculum
    const curriculumGroups = new Map<number, number>()
    sorted.forEach((item) => {
      const curriculumId = item.curriculum.id
      curriculumGroups.set(curriculumId, (curriculumGroups.get(curriculumId) || 0) + 1)
    })

    // Thêm meta data cho mỗi row để biết cell nào cần merge
    let currentCurriculumId: number | null = null
    let curriculumRowCount = 0

    return sorted.map((item, index) => {
      const curriculumId = item.curriculum.id
      const isNewCurriculum = curriculumId !== currentCurriculumId

      // Meta data cho curriculum cell
      const cellMeta: any = {
        curriculum: isNewCurriculum ? { rowSpan: curriculumGroups.get(curriculumId) || 1, skip: false } : { skip: true }
      }

      if (isNewCurriculum) {
        currentCurriculumId = curriculumId
        curriculumRowCount = 0
      }
      curriculumRowCount++

      return {
        ...item,
        __cellMeta: cellMeta
      }
    })
  }, [data])

  const columns = useGetClassroomColumn()

  const searchCurriculumQuery = useAppSelector((state) => state.curriculum)
  const { data: curriculumData } = useSearchCurriculumQuery({
    ...searchCurriculumQuery
  })

  const statusOptions = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'In Progress', value: 'inprogress' },
    { label: 'End Soon', value: 'endsoon' },
    { label: 'Completed', value: 'completed' }
  ]

  const curriculumOptions = getOptions(curriculumData?.data.items, 'title', 'imageUrl', 'courseCount')

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  return (
    <div className='mt-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Classroom List</h1>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={() => dispatch(resetParams())} className='hover:bg-slate-100'>
            Clear Filter
          </Button>
          <Button
            className='bg-sky-600 text-white hover:bg-sky-700'
            onClick={() => router.push(`/${locale}/organization/classroom/create`)}
          >
            + Create class
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex gap-2'>
          <Input
            type='text'
            placeholder='Search...'
            onChange={(e) => setSearch(e.target.value)}
            className='w-80 bg-white py-4.5'
            style={{ width: '320px' }}
          />
          <SingleSelectWithSearch
            value={queryParams.curriculumId?.toString() ?? ''}
            options={curriculumOptions}
            placeholder='Select curriculum'
            onChange={(val) => dispatch(setParam({ key: 'curriculumId', value: Number(val) }))}
          />
        </div>
        <div className='flex gap-2'>
          <SSelect
            placeholder='Filter by'
            value={queryParams.status ?? 'upcoming'}
            onChange={(val) =>
              dispatch(setParam({ key: 'status', value: val as 'upcoming' | 'inprogress' | 'endsoon' | 'completed' }))
            }
            options={statusOptions}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        enableRowSelection={false}
        data={rows}
        columns={columns}
        pagingData={data?.data.items}
        pagingParams={queryParams}
        handlePageChange={() => {}}
        onRowClick={(val) => {
          router.push(`/${locale}/organization/classroom/${val.id}`)
        }}
      />
    </div>
  )
}
