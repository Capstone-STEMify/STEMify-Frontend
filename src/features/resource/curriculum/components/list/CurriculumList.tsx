'use client'
import CardLayout from '@/components/shared/card/CardLayout'
import SEmpty from '@/components/shared/empty/SEmpty'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SPagination } from '@/components/shared/SPagination'
import { useSearchCurriculumQuery } from '@/features/resource/curriculum/api/curriculumApi'
import { setPageIndex, setPageSize, setParam } from '@/features/resource/curriculum/slice/curriculumSlice'
import { CurriculumSliceParams, CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
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
    <div className='mx-auto mb-20 max-w-7xl sm:px-6 lg:px-8'>
      <div className='mb-30 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {curriculumData.data.items.map((curriculum) => (
          <CardLayout
            className='rounded-2xl border-none shadow-xl'
            key={curriculum.id}
            imageSrc={curriculum.imageUrl || '/images/fallback.png'}
            onClick={() => router.push(`/resource/curriculum/${curriculum.id}`)}
          >
            <div className='m-2 mt-1'>
              <h2 className='line-clamp-1 text-lg font-semibold'>{curriculum.title}</h2>

              {/* Rating */}
              <div className='mt-1 mb-2 flex items-center gap-1 text-sm text-yellow-500'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill='currentColor' stroke='none' />
                ))}
                <span className='ml-2 text-xs text-gray-700'>
                  {124} {t('list.reviews')}
                </span>
              </div>

              <p className='line-clamp-4 text-sm text-gray-600'>{curriculum.description}</p>
              <div className='mt-auto flex items-center gap-2'></div>
              <Link
                href={`/resource/curriculum/${curriculum.id}`}
                className='mt-4 flex items-center text-sm font-medium text-sky-500 hover:underline'
              >
                {t('list.viewDetails')} &gt;
              </Link>
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
