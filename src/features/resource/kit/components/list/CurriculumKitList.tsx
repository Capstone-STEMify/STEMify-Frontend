import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import CardHorizontal from '@/components/shared/card/CardHorizontal'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SDropDown } from '@/components/shared/SDropDown'
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { useGetKitByIdQuery, useLazyGetKitByIdQuery } from '@/features/resource/kit/api/kitProductApi'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useModal } from '@/providers/ModalProvider'
import { skipToken } from '@reduxjs/toolkit/query'
import { EllipsisVertical, Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type KitListProps = { context: 'course'; kitId?: number } | { context: 'curriculum'; kitIds: number[] }

export default function KitListSection(props: KitListProps) {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { openModal, closeModal } = useModal()
  const { courseId } = useParams()
  const router = useRouter()
  const locale = useLocale()

  const isCourse = props.context === 'course'
  const isCurriculum = props.context === 'curriculum'

  const [kits, setKits] = useState<Kit[]>([])
  const [loadingKits, setLoadingKits] = useState(false)

  const { data: kitData, isLoading: loadingKit } = useGetKitByIdQuery(
    props.context === 'course' && props.kitId ? props.kitId : skipToken
  )
  const [triggerGetKitById] = useLazyGetKitByIdQuery()
  const [updateCourseKit] = useUpdateCourseMutation()

  // curriculum: fetch từng kitId
  useEffect(() => {
    const fetchKits = async () => {
      if (props.context === 'curriculum' && props.kitIds.length > 0) {
        setLoadingKits(true)
        try {
          const results = await Promise.all(props.kitIds.map((id) => triggerGetKitById(id).unwrap()))
          setKits(results.map((res) => res.data))
        } catch (error) {
          console.error('Error fetching kits:', error)
        } finally {
          setLoadingKits(false)
        }
      }
    }

    fetchKits()
  }, [props.context === 'curriculum' ? props.kitIds : []])

  const finalKits = isCourse ? (kitData?.data ? [kitData.data] : []) : kits

  const isLoading = isCourse ? loadingKit : loadingKits

  const handleDelete = async (e: React.MouseEvent, kitId: number, kitName: string) => {
    e.stopPropagation()
    e.preventDefault()

    openModal('confirm', {
      message: tt('confirmMessage.removeKit', { title: kitName }),
      onConfirm: async () => {
        try {
          await updateCourseKit({
            id: Number(courseId),
            body: { kitId: -1 }
          }).unwrap()
          toast.success(tt('successMessage.delete'))
        } catch (error) {
          toast.error(tt('errorMessage.general'))
        }
      }
    })
  }

  if (isLoading) return <LoadingComponent />

  return (
    <div className='mt-4 gap-10'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.title')} <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{finalKits.length}</span>
          {isCourse && (
            <span className='text-sm font-normal text-gray-500 italic'> (*{t('list.singleCourseNote')})</span>
          )}
        </h2>
        {isCourse && (
          <Button
            className='bg-amber-custom-400'
            onClick={() => {
              if (props.kitId !== undefined) {
                openModal('confirm', {
                  message: tt('confirmMessage.addAnotherKit'),
                  onConfirm: () => {
                    openModal('kitListTableModal', { kitIds: finalKits.map((kit) => kit.id) })
                  }
                })
              } else {
                openModal('kitListTableModal', { kitIds: [] })
              }
            }}
          >
            <Plus className='mr-1 h-4 w-4' />
            {tc('button.addKit')}
          </Button>
        )}
      </div>

      {finalKits.length > 0 ? (
        finalKits.map((kit) => (
          <div key={kit.id} className='relative flex max-w-xl min-w-0 gap-1'>
            <CardHorizontal
              onClick={() => router.push(`/${locale}/admin/kit/${kit.id}`)}
              imageUrl={
                kit.images?.[0]?.imageUrl ||
                'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              }
              title={kit.name}
              sku={kit.sku ?? 'SKU123'}
              description={kit.description || ''}
            />

            <div key={kit.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
              <SDropDown
                trigger={<EllipsisVertical className='mt-2 h-5 w-5 cursor-pointer text-yellow-400 hover:scale-[1.1]' />}
                items={[
                  <button
                    key={`delete-${kit.id}`}
                    className='cursor-pointer text-sm text-red-500'
                    onClick={(e) => handleDelete(e, kit.id, kit.name)}
                  >
                    {tc('button.remove')}
                  </button>
                ].filter(Boolean)}
              />
            </div>
          </div>
        ))
      ) : (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          <p className='text-gray-500'>{t('list.noData')}</p>
        </Card>
      )}
    </div>
  )
}
