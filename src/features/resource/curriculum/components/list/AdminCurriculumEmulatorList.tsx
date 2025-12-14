import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import { setPageSize } from '@/features/resource/course/slice/courseSlice'
import { useUpdateCourseOrderMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { useGetEmulatorColumn } from '@/features/resource/curriculum/components/list/EmulatorColum'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type AdminCurriculumEmulatorListProps = {
  curriculumId: number
  emulations?: EmulatorWithThumbnail[]
}

export default function AdminCurriculumEmulatorList({ curriculumId, emulations }: AdminCurriculumEmulatorListProps) {
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

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const columns = useGetEmulatorColumn()

  const [orderedCourseIds, setOrderedCourseIds] = React.useState<number[]>([])

  const visibleKeys = ['select', 'name', 'thumbnailUrl', 'actions']
  const filteredColumns = columns.filter((col) => {
    const key = 'accessorKey' in col ? col.accessorKey : col.id
    return key ? visibleKeys.includes(key as string) : false
  })

  useEffect(() => {
    dispatch(setPageSize(50))
  }, [dispatch])

  const [updateCourseOrder] = useUpdateCourseOrderMutation()

  const handleSaveOrder = async () => {
    try {
      await updateCourseOrder({
        curriculumId,
        orderedCourseIds
      }).unwrap()
      toast.success(tt('successMessage.saveOrder'))
      setOrderedCourseIds([])
    } catch (e) {
      toast.error(tt('errorMessage'))
    }
  }

  return (
    <div>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.emulatorListTitle')}{' '}
          <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{emulations?.length}</span>
        </h2>
        {!selectedOrganizationId && (
          <div className='flex justify-end space-x-2'>
            {orderedCourseIds.length > 0 && (
              <Button className='bg-emerald-400' onClick={handleSaveOrder}>
                <Plus className='mr-1 h-4 w-4' />
                {tc('button.order')}
              </Button>
            )}

            <Button
              onClick={() => {
                openModal('curriculumSelectEmulatorListModal', {
                  curriculumId,
                  emulatorIds: emulations?.map((emulator) => emulator.emulationId) || []
                })
              }}
            >
              <Plus className='mr-1 h-4 w-4' />
              {t('details.addEmulator')}
            </Button>
          </div>
        )}
      </div>

      <DataTable data={rows} columns={filteredColumns as any} />
    </div>
  )
}
