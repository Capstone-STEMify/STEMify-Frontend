'use client'
import { Button } from '@/components/shadcn/button'
import { Search, X } from 'lucide-react'
import { KeyboardEvent, useState } from 'react'

export interface SearchBasicProps {
  onSearchSubmit: (params: string) => void
  placeholder?: string
  isLoading?: boolean
}

export default function SearchBasic({
  onSearchSubmit,
  placeholder = 'Search files, resources, or projects...',
  isLoading = false
}: SearchBasicProps) {
  const [keyword, setKeyword] = useState<string>('')

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
    <div className='bg-light mx-auto flex max-w-lg flex-wrap items-center gap-4 rounded-full px-2 py-1 shadow-xl md:flex-nowrap md:px-4 md:py-2'>
      <div className='flex min-w-0 flex-2 items-center gap-2'>
        <Search className='text-skye-custom-300 h-5 w-5' />
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
      <Button onClick={handleSubmission} className='bg-skye-custom-300 text-light w rounded-full' disabled={isLoading}>
        {isLoading ? (
          <div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
        ) : (
          <Search className='h-5 w-5 text-white' />
        )}
      </Button>
    </div>
  )
}
