'use client'
import { useState, useMemo, useEffect } from 'react'

import { Button } from '@/components/shadcn/button'
import { Filter } from 'lucide-react'

import SSheet from '@/components/shared/SSheet'
import ModernPagination from '@/components/shared/paging/PagingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { useGetAllCourseQuery } from '@/features/resource/course/api/courseApi'
import FilterSidebar from '@/features/resource/course/components/list/FilterSidebar'
import SearchHeader from '@/features/resource/course/components/list/SearchHeader'
import SearchGrid from '@/features/resource/course/components/list/SearchGrid'

const categories = ['All', 'Course', 'Lesson', 'Activity']

const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return `${h}:${m}:00`
}

const initialFilterItems = {
  sortBy: 'relevant',
  duration: [1200],
  age: '',
  category: 'All',
  searchQuery: ''
}

export default function CourseList() {
  const [filterItems, setFilterItems] = useState(initialFilterItems)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 6
  const { data: CourseData, error, isLoading } = useGetAllCourseQuery()

  const updateFilters = (key: keyof typeof filterItems, value: any) => {
    setFilterItems((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilterItems(initialFilterItems)
  }

  useEffect(() => {
    setPage(1)
  }, [filterItems])

  const filteredAndSortedData = useMemo(() => {
    let filtered = CourseData?.data?.items || []

    if (filterItems.category && filterItems.category !== 'All') {
      filtered = filtered.filter((item) => item.categoryNames.includes(filterItems.category))
    }

    if (filterItems.age) {
      filtered = filtered.filter((item) => item.ageRangeLabel === filterItems.age)
    }

    if (filterItems.searchQuery) {
      const q = filterItems.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categoryNames.join(' ').toLowerCase().includes(q)
      )
    }

    filtered = filtered.filter((item) => item.duration <= filterItems.duration[0])
    return filtered
  }, [CourseData, filterItems])

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredAndSortedData.slice(start, start + pageSize)
  }, [filteredAndSortedData, page])

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize)

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='flex flex-col lg:flex-row'>
        <div className='hidden w-fit bg-white lg:block'>
          <FilterSidebar filterItems={filterItems} updateFilter={updateFilters} resetFilters={resetFilters} />
        </div>
        <main className='flex-auto p-6 px-16'>
          <div className='mx-auto max-w-7xl'>
            {/* mobile filter */}
            <SSheet
              isOpen={isFilterOpen}
              setOpen={setIsFilterOpen}
              title='Filters'
              content={
                <div className='mt-4'>
                  <FilterSidebar filterItems={filterItems} updateFilter={updateFilters} resetFilters={resetFilters} />
                </div>
              }
              trigger={
                <Button variant='outline' className='gap-2'>
                  <Filter className='h-4 w-4' />
                  Filters
                </Button>
              }
            />

            <SearchHeader
              filterItems={filterItems}
              updateFilter={updateFilters}
              categories={categories}
              filteredAndSortedData={filteredAndSortedData}
            />

            {pagedData.length > 0 ? (
              <>
                <SearchGrid
                  resources={pagedData.map((item) => ({ ...item, duration: formatDuration(item.duration) }))}
                />

                {/* Modern Pagination */}
                <ModernPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className='mt-8' />
              </>
            ) : (
              <SEmpty title='No learning materials found' description='Try adjusting your search terms or filters' />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
