import { Button } from '@/components/shadcn/button'
import { Slider } from '@/components/shadcn/slider'
import SSelect from '@/components/shared/SSelect'
import SToolTip from '@/components/shared/SToolTip'
import { Filter, Clock, Backpack, RotateCcw } from 'lucide-react'

interface FilterSidebarProps {
  filterItems: {
    sortBy: string
    duration: number[]
    age: string
  }
  updateFilter: (key: keyof FilterSidebarProps['filterItems'], value: any) => void
  resetFilters: () => void
}

export default function FilterSidebar({ filterItems, updateFilter, resetFilters }: FilterSidebarProps) {
  return (
    <aside className='flex min-h-screen w-[270px] shrink-0 flex-col gap-6 border-r border-gray-200 bg-white px-4 py-6'>
      <div className='w-full space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-amber-custom-400 flex items-center gap-2 text-xl font-bold'>
            <Filter className='h-6 w-6' />
            Filter by
          </h1>

          <SToolTip content='Reset filter'>
            <Button variant='ghost' size='icon' onClick={resetFilters}>
              <RotateCcw className='h-4 w-4' />
            </Button>
          </SToolTip>
        </div>

        {/* duration */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <h2 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
              <Clock className='h-4 w-4' />
              Duration (max)
            </h2>
            <span className='bg-amber-custom-400 rounded-full px-2 py-1 text-xs text-white'>
              {Math.floor(filterItems.duration[0] / 60)}h {filterItems.duration[0] % 60}m
            </span>
          </div>

          <div className='px-6'>
            <Slider
              value={filterItems.duration}
              max={1200}
              step={60}
              onValueChange={(val) => updateFilter('duration', val)}
              trackClass='bg-gray-200'
              rangeClass='bg-[#ffba03]'
              thumbClass='bg-[#ffba03] border-[#ffba03] ring-[#ffba03]/50'
            />
          </div>
        </div>

        {/* Age */}
        <div className='space-y-4'>
          <h2 className='flex items-center gap-2 text-sm font-semibold text-gray-700'>
            <Backpack className='h-4 w-4' />
            Age Range
          </h2>
          <div className='px-6'>
            <SSelect
              placeholder='Select age range...'
              items={[
                { value: '4-7', content: '4-7 years old' },
                { value: '8-10', content: '8-10 years old' }
              ]}
              value={filterItems.age}
              onChange={(val) => updateFilter('age', val)}
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
