import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import { setPageSize } from '@/features/resource/course/slice/courseSlice'
import { useUpdateCourseOrderMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { useGetEmulatorColumn } from '@/features/resource/curriculum/components/list/EmulatorColum'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { UserRole } from '@/types/userRole'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type OrganizationEmulatorListProps = {
  emulations?: EmulatorWithThumbnail[]
}

export default function OrganizationEmulatorList({ emulations }: OrganizationEmulatorListProps) {
  const t = useTranslations('curriculum')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const rows = React.useMemo(
    () =>
      (emulations ?? []).map((item, idx) => ({
        id: item.emulationId,
        ...item
      })),
    [emulations]
  )

  const columns = useGetEmulatorColumn()

  const visibleKeys = ['select', 'name', 'thumbnailUrl', 'actions']
  const filteredColumns = columns.filter((col) => {
    const key = 'accessorKey' in col ? col.accessorKey : col.id
    return key ? visibleKeys.includes(key as string) : false
  })

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.emulatorListTitle')}{' '}
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{emulations?.length}</span>
        </h2>
      </div>

      <DataTable data={rows} columns={filteredColumns as any} />
    </div>
  )
}
