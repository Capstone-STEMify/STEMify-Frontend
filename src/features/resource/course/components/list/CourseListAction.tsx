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
import { resetParams, setPageSize, setParam, setSearchTerm } from '@/features/resource/course/slice/courseSlice'
import { getLabel, getOptions } from '@/utils/index'

export default function CoyurseListAction() {
  // Redux hooks
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.course)

  // Lazy queries
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
    filters.search || filters.categoryId || filters.ageRangeId || filters.skillId || filters.standardId
  )

  // Function to render filter tags
  const renderFilterTag = (
    key: keyof typeof filters,
    label: string,
    color: string,
    options?: { value: string; label: string }[]
  ) =>
    filters[key] && (
      <span className={`inline-flex items-center gap-1 rounded-full ${color} px-3 py-1 text-sm`}>
        {label}: {getLabel(filters[key], options ?? [])}
        <X className='h-3 w-3 cursor-pointer' onClick={() => dispatch(setParam({ key, value: '' }))} />
      </span>
    )

  // Options for selects
  const categoryOptions = getOptions(categories?.data.items, 'categoryName')
  const skillOptions = getOptions(skills?.data.items, 'skillName')
  const ageRangeOptions = getOptions(ageRanges?.data.items, 'ageRangeLabel')
  const standardOptions = getOptions(standards?.data.items, 'standardName')

  return (
    <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <div className='px-8 py-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-800'>Filter Lessons</h2>
          {hasFilters && (
            <div className='flex items-center gap-8'>
              {/* Search Button */}
              <Button
                onClick={() => console.log('Search clicked')}
                className='border border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100'
              >
                <Search className='h-4 w-4' />
                Search
              </Button>
              {/* Clear All Button */}
              <Button onClick={clearAll} className='border border-red-200 bg-red-50 px-4 text-red-600 hover:bg-red-100'>
                <X className='h-4 w-4' />
                Clear All
              </Button>
            </div>
          )}
        </div>

        <div className='grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {/* Search Input */}
          <div className='relative w-full'>
            <Input
              type='text'
              placeholder='Search courses...'
              value={filters.search}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className='border-gray-300 bg-white pl-10 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
            <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          </div>

          {/* Category */}
          <SSelect
            placeholder='Category (Select one option)'
            value={filters.categoryId?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'categoryId', value: Number(val) }))}
            options={categoryOptions}
            onOpen={(open) => {
              if (open && !categories) getCategory()
            }}
          />

          {/* Skill */}
          <SSelect
            placeholder='Skill (Select one option)'
            value={filters.skillId?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'skillId', value: Number(val) }))}
            options={skillOptions}
            onOpen={(open) => {
              if (open && !skills) getSkill()
            }}
          />

          {/* Age Range */}
          <SSelect
            placeholder='Age Range (Select one option)'
            value={filters.ageRangeId?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'ageRangeId', value: Number(val) }))}
            options={ageRangeOptions}
            onOpen={(open) => {
              if (open && !ageRanges) getAgeRange()
            }}
          />

          {/* Standard */}
          <SSelect
            placeholder='Standard (Select one option)'
            value={filters.standardId?.toString() ?? ''}
            onChange={(val) => dispatch(setParam({ key: 'standardId', value: Number(val) }))}
            options={standardOptions}
            onOpen={(open) => {
              if (open && !standards) getStandard()
            }}
          />
        </div>

        {/* Active Filters */}
        {hasFilters && (
          <div className='mt-4 flex flex-wrap gap-2'>
            <span className='text-sm font-medium text-gray-600'>Active filters:</span>
            {renderFilterTag('search', 'Search', 'bg-blue-100 text-blue-800')}
            {renderFilterTag('categoryId', 'Category', 'bg-green-100 text-green-800', categoryOptions)}
            {renderFilterTag('ageRangeId', 'Age', 'bg-purple-100 text-purple-800', ageRangeOptions)}
            {renderFilterTag('skillId', 'Skill', 'bg-yellow-100 text-yellow-800', skillOptions)}
            {renderFilterTag('standardId', 'Standard', 'bg-red-100 text-red-800', standardOptions)}
          </div>
        )}
      </div>
    </div>
  )
}
