'use client'
import { Button } from '@/components/shadcn/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Book, Film, Layers, List, Search, X } from 'lucide-react'
import { ChangeEvent, KeyboardEvent, useState } from 'react'

export enum FilterParams {
  COURSES = 'courses',
  ACTIVITIES = 'activities',
  LESSONS = 'lessons'
}

export const FilterOptions: {
  label: string
  value: FilterParams
  icon: React.ReactNode
}[] = [
  { label: 'Courses', value: FilterParams.COURSES, icon: <Book className='mr-2 h-4 w-4' /> },
  { label: 'Activities', value: FilterParams.ACTIVITIES, icon: <Film className='mr-2 h-4 w-4' /> },
  { label: 'Lessons', value: FilterParams.LESSONS, icon: <Layers className='mr-2 h-4 w-4' /> }
]

export interface SearchWithFilterProps {
  filter?: FilterParams
  placeholder?: string
  isLoading?: boolean
  onFilterChange?: (value: FilterParams) => void
  onSearchSubmit: (params: string) => void
}

export default function SearchWithFilter({
  filter,
  placeholder = 'Search files, resources, or projects...',
  isLoading = false,
  onSearchSubmit,
  onFilterChange
}: SearchWithFilterProps) {
  const [keyword, setKeyword] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<FilterParams>(filter || FilterParams.COURSES)

  const handleFilterChange = (value: FilterParams) => {
    setSelectedFilter(value)
    onFilterChange?.(value)
  }

  const handleSubmission = () => {
    const trimmedKeyword = keyword.trim()
    if (trimmedKeyword === '') return

    onSearchSubmit(trimmedKeyword)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmission()
    }
  }

  const handleClear = () => {
    setKeyword('')
  }

  return (
    <div className='mx-auto flex max-w-3xl flex-wrap items-center gap-4 rounded-full bg-transparent px-2 py-1 shadow-xl md:flex-nowrap md:px-4 md:py-2'>
      <div className='flex min-w-0 flex-2 items-center gap-2'>
        {/* filter dropdown */}
        {filter && onFilterChange ? (
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className='w-[180px] border-none bg-transparent px-2 py-1 text-sm shadow-none focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0'>
              <SelectValue placeholder='Filter by' />
            </SelectTrigger>
            <SelectContent>
              {FilterOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className='data-[state=checked]:bg-muted/30 focus:ring-0 focus:ring-offset-0 focus:outline-none'
                >
                  <div className='flex items-center'>
                    {option.icon}
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Search className='text-sky-custom-300 h-5 w-5' />
        )}
        <input
          value={keyword}
          onKeyDown={handleKeyPress}
          onChange={(e) => setKeyword(e.target.value)}
          type='text'
          placeholder={placeholder}
          disabled={isLoading}
          className='min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 focus:outline-none'
          aria-label='Search input'
        />

        {keyword && !isLoading && (
          <Button
            size={'icon'}
            variant='ghost'
            onClick={handleClear}
            className='p-1 text-gray-400 transition-colors hover:text-gray-600'
            aria-label='Clear search'
          >
            <X />
          </Button>
        )}
      </div>
      <Button onClick={handleSubmission} className='bg-sky-custom-300 text-light w rounded-full' disabled={isLoading}>
        {isLoading ? (
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
        ) : (
          <div className='flex items-center gap-2'>
            <Search className='h-5 w-5 text-white' /> Search
          </div>
        )}
      </Button>
    </div>
  )
}
