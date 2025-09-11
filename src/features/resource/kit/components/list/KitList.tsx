'use client'
import CardHorizontal from '@/components/shared/card/CardHorizontal'

import SEmpty from '@/components/shared/empty/SEmpty'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteKitMutation, useSearchKitQuery } from '@/features/resource/kit/api/kitApi'
import { setPageIndex } from '@/features/resource/kit/slice/kitSlice'
import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function KitList() {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const router = useRouter()
  const locale = useLocale()
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
    <div className='select-none'>
      <div className='mt-4 grid grid-cols-1 gap-10 lg:grid-cols-2'>
        {kitData.data.items.map((kit) => (
          <CardHorizontal
            onClick={() => router.push(`/${locale}/admin/kit/${kit.id}`)}
            key={kit.id}
            imageUrl={kit.images?.[0].imageUrl || '/images/resources/activities.png'}
            title={kit.name}
            description={kit.description || ''}
            className='max-w-3xl'
            height={100}
          />
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
