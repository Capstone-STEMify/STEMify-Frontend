'use client'
import { Search } from 'lucide-react'
import React, { KeyboardEvent, useState } from 'react'

type SearchBarProps = {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchBar({ className = '', placeholder = 'Search STEMify', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const hanldeKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch((e.target as HTMLInputElement).value)
    }
  }

  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-100 md:px-4 md:py-2 ${className}`}
    >
      <Search size={20} className='text-gray-400' />

      <input
        type='text'
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={hanldeKeyDown}
        className='w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none'
      />
    </div>
  )
}
