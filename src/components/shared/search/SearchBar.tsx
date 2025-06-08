import { Search } from 'lucide-react'

type SearchBarProps = {
  className?: string
  placeholder?: string
}

export default function SearchBar({ className = '', placeholder = 'Search STEMify' }: SearchBarProps) {
  return (
    <div
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-1 hover:bg-gray-100 md:px-4 md:py-2 ${className}`}
    >
      <Search size={20} className='text-gray-400' />

      <input
        type='text'
        placeholder={placeholder}
        className='w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none'
      />
    </div>
  )
}
