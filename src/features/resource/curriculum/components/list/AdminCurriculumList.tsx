'use client'
import { SPagination } from '@/components/shared/SPagination'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import SEmpty from '@/components/shared/empty/SEmpty'
import { setPageIndex, setPageSize } from '../../slice/curriculumSlice'
import {
  useDeleteCurriculumMutation,
  useSearchCurriculumQuery,
  useUpdateCurriculumMutation
} from '../../api/curriculumApi'
import { CurriculumSliceParams, CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import CardLayout from '@/components/shared/card/CardLayout'
import Link from 'next/link'
import { SDropDown } from '@/components/shared/SDropDown'
import { EllipsisVertical } from 'lucide-react'
import { Button } from '@/components/shadcn/button'

export default function AdminCurriculumList() {
  const t = useTranslations('curriculum')
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const locale = useLocale()

  const queryParams: CurriculumSliceParams = useAppSelector((state) => state.curriculum)
  const { data: curriculumData, isLoading } = useSearchCurriculumQuery(queryParams)
  const rows = React.useMemo(() => curriculumData?.data.items ?? [], [curriculumData])

  const [updateCurriculum] = useUpdateCurriculumMutation()
  const [deleteCurriculum] = useDeleteCurriculumMutation()

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    dispatch(setPageIndex(newPage))
  }

  if (isLoading) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  const handleDelete = async (e: React.MouseEvent, curriculumId: number) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      openModal('confirm', {
        message: tt('confirmMessage.delete'),
        onConfirm: async () => {
          await deleteCurriculum(curriculumId).unwrap()
          toast.success(tt('successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  if (!curriculumData || curriculumData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDetail')} />
  }

  return (
    <div className='mx-auto mt-5 mb-20 max-w-7xl'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4'>
        {curriculumData.data.items.map((curriculum) => (
          <div key={curriculum.id} className='relative'>
            <CardLayout
              className='cursor-pointer rounded-2xl border-none bg-transparent'
              imageSrc={curriculum.imageUrl}
              onClick={() => router.push(`/${locale}/admin/curriculum/${curriculum.id}`)}
            >
              <div className='m-2 mt-1'>
                <h2 className='line-clamp-1 text-lg font-semibold'>{curriculum.title}</h2>
                <p className='line-clamp-4 flex-1 text-sm text-gray-600'>{curriculum.description}</p>
                <div className='mt-auto flex items-center gap-2'></div>
                <Link
                  href={`/${locale}/admin/curriculum/${curriculum.id}`}
                  className='mt-4 flex items-center text-sm font-medium text-sky-500 hover:underline'
                >
                  {t('list.viewDetails')} &gt;
                </Link>
              </div>
            </CardLayout>
            {curriculum.status === CurriculumStatus.DRAFT && (
              <div className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
                <SDropDown
                  trigger={
                    <button className='flex items-center justify-center rounded-full border border-gray-200 bg-white p-1'>
                      <EllipsisVertical className='h-3 w-3 text-gray-500' />
                    </button>
                  }
                  items={[
                    <button
                      key='draft'
                      onClick={() => {
                        updateCurriculum({ id: curriculum.id, body: { status: CurriculumStatus.PUBLISHED } })
                        toast.success(tt('successMessage.updateNoTitle'))
                      }}
                      className='text-sm'
                    >
                      {tc('button.publish')}
                    </button>
                  ]}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {curriculumData?.data?.totalPages > 1 && (
        <SPagination
          pageNumber={curriculumData.data.pageNumber}
          totalPages={curriculumData.data.totalPages}
          onPageChanged={handlePageChange}
          className='pb-6'
        />
      )}
    </div>
  )
}
