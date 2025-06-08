import { Search, ChevronLeft, ChevronRight, RotateCcw, Home } from 'lucide-react'

export default function MacCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className='h-auto w-full overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white shadow-2xl'>
      {/* Header - All elements in one row */}
      <div className='items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3 sm:gap-4'>
        {/* Traffic lights */}
        <nav className='flex items-center justify-between'>
          <section className='flex flex-shrink-0 gap-2'>
            <div className='group flex items-center justify-center gap-1'>
              <span className='inline-block h-2.5 w-2.5 rounded-full bg-red-500 transition-colors duration-200 group-hover:shadow-lg hover:bg-red-600'></span>
              <span className='inline-block h-2.5 w-2.5 rounded-full bg-yellow-500 transition-colors duration-200 group-hover:shadow-lg hover:bg-yellow-600'></span>
              <span className='inline-block h-2.5 w-2.5 rounded-full bg-green-500 transition-colors duration-200 group-hover:shadow-lg hover:bg-green-600'></span>
            </div>

            <button className='rounded-md p-1.5 transition-colors duration-200 hover:bg-gray-200 disabled:opacity-50'>
              <ChevronLeft size={14} className='text-gray-600' />
            </button>
            <button className='rounded-md p-1.5 transition-colors duration-200 hover:bg-gray-200'>
              <ChevronRight size={14} className='text-gray-600' />
            </button>
          </section>

          {/* Search bar - center */}
          <section className='mx-2 max-w-md flex-1 sm:mx-4'>
            <div className='relative'>
              <Search size={14} className='absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400' />
              <input
                readOnly
                type='text'
                className='w-full rounded-md border border-gray-200 bg-white py-1.5 pr-3 pl-9 text-sm transition-all duration-200 select-none focus:border-transparent focus:ring-1 focus:ring-blue-500 focus:outline-none'
                defaultValue='stemify.eduweb.workers.dev/'
              />
            </div>
          </section>

          {/* Navigation buttons */}
          <section className='flex flex-shrink-0 items-center gap-1'>
            <button className='hidden rounded-md p-1.5 transition-colors duration-200 hover:bg-gray-200 sm:block'>
              <RotateCcw size={14} className='text-gray-600' />
            </button>
            <button className='hidden rounded-md p-1.5 transition-colors duration-200 hover:bg-gray-200 sm:block'>
              <Home size={14} className='text-gray-600' />
            </button>
          </section>
        </nav>
      </div>
      {/* Card content */}
      <div className='h-fit bg-gradient-to-br from-blue-50 via-white to-blue-50'>{children}</div>
    </div>
  )
}
