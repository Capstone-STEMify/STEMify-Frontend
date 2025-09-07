'use client'
import { SPagination } from '@/components/shared/SPagination'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import SEmpty from '@/components/shared/empty/SEmpty'
import { setPageIndex, setPageSize } from '../../slice/curriculumSlice'
import { useDeleteCurriculumMutation, useSearchCurriculumQuery } from '../../api/curriculumApi'
import { SCard } from '@/components/shared/card/SCard'
import Image from 'next/image'
import CardHorizontal from '@/components/shared/card/CardHorizontal'

export default function AdminCurriculumList() {
  const t = useTranslations('curriculum')
  const tt = useTranslations('toast')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()
  const locale = useLocale()

  useEffect(() => {
    dispatch(setPageSize(6))
  }, [dispatch])

  const { data: curriculumData, isLoading } = useSearchCurriculumQuery({})
  const [deleteCurriculum] = useDeleteCurriculumMutation()

  const rows = React.useMemo(() => curriculumData?.data.items ?? [], [curriculumData])

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
    <div>
      <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
        {rows.map((curriculum) => (
          <CardHorizontal
            key={curriculum.id}
            imageUrl={curriculum.imageUrl}
            title={curriculum.title}
            description={curriculum.description}
            buttonText='View Details'
            onButtonClick={() => router.push(`/${locale}/admin/curriculum/${curriculum.id}`)}
          />
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
