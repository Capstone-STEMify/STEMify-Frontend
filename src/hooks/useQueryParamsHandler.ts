import useDebounce from '@/hooks/useDebounce'
import { useEffect, useState } from 'react'

export type DefaultQueryParams = {
  search?: string
  orderby?: string
  pageNumber?: number
  pageSize?: number
  status?: string
  [key: string]: any
}

type UseQueryParamsHandlerProps<T extends DefaultQueryParams> = {
  defaultParams?: Partial<T>
  debounceSearch?: boolean
  debounceDelay?: number
}

export function useQueryParamsHandler<T extends DefaultQueryParams>({
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

  // Kết hợp lại param debounced nếu cần
  const finalParams: T = {
    ...rawParams,
    ...(debounceSearch ? { search: debouncedSearch } : {})
  }

  const updateParams = (updates: Partial<T>) =>
    setRawParams((prev) => ({
      ...prev,
      ...updates,
      pageNumber: 1 // reset trang khi filter/sort thay đổi
    }))

  const goToPage = (pageNumber: number) =>
    setRawParams((prev) => ({ ...prev, pageNumber }))

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
