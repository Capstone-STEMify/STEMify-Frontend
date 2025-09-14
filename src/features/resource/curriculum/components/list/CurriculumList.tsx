'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { setPageIndex, setPageSize, setParam } from '@/features/resource/curriculum/slice/curriculumSlice'
import { CurriculumSliceParams, CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function CurriculumList() {
  const t = useTranslations('curriculum')
  const dispatch = useAppDispatch()
  const router = useRouter()

  const queryParams: CurriculumSliceParams = useAppSelector((state) => state.curriculum)
  const { data: curriculumData, isLoading } = useSearchCurriculumQuery(queryParams)

  useEffect(() => {
    dispatch(setParam({ key: 'status', value: CurriculumStatus.PUBLISHED }))
    dispatch(setPageSize(8))
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
  if (!curriculumData || curriculumData.data.items.length === 0) {
    return <SEmpty title={t('list.noData')} description={t('list.noDataDetail')} />
  }

  return (
    <div className='mx-auto max-w-7xl py-10 sm:px-6 lg:px-8'>
      <div className='grid cursor-pointer grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {curriculumData.data.items.map((curriculum) => (
          <CardLayout
            key={curriculum.id}
            imageSrc={curriculum.imageUrl || '/images/fallback.png'}
            onClick={() => router.push(`/resource/curriculum/${curriculum.id}`)}
          >
            <div className='flex min-h-0 flex-1 flex-col'>
              <h3 className='line-clamp-1 text-lg font-semibold'>{curriculum.title}</h3>
              <p className='line-clamp-4 text-sm text-gray-600'>{curriculum.description}</p>
              <div className='mt-auto flex items-center gap-2'></div>
            </div>
          </CardLayout>
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
