'use client'
import { useState, useMemo } from 'react'
import FilterSidebar from './course-list/FilterSidebar'
import SearchHeader from './course-list/SearchHeader'
import SearchGrid from './course-list/SearchGrid'
import { Button } from '@/components/shadcn/button'
import { Filter } from 'lucide-react'
import EmptySearch from '../../../components/shared/search/EmptySearch'
import { resources } from '@/utils/mockData'
import SSheet from '@/components/shared/SSheet'

const categories = ['All', 'Course', 'Lesson', 'Activity']

const durationToMinutes = (duration: any) => {
  const parts = duration.split(':')
  const hours = parseInt(parts[0]) || 0
  const minutes = parseInt(parts[1]) || 0
  return hours * 60 + minutes
}

const initialFilterItems = {
  sortBy: 'relevant',
  duration: [480],
  age: '',
  category: 'All',
  searchQuery: ''
}

export default function CourseList() {
  const [filterItems, setFilterItems] = useState(initialFilterItems)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilters = (key: keyof typeof filterItems, value: any) => {
    setFilterItems((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const resetFilters = () => {
    setFilterItems(initialFilterItems)
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = resources

    if (filterItems.category && filterItems.category !== 'All') {
      filtered = filtered.filter((item) => item.category === filterItems.category)
    }

    if (filterItems.age) {
      filtered = filtered.filter((item) => item.age === filterItems.age)
    }

    if (filterItems.searchQuery) {
      const q = filterItems.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    }

    filtered = filtered.filter((item) => durationToMinutes(item.duration) <= filterItems.duration[0])
    return filtered
  }, [filterItems])

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

            {filteredAndSortedData.length > 0 ? <SearchGrid resources={filteredAndSortedData} /> : <EmptySearch />}
          </div>
        </main>
      </div>
    </div>
  )
}
