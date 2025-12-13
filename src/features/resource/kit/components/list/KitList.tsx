'use client'
import CardHorizontal from '@/components/shared/card/CardHorizontal'

import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPagination } from '@/components/shared/SPagination'
import { useDeleteKitMutation, useSearchKitQuery } from '@/features/resource/kit/api/kitProductApi'
import { setPageIndex } from '@/features/resource/kit/slice/kitProductSlice'
import { KitSliceParams } from '@/features/resource/kit/types/kit.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useStatusTranslation } from '@/utils/index'
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
  const statusTranslate = useStatusTranslation()

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
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }
  if (!kitData || kitData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} />
  }

  return (
    <div className='select-none'>
      <div className='mx-4 mb-10 space-y-6'>
        {kitData.data.items.map((kit) => (
          <CardHorizontal
            onClick={() => router.push(`/${locale}/admin/kit/${kit.id}`)}
            key={kit.id}
            imageUrl={kit.imageUrl || '/images/resources/activities.png'}
            title={kit.name}
            description={kit.description || ''}
            badge={kit.status}
          />
        ))}
      </div>

      {kitData.data.totalPages > 1 && (
        <SPagination
          pageNumber={kitData.data.pageNumber}
          totalPages={kitData.data.totalPages}
          onPageChanged={handlePageChange}
        />
      )}
    </div>
  )
}
