import * as React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/shadcn/pagination'

function getVisiblePageNumbers(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages)
    }
  }

  return pages
}

type UPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChanged: (page: number) => void
  className?: string
}

export function SPagination({ currentPage, totalPages, onPageChanged, className }: UPaginationProps) {
  const pageNumbers = getVisiblePageNumbers(currentPage, totalPages)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChanged(currentPage - 1)
            }}
            aria-disabled={currentPage === 1}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            href={''}
          />
        </PaginationItem>
        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href='#'
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChanged(page)
                }}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChanged(currentPage + 1)
            }}
            aria-disabled={currentPage === totalPages}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            href={''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
