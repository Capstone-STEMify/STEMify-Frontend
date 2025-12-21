import { Button } from '@/components/shadcn/button'
import { DataTable } from '@/components/shared/data-table/data-table'
import { EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import { setPageSize } from '@/features/resource/course/slice/courseSlice'
import {
  useDeleteEmulationFromCurriculumMutation,
  useUpdateCourseOrderMutation
} from '@/features/resource/curriculum/api/curriculumApi'
import { useGetEmulatorColumn } from '@/features/resource/curriculum/components/list/EmulatorColum'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { UserRole } from '@/types/userRole'
import { MoreVertical, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/shadcn/card'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import SEmpty from '@/components/shared/empty/SEmpty'

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

  const { currentRole } = useAppSelector((state) => state.selectedOrganization)
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const columns = useGetEmulatorColumn()

  const [orderedCourseIds, setOrderedCourseIds] = React.useState<number[]>([])
  const [removeEmulatorFromCurriculum] = useDeleteEmulationFromCurriculumMutation()

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

  const handleRemoveEmulator = async (emulationId: string) => {
    try {
      await removeEmulatorFromCurriculum({ curriculumId: Number(curriculumId!), emulationIds: [emulationId] }).unwrap()
      toast.success(tt('successMessage.removeEmulatorFromCurriculum'))
    } catch (error) {
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
        {(currentRole === UserRole.ADMIN || currentRole === UserRole.STAFF) && (
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

      {/* <DataTable data={rows} columns={filteredColumns as any} /> */}
      {emulations?.length === 0 && <SEmpty title={t('details.noEmulatorInCurriculum')} />}

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {emulations?.map((emulator) => (
          <Card
            key={emulator.emulationId}
            // onClick={() => handleNavigate(e.emulationId)}
            className='group cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-200'
          >
            <CardContent className='p-0'>
              {/* Thumbnail */}
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
                <Image
                  src={emulator.thumbnailUrl || '/images/shape.png'}
                  alt={emulator.name}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                />

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='ghost'
                      className='absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-md hover:bg-white'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className='h-4 w-4 text-gray-700' />
                    </Button>
                  </PopoverTrigger>

                  {/* Popover menu */}
                  <PopoverContent className='w-32 p-2' align='end' sideOffset={4} onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-col gap-1 text-sm'>
                      <button
                        className='rounded px-2 py-1 text-left text-red-500 hover:bg-red-100'
                        onClick={() =>
                          openModal('confirm', {
                            message: tt('confirmMessage.removeEmulator', { title: emulator.name }),
                            onConfirm: () => handleRemoveEmulator(emulator.emulationId)
                          })
                        }
                      >
                        {tc('button.remove')}
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Content */}
              <div className='p-4 text-center'>
                <h3 className='text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600'>
                  {emulator.name}
                </h3>
                <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{emulator.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
