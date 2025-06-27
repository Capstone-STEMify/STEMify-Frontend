'use client'

import { Search } from 'lucide-react'
import React, { KeyboardEvent, memo, useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'

type SearchBarProps = {
  className?: string
  placeholder?: string
  defaultValue?: string
  onDebouncedSearch?: (query: string) => void
}

const SearchBar = memo(function SearchBar({
  className = '',
  placeholder = 'Search STEMify',
  defaultValue = '',
  onDebouncedSearch
}: SearchBarProps) {
  const [input, setInput] = useState(defaultValue)
  const debounced = useDebounce(input, 500)

  useEffect(() => {
    if (onDebouncedSearch) onDebouncedSearch(debounced)
  }, [debounced, onDebouncedSearch])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (onDebouncedSearch) onDebouncedSearch(debounced)
    }
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-100 md:px-4 md:py-2 ${className}`}
    >
      <Search size={20} className='text-gray-400' />
      <input
        type='text'
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className='w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none'
      />
    </div>
  )
})

export default SearchBar
