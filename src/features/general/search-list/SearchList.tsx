'use client'
import { useState, useMemo } from 'react'
import FilterSidebar from './FilterSidebar'
import SearchControls from './SearchControls'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/shadcn/sheet'
import EmptyState from './EmptyState'
import SearchGrid from './SearchGrid'
import { Button } from '@/components/shadcn/button'
import { Filter } from 'lucide-react'

const resources = [
  {
    title: 'Text to image',
    description: 'Generate high-quality images using text with latest Image 4 Model.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop&auto=format',
    category: 'Animals',
    age: '8-14+',
    duration: '6:00:00'
  },
  {
    title: 'Text to video',
    description: 'Generate video clips from a detailed description and high-quality images.',
    image: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=400&h=300&fit=crop&auto=format',
    category: 'Biology',
    age: '8-14+',
    duration: '6:00:00'
  },
  {
    title: 'Boards (beta)',
    description: 'Generate images or upload your own and start remixing on a board.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&auto=format',
    category: 'Coding',
    age: '8-14+',
    duration: '6:00:00'
  },
  {
    title: 'AI Chat Assistant',
    description: 'Interactive AI chatbot for learning and problem solving.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format',
    category: 'Animals',
    age: '10-16+',
    duration: '4:30:00'
  },
  {
    title: 'Code Generator',
    description: 'Generate code snippets and programming solutions automatically.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop&auto=format',
    category: 'Coding',
    age: '12-18+',
    duration: '8:15:00'
  },
  {
    title: 'Biology Lab Simulator',
    description: 'Virtual laboratory experiments for biology students.',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400&h=300&fit=crop&auto=format',
    category: 'Biology',
    age: '14-18+',
    duration: '3:45:00'
  }
]
const categories = ['All', 'Animals', 'Biology', 'Coding']

const durationToMinutes = (duration: any) => {
  const parts = duration.split(':')
  const hours = parseInt(parts[0]) || 0
  const minutes = parseInt(parts[1]) || 0
  return hours * 60 + minutes
}

export default function SearchList() {
  const [sortBy, setSortBy] = useState('relevant')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [durationValue, setDurationValue] = useState([480])
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredAndSortedData = useMemo(() => {
    let filtered = resources
    if (selectedCategory !== 'All') filtered = filtered.filter((item) => item.category === selectedCategory)
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    filtered = filtered.filter((item) => durationToMinutes(item.duration) <= durationValue[0])
    return filtered
  }, [sortBy, selectedCategory, searchQuery, durationValue])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='flex flex-col lg:flex-row'>
        <div className='hidden flex-1 p-6 lg:block'>
          <FilterSidebar durationValue={durationValue} setDurationValue={setDurationValue} />
        </div>
        <main className='flex-auto p-6'>
          <div className='mx-auto max-w-7xl'>
            <div className='mb-6'>
              <h1 className='text-2xl font-bold break-words sm:text-3xl md:text-4xl'>
                Search result "{searchQuery || 'all resources'}"
              </h1>
              <p className='mt-1 text-sm text-gray-600 sm:text-base'>
                Found {filteredAndSortedData.length} learning materials matching your criteria
              </p>
            </div>
            {/* Nút mở Filter trên mobile */}
            <div className='mb-4 flex lg:hidden'>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant='outline' className='gap-2'>
                    <Filter className='h-4 w-4' />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side='left' className='w-[80vw] sm:w-[400px]'>
                  <SheetHeader>
                    <SheetTitle className='text-lg'>Filters</SheetTitle>
                  </SheetHeader>
                  <div className='mt-4'>
                    <FilterSidebar durationValue={durationValue} setDurationValue={setDurationValue} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <SearchControls
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />

            {filteredAndSortedData.length > 0 ? <SearchGrid resources={filteredAndSortedData} /> : <EmptyState />}
          </div>
        </main>
      </div>
    </div>
  )
}
