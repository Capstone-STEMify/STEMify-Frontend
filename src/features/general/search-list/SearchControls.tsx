import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'

interface SearchControlsProps {
  sortBy: string
  setSortBy: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  categories: string[]
}

export default function SearchControls({
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  categories
}: SearchControlsProps) {
  return (
    <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className='w-full sm:w-auto'>
        <TabsList className='grid grid-cols-2 gap-2 border border-white/30 bg-white/80 p-1 backdrop-blur-md sm:grid-cols-4'>
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className='px-2 py-1 text-sm transition-all duration-200 data-[state=active]:bg-black data-[state=active]:text-white sm:px-3 sm:py-2'
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
  )
}
