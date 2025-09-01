'use client'
import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { SPagination } from '@/components/shared/SPagination'
import { useModal } from '@/providers/ModalProvider'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useAppDispatch } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { toast } from 'sonner'
import SEmpty from '@/components/shared/empty/SEmpty'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { capitalizeFirst } from '@/utils/index'
import { setPageIndex, setPageSize } from '../../slice/curriculumSlice'
import { useDeleteCurriculumMutation, useSearchCurriculumQuery } from '../../api/curriculumApi'

export default function CurriculumList() {
  const t = useTranslations('curriculum')
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
  const handleNavigate = (curriculumId?: number) => {
    if (curriculumId) {
      router.push(`/resource/curriculum/update/${curriculumId}`)
    } else router.push('/resource/curriculum/create')
  }

  const handleDelete = async (e: React.MouseEvent, curriculumId: number) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      openModal('confirm', {
        message: t('form.confirmMessage.delete'),
        onConfirm: async () => {
          await deleteCurriculum(curriculumId).unwrap()
          toast.success(t('form.successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(t('form.errorMessage.delete'))
    }
  }

  if (!curriculumData || curriculumData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDetail')} />
  }

  return (
    <div>
      <div className='grid h-fit grid-cols-1 justify-items-stretch gap-y-10 py-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {rows.map((curriculum: any) => (
          <Link key={curriculum.id} href={`/${locale}/admin/curriculum/${curriculum.id}`}>
            <CardLayout
              imageSrc={curriculum.imageUrl}
              size='md'
              badge={
                <Badge className={`${getStatusBadgeClass(curriculum.status)}`}>
                  {capitalizeFirst(curriculum.status)}
                </Badge>
              }
            >
              <div>
                <p className='text-amber-custom-400 text-xs font-semibold'>{curriculum.code}</p>
                <h3 className='text-md font-semibold text-gray-700'>{curriculum.title}</h3>
                <p className='my-2 line-clamp-3 text-sm text-gray-500'>{curriculum.description}</p>
                <Badge className='bg-rose-300'>{curriculum.courseCount || 0} courses</Badge>
              </div>
            </CardLayout>
          </Link>
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
