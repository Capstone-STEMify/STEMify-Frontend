'use client'
import { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Search, Filter, Clock } from 'lucide-react'
import ResourceCard from '@/components/shared/card/CourseCard'

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

// Helper function to convert duration string to minutes for filtering
const durationToMinutes = (duration: any) => {
  const parts = duration.split(':')
  const hours = parseInt(parts[0]) || 0
  const minutes = parseInt(parts[1]) || 0
  return hours * 60 + minutes
}

export default function GenerationGallery() {
  const [sortBy, setSortBy] = useState('relevant')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [durationValue, setDurationValue] = useState([480]) // Default to 8 hours in minutes

  const filteredAndSortedData = useMemo(() => {
    let filtered = resources

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by duration (convert duration string to minutes for comparison)
    filtered = filtered.filter((item) => durationToMinutes(item.duration) <= durationValue[0])

    // Sort (for now just return as is since we don't have popularity/rating data)
    // You can add sorting logic here when you have more data fields
    return filtered
  }, [sortBy, selectedCategory, searchQuery, durationValue])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='flex'>
        {/* Enhanced Filter Sidebar */}
        <aside className='hidden w-80 flex-col border-r border-white/30 bg-white/80 p-6 shadow-xl backdrop-blur-md lg:flex'>
          <div className='space-y-6'>
            <div>
              <h1 className='mb-4 flex items-center gap-2 bg-black bg-clip-text text-2xl font-bold'>
                <Filter className='h-6 w-6' />
                Filter by
              </h1>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h2 className='flex items-center gap-2 font-semibold text-gray-700'>
                  <Clock className='h-4 w-4' />
                  Duration (max)
                </h2>
                <span className='rounded-full bg-black px-3 py-1 text-sm font-medium text-white'>
                  {Math.floor(durationValue[0] / 60)}h {durationValue[0] % 60}m
                </span>
              </div>
              <div className='px-2'>
                <input
                  type='range'
                  min='60'
                  max='600'
                  value={durationValue[0]}
                  onChange={(e) => setDurationValue([parseInt(e.target.value)])}
                  className='slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300'
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 p-6'>
          <div className='mx-auto max-w-7xl'>
            {/* Header */}
            <div className='mb-8'>
              <h1 className='mb-2 text-4xl font-bold'>Search result "{searchQuery || 'all resources'}"</h1>
              <p className='text-gray-600'>
                Found {filteredAndSortedData.length} learning materials matching your criteria
              </p>
            </div>

            {/* Controls */}
            <div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className='w-full sm:w-auto'>
                <TabsList className='grid w-full grid-cols-4 border border-white/30 bg-white/80 p-1 backdrop-blur-md sm:w-auto'>
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className='transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white'
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className='w-full border-white/30 bg-white/80 backdrop-blur-md sm:w-[200px]'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent className='bg-white/90 backdrop-blur-md'>
                  <SelectGroup>
                    <SelectItem value='relevant'>Most Relevant</SelectItem>
                    <SelectItem value='newest'>Newest First</SelectItem>
                    <SelectItem value='shortest'>Shortest Duration</SelectItem>
                    <SelectItem value='longest'>Longest Duration</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Learning Content Grid */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3'>
              {filteredAndSortedData.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedData.length === 0 && (
              <div className='py-16 text-center'>
                <div className='mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100'>
                  <Search className='h-10 w-10 text-gray-400' />
                </div>
                <h3 className='mb-2 text-xl font-semibold text-gray-700'>No learning materials found</h3>
                <p className='text-gray-500'>Try adjusting your search terms or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
