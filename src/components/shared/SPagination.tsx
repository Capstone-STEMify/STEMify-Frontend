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

function getVisiblePageNumbers(pageNumber: number, totalPages: number): (number | 'ellipsis')[] {
  const pages: (number | 'ellipsis')[] = []

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    if (pageNumber <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (pageNumber >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', pageNumber - 1, pageNumber, pageNumber + 1, 'ellipsis', totalPages)
    }
  }

  return pages
}

type SPaginationProps = {
  pageNumber: number
  totalPages: number
  onPageChanged: (page: number) => void
  className?: string
}

export function SPagination({ pageNumber, totalPages, onPageChanged, className }: SPaginationProps) {
  const pageNumbers = getVisiblePageNumbers(pageNumber, totalPages)

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault()
              if (pageNumber > 1) onPageChanged(pageNumber - 1)
            }}
            aria-disabled={pageNumber === 1}
            className={pageNumber === 1 ? 'pointer-events-none opacity-50' : ''}
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
                isActive={page === pageNumber}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChanged(page)
                }}
                aria-current={page === pageNumber ? 'page' : undefined}
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
              if (pageNumber < totalPages) onPageChanged(pageNumber + 1)
            }}
            aria-disabled={pageNumber === totalPages}
            className={pageNumber === totalPages ? 'pointer-events-none opacity-50' : ''}
            href={''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
