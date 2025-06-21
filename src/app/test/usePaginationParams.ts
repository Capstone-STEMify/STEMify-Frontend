'use client'

import { useSearchParams } from 'next/navigation'

export function usePaginationParams(defaultPage = 1, defaultPageSize = 10) {
  const searchParams = useSearchParams()

  const page = parseInt(searchParams.get('pageNumber') ?? `${defaultPage}`, 10)
  const pageSize = parseInt(searchParams.get('pageSize') ?? `${defaultPageSize}`, 10)

  const search = searchParams.get('search') || ''
  const orderBy = searchParams.get('orderBy') || ''

  return {
    pageNumber: Number.isNaN(page) ? defaultPage : page,
    pageSize: Number.isNaN(pageSize) ? defaultPageSize : pageSize,
    search,
    orderBy
  }
}
