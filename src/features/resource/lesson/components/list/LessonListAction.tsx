'use client'
import { Input } from '@/components/shadcn/input'
import { ChevronDown, Search, X } from 'lucide-react'
import { useState } from 'react'

export default function LessonListAction() {
  const [searchValue, setSearchValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [ageRangeValue, setAgeRangeValue] = useState('')
  const [gradesValue, setGradesValue] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [ageRangeOpen, setAgeRangeOpen] = useState(false)
  const [gradesOpen, setGradesOpen] = useState(false)

  const categories = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Art', 'Music', 'Physical Education']
  const ageRanges = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-17 years', '18+ years']
  const grades = [
    'Pre-K',
    'K',
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
    '6th Grade',
    '7th Grade',
    '8th Grade',
    '9th Grade',
    '10th Grade',
    '11th Grade',
    '12th Grade'
  ]

  const clearAll = () => {
    setSearchValue('')
    setCategoryValue('')
    setAgeRangeValue('')
    setGradesValue('')
    setCategoryOpen(false)
    setAgeRangeOpen(false)
    setGradesOpen(false)
  }

  const hasFilters = searchValue || categoryValue || ageRangeValue || gradesValue

  type SelectDropdownProps = {
    value: string
    setValue: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
    options: string[]
    placeholder: string
  }

  const SelectDropdown = ({ value, setValue, open, setOpen, options, placeholder }: SelectDropdownProps) => (
    <div className='relative w-full'>
      <Input
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        className='cursor-pointer border-gray-300 bg-white pr-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
        onClick={() => setOpen(!open)}
        readOnly
      />
      <ChevronDown
        className={`pointer-events-none absolute top-3 right-3 h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />

      {open && (
        <div className='absolute z-10 mt-1 max-h-50 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg'>
          {options.map((option, index) => (
            <div
              key={index}
              className='cursor-pointer px-4 py-2 text-sm transition-colors duration-150 last:border-b-0 hover:bg-blue-50'
              onClick={() => {
                setValue(option)
                setOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className='border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50'>
      <div className='px-8 py-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-800'>Filter Lessons</h2>
          {hasFilters && (
            <button
              onClick={clearAll}
              className='flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-100'
            >
              <X className='h-4 w-4' />
              Clear All
            </button>
          )}
        </div>

        <div className='grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Search Input */}
          <div className='relative w-full'>
            <Input
              type='text'
              placeholder='Search lessons...'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className='border-gray-300 bg-white pl-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            />
            <Search className='absolute top-3 left-3 h-4 w-4 text-gray-400' />
          </div>

          {/* Category Dropdown */}
          <SelectDropdown
            value={categoryValue}
            setValue={setCategoryValue}
            open={categoryOpen}
            setOpen={setCategoryOpen}
            options={categories}
            placeholder='Category (Select one option)'
          />

          {/* Age Range Dropdown */}
          <SelectDropdown
            value={ageRangeValue}
            setValue={setAgeRangeValue}
            open={ageRangeOpen}
            setOpen={setAgeRangeOpen}
            options={ageRanges}
            placeholder='Age Range (Select one option)'
          />

          {/* Grades Dropdown */}
          <SelectDropdown
            value={gradesValue}
            setValue={setGradesValue}
            open={gradesOpen}
            setOpen={setGradesOpen}
            options={grades}
            placeholder='Grades (Select one option)'
          />
        </div>

        {/* Active Filters Display */}
        {hasFilters && (
          <div className='mt-4 flex flex-wrap gap-2'>
            <span className='text-sm font-medium text-gray-600'>Active filters:</span>
            {searchValue && (
              <span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800'>
                Search: "{searchValue}"
                <X className='h-3 w-3 cursor-pointer hover:text-blue-600' onClick={() => setSearchValue('')} />
              </span>
            )}
            {categoryValue && (
              <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800'>
                Category: {categoryValue}
                <X className='h-3 w-3 cursor-pointer hover:text-green-600' onClick={() => setCategoryValue('')} />
              </span>
            )}
            {ageRangeValue && (
              <span className='inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800'>
                Age: {ageRangeValue}
                <X className='h-3 w-3 cursor-pointer hover:text-purple-600' onClick={() => setAgeRangeValue('')} />
              </span>
            )}
            {gradesValue && (
              <span className='inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-800'>
                Grade: {gradesValue}
                <X className='h-3 w-3 cursor-pointer hover:text-orange-600' onClick={() => setGradesValue('')} />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
