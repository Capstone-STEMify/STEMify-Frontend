'use client'

import { Input } from '@/components/shadcn/input'
import { useLazyGetAllAgeRangeQuery } from '@/features/resource/age-range/api/ageRangeApi'
import { useLazyGetAllCategoryQuery } from '@/features/resource/category/api/categoryApi'
import { useLazyGetAllSkillQuery } from '@/features/resource/skill/api/skillApi'
import { useLazyGetAllStandardQuery } from '@/features/resource/standard/api/standardApi'
import { Search, X } from 'lucide-react'
import SSelect from '@/components/shared/SSelect'
import { Button } from '@/components/shadcn/button'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { resetParams, setPageSize, setParam, setSearchTerm } from '@/features/resource/lesson/slice/lessonSlice'
import { getLabel, getOptions } from '@/utils/index'
import { useTranslations } from 'next-intl'
import { LessonStatus } from '../../types/lesson.type'
import { useSession } from 'next-auth/react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { UserRole } from '@/types/userRole'
import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'

export default function LessonListAction() {
  const t = useTranslations('LessonList')
  const tc = useTranslations('common')
  const [search, setSearch] = useState<string>('')

  const { status } = useSession()
  const role = useAppSelector((state) => state.selectedOrganization.currentRole)

  const canSeeStatus = status === 'authenticated' && (role === UserRole.STAFF || role === UserRole.ADMIN)

  // Redux
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.lesson)
  const debouncedSearchQuery = useDebounce(search, 500)

  // Lazy queries (hooks must always run)
  const [getCategory, { data: categories }] = useLazyGetAllCategoryQuery()
  const [getSkill, { data: skills }] = useLazyGetAllSkillQuery()
  const [getAgeRange, { data: ageRanges }] = useLazyGetAllAgeRangeQuery()
  const [getStandard, { data: standards }] = useLazyGetAllStandardQuery()

  // Clear all filters and reset page size
  const clearAll = () => {
    dispatch(resetParams())
    dispatch(setPageSize(12))
  }

  const hasFilters = Boolean(
    search || filters.categoryId || filters.ageRangeId || filters.skillId || filters.standardId || filters.status
  )

  // Options
  const categoryOptions = getOptions(categories?.data.items, 'name')
  const skillOptions = getOptions(skills?.data.items, 'skillName')
  const ageRangeOptions = getOptions(ageRanges?.data.items, 'ageRangeLabel')
  const standardOptions = getOptions(standards?.data.items, 'standardName')
  const statusOptions = Object.entries(LessonStatus)
    .filter(([key]) => key.toLowerCase() !== 'deleted')
    .map(([key, value]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
      value
    }))

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearchQuery))
  }, [debouncedSearchQuery, dispatch])

  return (
    <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <div className='px-8 py-6'>
        {status === 'loading' ? (
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
            <LoadingComponent size={18} textShow={false} />
          </div>
        ) : (
          <>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-800'>{t('filterTitle')}</h2>
              {hasFilters && (
                <div className='flex items-center gap-8'>
                  {/* <Button
                    onClick={() => console.log('Search clicked')}
                    className='border border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100'
                  >
                    <Search className='h-4 w-4' />
                    {t('actions.searchBtn')}
                  </Button> */}
                  <Button
                    onClick={clearAll}
                    className='border border-red-200 bg-red-50 px-4 text-red-600 hover:bg-red-100'
                  >
                    <X className='h-4 w-4' />
                    {tc('button.clear')}
                  </Button>
                </div>
              )}
            </div>

            <div className='grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {/* Search */}
              <div className='relative w-full'>
                <Input
                  type='text'
                  placeholder={t('placeHolder.search') ?? ''}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                />
                <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
              </div>

              {/* Category */}
              <SSelect
                placeholder={t('placeHolder.category')}
                value={filters.categoryId?.toString() ?? ''}
                onChange={(val) => dispatch(setParam({ key: 'categoryId', value: Number(val) }))}
                options={categoryOptions}
                onOpen={(open) => {
                  if (open && !categories) getCategory()
                }}
              />

              {/* Skill */}
              <SSelect
                placeholder={t('placeHolder.skill')}
                value={filters.skillId?.toString() ?? ''}
                onChange={(val) => dispatch(setParam({ key: 'skillId', value: Number(val) }))}
                options={skillOptions}
                onOpen={(open) => {
                  if (open && !skills) getSkill()
                }}
              />

              {/* Age Range */}
              <SSelect
                placeholder={t('placeHolder.ageRange')}
                value={filters.ageRangeId?.toString() ?? ''}
                onChange={(val) => dispatch(setParam({ key: 'ageRangeId', value: Number(val) }))}
                options={ageRangeOptions}
                onOpen={(open) => {
                  if (open && !ageRanges) getAgeRange()
                }}
              />

              {/* Standard */}
              {/* <SSelect
                placeholder={t('placeHolder.standard')}
                value={filters.standardId?.toString() ?? ''}
                onChange={(val) => dispatch(setParam({ key: 'standardId', value: Number(val) }))}
                options={standardOptions}
                onOpen={(open) => {
                  if (open && !standards) getStandard()
                }}
              /> */}

              {/* Status (role-gated) */}
              {canSeeStatus && (
                <SSelect
                  placeholder={t('placeHolder.status')}
                  value={filters.status?.toString() ?? ''}
                  onChange={(val) => dispatch(setParam({ key: 'status', value: val as LessonStatus }))}
                  options={statusOptions}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
