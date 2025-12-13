import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import CardHorizontal from '@/components/shared/card/CardHorizontal'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SDropDown } from '@/components/shared/SDropDown'
import { useUpdateCourseMutation } from '@/features/resource/course/api/courseApi'
import { useGetKitByIdQuery, useLazyGetKitByIdQuery } from '@/features/resource/kit/api/kitProductApi'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { skipToken } from '@reduxjs/toolkit/query'
import { EllipsisVertical, Plus } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type KitListSectionProps = {
  context: 'course' | 'curriculum'
  kitId?: number
  kitIds?: number[]
}

export default function KitListSection({ context, kitId, kitIds = [] }: KitListSectionProps) {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { openModal } = useModal()
  const { courseId } = useParams()
  const router = useRouter()
  const locale = useLocale()

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const isCourse = context === 'course'
  const isCurriculum = context === 'curriculum'

  const [kits, setKits] = useState<Kit[]>([])
  const [loadingKits, setLoadingKits] = useState(false)

  const { data: kitData, isLoading: loadingKit } = useGetKitByIdQuery(isCourse && kitId ? kitId : skipToken)
  const [triggerGetKitById] = useLazyGetKitByIdQuery()
  const [updateCourseKit] = useUpdateCourseMutation()

  const fetchKits = useCallback(async () => {
    if (isCurriculum && kitIds.length > 0) {
      setLoadingKits(true)
      const kits: Kit[] = []
      for (const id of kitIds) {
        const result = await triggerGetKitById(id).unwrap()
        kits.push(result.data)
      }
      setKits(kits)
      setLoadingKits(false)
    }
  }, [isCurriculum, kitIds])

  useEffect(() => {
    fetchKits()
  }, [fetchKits])

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
        {isCourse && !selectedOrganizationId && (
          <Button
            className='bg-amber-custom-400'
            onClick={() => {
              if (kitId !== undefined) {
                openModal('confirm', {
                  message: tt('confirmMessage.addAnotherKit'),
                  onConfirm: () => {
                    openModal('kitListTableModal', { kitId })
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
        <div className='grid grid-cols-2 gap-6 pt-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {finalKits.map((kit) => (
            <Card
              key={kit.id}
              onClick={() => router.push(`/${locale}/admin/kit/${kit.id}`)}
              className='group relative cursor-pointer overflow-hidden rounded-xl border p-2 shadow-lg transition hover:shadow-md'
            >
              <div className='aspect-square w-full overflow-hidden rounded-2xl bg-gray-100'>
                <img
                  src={
                    kit.images?.[0]?.imageUrl ||
                    'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
                  }
                  alt={kit.name}
                  className='h-full w-full rounded-3xl object-cover transition group-hover:scale-105'
                />
              </div>
              <CardContent className='pt-2 text-center'>
                <h3 className='line-clamp-2 text-sm font-semibold text-gray-800'>{kit.name}</h3>
              </CardContent>

              {isCourse && !selectedOrganizationId && (
                <div className='absolute top-2 right-2 z-10'>
                  <SDropDown
                    trigger={<EllipsisVertical className='h-5 w-5 cursor-pointer text-yellow-400 hover:scale-110' />}
                    items={[
                      <button
                        key={`delete-${kit.id}`}
                        className='cursor-pointer text-sm text-red-500'
                        onClick={(e) => handleDelete(e, kit.id, kit.name)}
                      >
                        {tc('button.remove')}
                      </button>
                    ]}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          <p className='text-gray-500'>{t('list.noData')}</p>
        </Card>
      )}
    </div>
  )
}
