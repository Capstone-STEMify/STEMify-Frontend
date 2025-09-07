'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import { SDropDown } from '@/components/shared/SDropDown'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteKitMutation, useSearchKitQuery } from '@/features/resource/kit/api/kitApi'
import { setPageIndex } from '@/features/resource/kit/slice/kitSlice'
import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { EllipsisVertical } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

export default function KitList() {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')

  const { openModal } = useModal()
  const dispatch = useAppDispatch()

  const queryParams: KitSliceParams = useAppSelector((state) => state.kit)
  const { data: kitData, isLoading } = useSearchKitQuery(queryParams)
  const [deleteKit] = useDeleteKitMutation()

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  const handleDelete = async (e: React.MouseEvent, kitId: number) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      openModal('confirm', {
        message: tt('confirmMessage.delete', { title: '' }),
        onConfirm: async () => {
          await deleteKit(kitId).unwrap()
          toast.success(tt('successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (!kitData || kitData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDescription')} />
  }

  return (
    <div className='px-5 select-none'>
      <div className='grid h-fit grid-cols-1 justify-items-center gap-y-10 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {kitData.data.items.map((kit) => (
          <div key={kit.id} className='relative flex min-w-0 gap-1'>
            <Link href={`/resource/kit/${kit.id}`} className='flex w-fit flex-col justify-between'>
              <CardLayout imageSrc={kit.kitImages?.[0].url || '/images/fallback.png'} size='sm'>
                <div>
                  <h3 className='line-clamp-1 text-sm font-semibold text-gray-900'>{kit.name}</h3>
                  <p className='line-clamp-4 text-xs text-gray-600'>{kit.description}</p>
                </div>
              </CardLayout>
            </Link>

            <div key={kit.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
              <SDropDown
                trigger={
                  <EllipsisVertical className='mt-2 h-5 w-5 text-white hover:scale-[1.1] hover:text-yellow-400' />
                }
                items={[
                  <p key={`update-${kit.id}`} className='text-sm'>
                    {tc('button.update')}
                  </p>,
                  <button
                    key={`delete-${kit.id}`}
                    className='text-sm text-red-500'
                    onClick={(e) => handleDelete(e, kit.id)}
                  >
                    {tc('button.delete')}
                  </button>
                ].filter(Boolean)}
              />
            </div>
          </div>
        ))}
      </div>

      {kitData.data.totalPages > 1 && (
        <SPagination
          pageNumber={kitData.data.pageNumber}
          totalPages={kitData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-10'
        />
      )}
    </div>
  )
}
