import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

type ModernPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export default function ModernPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = ''
}: ModernPaginationProps) {
  const getVisiblePages = () => {
    const pages = []
    const showEllipsis = totalPages > 7

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
          currentPage === 1
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
        } `}
      >
        <ChevronLeft />
        Previous
      </button>

      {/* Page Numbers */}
      <div className='flex items-center space-x-1'>
        {visiblePages.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <div key={`ellipsis-${index}`} className='px-3 py-2'>
                <MoreHorizontal className='h-4 w-4 text-gray-400' />
              </div>
            )
          }

          return (
            <button
              key={page}
              onClick={() => {
                if (typeof page === 'number') {
                  onPageChange(page)
                }
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
                page === currentPage
                  ? 'scale-105 transform bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
              } `}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
          currentPage === totalPages
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm'
        } `}
      >
        Next
        <ChevronRight className='ml-1 h-4 w-4' />
      </button>
    </div>
  )
}
