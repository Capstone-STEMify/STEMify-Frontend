import useDebounce from '@/hooks/useDebounce'
import { useState } from 'react'

export type DefaultQueryParams1 = {
  search?: string
  orderby?: string
  pageNumber?: number
  pageSize?: number
  status?: string
  [key: string]: any
}

type UseQueryParamsHandlerProps<T extends DefaultQueryParams1> = {
  defaultParams?: Partial<T>
  debounceSearch?: boolean
  debounceDelay?: number
}

export function useQueryParamsHandler<T extends DefaultQueryParams1>({
  defaultParams,
  debounceSearch = true,
  debounceDelay = 500
}: UseQueryParamsHandlerProps<T>) {
  const [rawParams, setRawParams] = useState<T>({
    pageNumber: 1,
    pageSize: 10,
    orderby: 'createdDate',
    ...defaultParams
  } as T)

  // debounce search if enabled
  const debouncedSearch = useDebounce(rawParams.search || '', debounceDelay)

  // update rawParams when debouncedSearch changes
  const finalParams: T = {
    ...rawParams,
    ...(debounceSearch ? { search: debouncedSearch } : {})
  }

  const updateParams = (updates: Partial<T>) =>
    setRawParams((prev) => ({
      ...prev,
      ...updates,
      pageNumber: 1 // reset to first page on any update
    }))

  const goToPage = (pageNumber: number) => setRawParams((prev) => ({ ...prev, pageNumber }))

  const resetParams = () =>
    setRawParams({
      pageNumber: 1,
      pageSize: 10,
      orderby: 'createdDate',
      ...defaultParams
    } as T)

  return {
    params: finalParams,
    setRawParams,
    updateParams,
    goToPage,
    resetParams
  }
}
