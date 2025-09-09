'use client'
import BackButton from '@/components/shared/button/BackButton'
import CardHorizontal from '@/components/shared/card/CardHorizontal'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCarousel } from '@/components/shared/SCarousel'
import {
  useDeleteKitMutation,
  useGetKitByIdQuery,
  useSearchKitQuery,
  useUpdateKitMutation
} from '@/features/resource/kit/api/kitApi'
import { useModal } from '@/providers/ModalProvider'
import { SquarePen, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

export default function KitDetail() {
  const t = useTranslations('kits')
  const tt = useTranslations('toast')

  const { openModal } = useModal()
  const { kitId } = useParams()

  const { data: kitData, isLoading, isError } = useGetKitByIdQuery(Number(kitId), { skip: !Number(kitId) })
  const [deleteKit] = useDeleteKitMutation()
  const [updateKit] = useUpdateKitMutation()

  const handleDelete = async () => {
    await deleteKit(Number(kitId)).unwrap()
    toast.success(`${tt('successMessage.delete', { title: kitData?.data.name || '' })}`)
  }

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
      <div className='flex items-center gap-5 pb-5'>
        <BackButton />
        <h1>{t('detail.title')}</h1>
      </div>

      <div className='mx-auto min-h-screen max-w-6xl px-4 pb-8 sm:px-6 lg:px-8'>
        <section className='grid grid-cols-1 gap-12 py-5 md:grid-cols-2'>
          {/* Left Section */}
          <div className='flex flex-col'>
            <div className='mb-4 flex items-center gap-2'>
              <h2 className='text-4xl font-bold tracking-tight'>{kitData.data.name}</h2>
              <span className='cursor-pointer text-blue-500'>
                <SquarePen
                  onClick={() => {
                    openModal('upsertCurriculum', { curriculum: kitData.data.id })
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

            <p className='mb-4 leading-relaxed text-gray-700'>{kitData.data.description}</p>
          </div>

          {/* Right Section */}
          <SCarousel
            className='mx-auto w-full rounded-md shadow-md'
            variant='plugin'
            autoplayDelay={2000}
            items={(kitData.data.kitImages?.length
              ? kitData.data.kitImages
              : [{ url: '/images/fallback.png', alt: 'Fallback Image' }]
            ).map((img, i) => (
              <div className='p-1' key={i}>
                <Image
                  src={img.url || '/images/fallback.png'}
                  alt={img.alt || 'Kit Image'}
                  width={500}
                  height={500}
                  className='w-full max-w-xl rounded-3xl object-cover shadow-xs'
                />
              </div>
            ))}
          />
        </section>
      </div>
    </div>
  )
}
