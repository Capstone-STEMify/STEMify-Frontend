import SSelect from '@/components/shared/SSelect'
import SearchTabs from '@/features/resource/course/components/list/SearchTabs'

interface SearchHeaderProps {
  filterItems: {
    sortBy: string
    category: string
    searchQuery: string
  }
  updateFilter: (key: keyof SearchHeaderProps['filterItems'], value: any) => void
  categories: string[]
  filteredAndSortedData: any[]
}

export default function SearchHeader({
  // sort by defaults to 'relevance'
  filterItems,
  categories,
  filteredAndSortedData,
  updateFilter
}: SearchHeaderProps) {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold break-words'>
          Search result &quot;{filterItems.searchQuery || 'All resources'}&quot;
        </h2>{' '}
        <p className='mt-1 text-sm text-gray-600 sm:text-base'>
          Found {filteredAndSortedData.length} learning materials matching your criteria
        </p>
      </div>
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <SearchTabs
          categories={categories}
          selectedCategory={filterItems.category}
          setSelectedCategory={(val) => updateFilter('category', val)}
        />

        <SSelect
          options={[
            { value: 'relevant', label: 'Most Relevant' },
            { value: 'newest', label: 'Newest First' },
            { value: 'shortest', label: 'Shortest Duration' },
            { value: 'longest', label: 'Longest Duration' }
          ]}
          placeholder='Sort by...'
          value={filterItems.sortBy}
          onChange={(val) => updateFilter('sortBy', val)}
        />
      </div>
    </div>
  )
}
