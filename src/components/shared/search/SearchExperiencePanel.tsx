import { Button } from '@/components/shadcn/button'
import { Clock } from 'lucide-react'
import SearchBar from '@/components/shared/search/SearchBar'
import { ScrollArea } from '@/components/shadcn/scroll-area'

const previousSearches = ['stemify', 'stemify courses', 'stemify activities', 'stemify lessons', 'stemify resources']
const quickActions = [
  { label: 'Learn STEM online' },
  { label: 'Access resource library' },
  { label: 'Need help' },
  { label: 'Try canvas' }
]
const templates = ['Mathematics', 'Science', 'Technology', 'Engineering', 'Physics', 'Chemistry', 'Biology']
const services = [
  { name: 'STEM', desc: 'Create video and social content...', action: 'Go to description' },
  { name: 'Course', desc: 'Ideate and create assets faster...', action: 'Learn more' },
  { name: 'Lesson', desc: 'Create images, audio and now video...', action: 'Learn more' },
  { name: 'Activity', desc: 'Create images, audio and now video...', action: 'Learn more' }
]

export default function SearchExperiencePanel() {
  return (
    <div className='px-4'>
      {/* Search input */}
      <div className='mb-4'>
        <SearchBar className='md:py-3' />
      </div>

      <ScrollArea className='max-h-96 space-y-10 overflow-y-auto pr-2'>
        {/* Services */}
        <div>
          <h4 className='text-sm font-medium text-gray-500'>Resources</h4>
          <div className='mt-2 space-y-2'>
            {services.map((s) => (
              <div key={s.name} className='items-center rounded-md px-2 py-1 hover:bg-gray-50'>
                <div className='font-medium text-gray-800'>{s.name}</div>
                <div className='text-sm text-gray-500'>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className='mt-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-sm font-medium text-gray-500'>Categories</h4>
            <Button variant='link' size='sm'>
              View more
            </Button>
          </div>
          <div className='flex gap-2 overflow-x-auto pb-1'>
            {templates.map((t) => (
              <Button
                variant='outline'
                key={t}
                className='w-fit cursor-pointer rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200'
              >
                {t}
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-6'>
          <div className='mb-2 flex items-center justify-between'>
            <h4 className='text-sm font-medium text-gray-500'>STEM quick actions</h4>
            <Button variant='link' size='sm'>
              View more
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
            {quickActions.map((q) => (
              <Button key={q.label} variant='outline' className='justify-start'>
                {q.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Previous Searches */}
        <div className='mt-6'>
          <h4 className='mb-2 text-sm font-medium text-gray-500'>Previous searches</h4>
          <ul className='space-y-1'>
            {previousSearches.map((term) => (
              <li key={term} className='flex items-center gap-2 text-sm text-gray-700 hover:underline'>
                <Clock className='h-4 w-4 text-gray-400' /> {term}
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </div>
  )
}
