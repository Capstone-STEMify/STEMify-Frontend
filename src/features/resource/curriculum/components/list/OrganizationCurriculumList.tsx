'use client'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useState, useMemo } from 'react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDate, useStatusTranslation } from '@/utils/index'
import { useGetCurriculumsByOrganizationIdQuery } from '@/features/organization/api/organizationApi'
import { Badge } from '@/components/shadcn/badge'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { BookOpen, Calendar, GraduationCap, Filter } from 'lucide-react'
import { CurriculumStatus } from '@/features/resource/curriculum/types/curriculum.type'
import { useAppSelector } from '@/hooks/redux-hooks'

export default function OrganizationCurriculumList() {
  const t = useTranslations('organization.curriculum')
  const statusTranslate = useStatusTranslation()
  const router = useRouter()
  const locale = useLocale()

  const { selectedOrganizationId } = useAppSelector((state) => state.selectedOrganization)

  const [selectedStatus, setSelectedStatus] = useState<CurriculumStatus | 'ALL'>('ALL')

  const { data: curriculumData, isLoading } = useGetCurriculumsByOrganizationIdQuery(
    { organizationId: selectedOrganizationId! },
    { skip: !selectedOrganizationId }
  )
  // Filter curriculums based on selected status
  const filteredCurriculums = useMemo(() => {
    if (!curriculumData?.data?.curriculums) return []

    if (selectedStatus === 'ALL') {
      return curriculumData.data.curriculums
    }

    return curriculumData.data.curriculums.filter((curriculum) => curriculum.status === selectedStatus)
  }, [curriculumData, selectedStatus])

  if (isLoading) {
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  if (!curriculumData || curriculumData.data.curriculums.length === 0) {
    return (
      <div className='mx-auto max-w-7xl px-5 py-12'>
        <SEmpty title={t('noData')} />
      </div>
    )
  }

  const statusOptions: Array<CurriculumStatus | 'ALL'> = [
    'ALL',
    CurriculumStatus.DRAFT,
    CurriculumStatus.PUBLISHED,
    CurriculumStatus.ARCHIVED
  ]

  return (
    <div className='mx-auto max-w-7xl px-5'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <div className='rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg'>
            <GraduationCap className='h-7 w-7 text-white' />
          </div>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
            <p className='mt-1 text-sm text-gray-600'>
              {curriculumData.data.curriculums.length} {t('curriculum')}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className='mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
        <div className='flex flex-wrap items-center gap-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
            <Filter className='h-4 w-4' />
            <span>{t('filterByStatus')}:</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedStatus === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? t('all') : statusTranslate(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className='mt-3 text-sm text-gray-600'>
          {t('showing')} <span className='font-semibold text-gray-900'>{filteredCurriculums.length}</span>{' '}
          {t('results')}
        </div>
      </div>

      {/* Empty State for Filtered Results */}
      {filteredCurriculums.length === 0 ? (
        <div className='py-12'>
          <SEmpty title={t('noResultsForFilter')} />
        </div>
      ) : (
        /* Curriculum Grid */
        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3'>
          {filteredCurriculums.map((curriculum) => (
            <CardLayout
              key={curriculum.id}
              className='cursor-pointer hover:-translate-y-1'
              imageSrc={curriculum.imageUrl}
              onClick={() => router.push(`/${locale}/organization/curriculum/${curriculum.id}`)}
              badge={
                <Badge className={`${getStatusBadgeClass(curriculum.status)} shadow-sm`}>
                  {statusTranslate(curriculum.status)}
                </Badge>
              }
              action={<Badge variant={'secondary'}>{curriculum.code}</Badge>}
            >
              <div>
                {/* Title */}
                <h2 className='mb-1 line-clamp-2 text-lg font-bold text-gray-900 transition-colors'>
                  {curriculum.title}
                </h2>

                <div className='space-y-2'>
                  {/* Course Count */}
                  <div className='flex items-center gap-2 text-sm text-gray-700'>
                    <BookOpen className='h-4 w-4 text-blue-600' />
                    <span className='font-medium'>
                      {curriculum.courseCount} {t('courses')}
                    </span>
                  </div>

                  {/* Dates */}
                  <div className='flex items-center gap-2 text-sm'>
                    <span className='text-gray-600'>{t('startDate')}:</span>
                    <span className='font-medium text-gray-900'>{formatDate(curriculum.startDate, { locale })}</span>
                  </div>

                  <div className='flex items-center gap-2 text-sm'>
                    <span className='text-gray-600'>{t('endDate')}:</span>
                    <span className='font-medium text-gray-900'>{formatDate(curriculum.endDate, { locale })}</span>
                  </div>
                </div>
              </div>
            </CardLayout>
          ))}
        </div>
      )}
    </div>
  )
}
