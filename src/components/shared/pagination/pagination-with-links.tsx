'use client'

import { type ReactNode, useCallback } from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/shadcn/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/shadcn/utils'

export interface PaginationWithLinksProps {
  pageNumber: number
  pageSize: number
  totalCount: number
  pageSearchParam?: string
  pageSizeSelectOptions?: {
    pageSizeSearchParam?: string
    pageSizeOptions: number[]
  }
}

/**
 * Navigate with Nextjs links (need to update your own `pagination.tsx` to use Nextjs Link)
 *
 * @example
 * ```
 * <PaginationWithLinks
    page={1}
    pageSize={20}
    totalCount={500}
  />
 * ```
 */
export function PaginationWithLinks({
  pageSizeSelectOptions,
  pageSize,
  totalCount,
  pageNumber,
  pageSearchParam
}: PaginationWithLinksProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const totalPageCount = Math.ceil(totalCount / pageSize)

  const buildLink = useCallback(
    (newPage: number) => {
      const key = pageSearchParam || 'page'
      if (!searchParams) return `${pathname}?${key}=${newPage}`
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.set(key, String(newPage))
      return `${pathname}?${newSearchParams.toString()}`
    },
    [searchParams, pathname, pageSearchParam]
  )

  const navToPageSize = useCallback(
    (newPageSize: number) => {
      const key = pageSizeSelectOptions?.pageSizeSearchParam || 'pageSize'
      const newSearchParams = new URLSearchParams(searchParams || undefined)
      newSearchParams.set(key, String(newPageSize))
      router.push(`${pathname}?${newSearchParams.toString()}`)
    },
    [searchParams, pathname, pageSearchParam]
  )

  const renderPageNumbers = () => {
    const items: ReactNode[] = []
    const maxVisiblePages = 5

    if (totalPageCount <= maxVisiblePages) {
      for (let i = 1; i <= totalPageCount; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i)}
              isActive={pageNumber === i}
              aria-current={pageNumber === i ? 'page' : undefined}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href={buildLink(1)}
            isActive={pageNumber === 1}
            aria-current={pageNumber === 1 ? 'page' : undefined}
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      if (pageNumber > 3) {
        items.push(
          <PaginationItem key='ellipsis-start'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      const start = Math.max(2, pageNumber - 1)
      const end = Math.min(totalPageCount - 1, pageNumber + 1)

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={buildLink(i)}
              isActive={pageNumber === i}
              aria-current={pageNumber === i ? 'page' : undefined}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        )
      }

      if (pageNumber < totalPageCount - 2) {
        items.push(
          <PaginationItem key='ellipsis-end'>
            <PaginationEllipsis />
          </PaginationItem>
        )
      }

      items.push(
        <PaginationItem key={totalPageCount}>
          <PaginationLink
            href={buildLink(totalPageCount)}
            isActive={pageNumber === totalPageCount}
            aria-current={pageNumber === totalPageCount ? 'page' : undefined}
          >
            {totalPageCount}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  if (totalPageCount <= 1) return null

  return (
    <div className='flex w-full flex-col items-center gap-3 md:flex-row'>
      {pageSizeSelectOptions && (
        <div className='flex flex-1 flex-col gap-4'>
          <SelectRowsPerPage
            options={pageSizeSelectOptions.pageSizeOptions}
            setPageSize={navToPageSize}
            pageSize={pageSize}
          />
        </div>
      )}
      <Pagination className={cn({ 'md:justify-end': pageSizeSelectOptions })}>
        <PaginationContent className='max-sm:gap-0'>
          <PaginationItem>
            <PaginationPrevious
              href={buildLink(Math.max(pageNumber - 1, 1))}
              aria-disabled={pageNumber === 1}
              tabIndex={pageNumber === 1 ? -1 : undefined}
              className={pageNumber === 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          {renderPageNumbers()}
          <PaginationItem>
            <PaginationNext
              href={buildLink(Math.min(pageNumber + 1, totalPageCount))}
              aria-disabled={pageNumber === totalPageCount}
              tabIndex={pageNumber === totalPageCount ? -1 : undefined}
              className={pageNumber === totalPageCount ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

function SelectRowsPerPage({
  options,
  setPageSize,
  pageSize
}: {
  options: number[]
  setPageSize: (newSize: number) => void
  pageSize: number
}) {
  return (
    <div className='flex items-center gap-4'>
      <span className='text-sm whitespace-nowrap'>Rows per page</span>

      <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
        <SelectTrigger>
          <SelectValue placeholder='Select page size'>{String(pageSize)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
