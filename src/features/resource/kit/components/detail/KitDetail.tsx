'use client'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCarousel } from '@/components/shared/SCarousel'
import {
  useDeleteKitMutation,
  useGetKitByIdQuery,
  useUpdateKitMutation
} from '@/features/resource/kit/api/kitProductApi'
import WhatsIncluded from '@/features/resource/kit/components/shop/details/ProductConstituent'
import { KitProductStatus } from '@/features/resource/kit/types/kit.type'
import { useModal } from '@/providers/ModalProvider'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { Plus, SquarePen, Star, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function KitDetail() {
  const t = useTranslations('kits')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const router = useRouter()
  const locale = useLocale()

  const { openModal } = useModal()
  const { kitId } = useParams()

  const { data: kitData, isLoading, isError, refetch } = useGetKitByIdQuery(Number(kitId), { skip: !Number(kitId) })
  const [deleteKit] = useDeleteKitMutation()
  const [updateKitStatus] = useUpdateKitMutation()

  const handleDelete = async () => {
    await deleteKit(Number(kitId)).unwrap()
    toast.success(`${tt('successMessage.delete', { title: kitData?.data.name || '' })}`)
    router.push(`/${locale}/admin/kit`)
  }

  const handleUpdateKitStatus = async (status: KitProductStatus) => {
    await updateKitStatus({ id: Number(kitId), body: { status } }).unwrap()
    toast.success(`${tt('successMessage.action', { action: status, title: kitData?.data.name || '' })}`)
  }

  const addComponentButton = (
    <Button
      onClick={() => {
        console.log(kitData?.data.components)
        openModal('selectComponentListModal', {
          kitId: kitData?.data.id,
          componentIds: kitData?.data.components?.map((c) => c.componentId),
          existedComponents: kitData?.data.components || [],
          refetch: refetch
        })
      }}
      className='bg-sky-custom-300 mt-4 rounded-full px-4 text-white'
    >
      <Plus className='h-4 w-4' />
    </Button>
  )

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (isError || !kitData) return <SEmpty title='No Kit Found' description='Please check the kit and try again.' />

  return (
    <div>
      <div className='mx-auto min-h-screen max-w-7xl px-4 pb-8 sm:px-6'>
        <div className='flex items-center gap-5 pb-5'>
          <BackButton />
          <h1>{t('detail.title')}</h1>
        </div>
        <section className='grid grid-cols-1 gap-12 py-5 lg:grid-cols-2'>
          {/* Left Section */}
          <div className='flex flex-col'>
            <div className='mb-2 flex items-center gap-2'>
              <h2 className='text-4xl font-bold tracking-tight'>{kitData.data.name}</h2>
              <span className='mx-2'>
                <Badge className={getStatusBadgeClass(kitData.data.status)}>{kitData.data.status}</Badge>
              </span>
              <span className='cursor-pointer text-blue-500'>
                <SquarePen
                  onClick={() => {
                    openModal('upsertKit', { kitId: kitData.data.id })
                  }}
                />
              </span>
              <span className='cursor-pointer text-red-500'>
                <Trash2
                  onClick={() => {
                    openModal('confirm', {
                      message: `${tt('confirmMessage.delete', { title: kitData.data.name || '' })}`,
                      onConfirm: () => handleDelete()
                    })
                  }}
                />
              </span>
            </div>
            <hr className='mx-auto my-4 w-full border-gray-300' />
            <p>
              <span className='font-medium'>{t('detail.weight')}:</span> {kitData.data.weight} grams
            </p>
            <p>
              <span className='font-medium'>{t('detail.dimensions')}:</span> {kitData.data.dimensions}
            </p>
            <p className='mt-2 font-medium'>{t('detail.descriptionLabel')}:</p>
            <p className='leading-relaxed text-gray-700'>{kitData.data.description}</p>

            {kitData.data.status === KitProductStatus.DRAFT && (
              <Button
                className='bg-amber-custom-400 mt-2 w-fit px-10 text-white'
                onClick={() => handleUpdateKitStatus(KitProductStatus.ACTIVE)}
              >
                {tc('button.publish')}
              </Button>
            )}
          </div>

          {/* Right Section */}
          <div className='flex items-center'>
            <SCarousel
              className='mx-auto w-full rounded-3xl shadow-md'
              variant='plugin'
              autoplayDelay={2000}
              items={(kitData.data.images?.length ? kitData.data.images : [{ imageUrl: '/images/fallback.png' }])
                .filter((img) => img?.imageUrl && img.imageUrl.trim() !== '')
                .map((images, i) => (
                  <Image
                    src={images.imageUrl || '/images/fallback.png'}
                    alt={images.alt || 'Kit Image'}
                    width={500}
                    height={500}
                    key={i}
                    className='aspect-square w-full rounded-3xl object-cover shadow-xs'
                  />
                ))}
            />
          </div>
        </section>
        <hr className='mx-auto my-10 w-full max-w-6xl border-gray-300' />
        {/* Components list */}
        <WhatsIncluded components={kitData.data.components} addBtn={addComponentButton} refetch={refetch} />
      </div>
    </div>
  )
}
