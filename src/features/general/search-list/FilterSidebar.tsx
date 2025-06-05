import { Slider } from '@/components/shadcn/slider'
import { Filter, Clock } from 'lucide-react'

interface FilterSidebarProps {
  durationValue: number[]
  setDurationValue: (value: number[]) => void
}

export default function FilterSidebar({ durationValue, setDurationValue }: FilterSidebarProps) {
  return (
    <aside className='mr-32 flex w-full max-w-full flex-col gap-6'>
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
            <Slider defaultValue={[durationValue[0]]} max={600} step={60} onValueChange={setDurationValue} />
          </div>
        </div>
      </div>
    </aside>
  )
}
