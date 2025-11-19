import React from 'react'
import { useTranslations } from 'next-intl'
import { useSearchSectionQuery } from '@/features/resource/section/api/sectionApi'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { SectionQueryParams } from '@/features/resource/section/types/section.type'
import useGetSectionTableColumn from '@/features/resource/section/components/list/SectionTableColumn'
import { useModal } from '@/providers/ModalProvider'
import { useUpdateLessonSectionOrderMutation } from '@/features/resource/lesson/api/lessonApi'
import { toast } from 'sonner'
import { useAppSelector } from '@/hooks/redux-hooks'
import { LicenseType, UserRole } from '@/types/userRole'

type SectionListTableProps = {
  lessonId: number
}

export default function SectionListTable({ lessonId }: SectionListTableProps) {
  const t = useTranslations('section')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { openModal } = useModal()
  const columns = useGetSectionTableColumn()
  const [orderedSectionIds, setOrderedSectionIds] = React.useState<number[]>([])
  const userRole = useAppSelector((state) => state.selectedOrganization.currentRole) || UserRole.GUEST
  console.log('userRole', userRole)

  const queryParams: SectionQueryParams = {
    lessonId,
    pageNumber: 1,
    pageSize: 50,
    orderBy: 'orderindex',
    sortDirection: 'Asc'
  }
  const { data } = useSearchSectionQuery(queryParams, { skip: !lessonId })
  const [updateSectionOrder] = useUpdateLessonSectionOrderMutation()
  const rows = React.useMemo(() => data?.data.items ?? [], [data])

  const handleSaveOrder = async () => {
    try {
      await updateSectionOrder({
        id: Number(lessonId),
        orderedSectionIds
      }).unwrap()
      toast.success(tt('successMessage.saveOrder'))
      setOrderedSectionIds([])
    } catch (e) {
      toast.error(tt('errorMessage'))
    }
  }

  if (!data) return null
  return (
    <div>
      <hr className='my-10' />
      <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <h2 className='text-sky-custom-600 text-center text-2xl'>{t('list.title')}</h2>
        <div className='space-x-4'>
          {orderedSectionIds.length > 0 && (
            <Button className='bg-emerald-400' onClick={handleSaveOrder}>
              <Plus className='mr-1 h-4 w-4' />
              {tc('button.order')}
            </Button>
          )}

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
      </div>

      {userRole === LicenseType.TEACHER ? (
        <DataTable data={rows} columns={columns} enableRowSelection pagingData={data} />
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          enableRowSelection
          pagingData={data}
          enableDnd
          onReorder={(section) => {
            const orderedIds = section.map((s) => s.id)
            setOrderedSectionIds(orderedIds)
          }}
        />
      )}
    </div>
  )
}
