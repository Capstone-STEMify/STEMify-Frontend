'use client'
import SearchBasic, { FilterParams } from '@/components/shared/search/SearchBasic'

export default function AlertDialogDemo() {
  const onSearchSubmit = (params: string) => {
    console.log('Search submitted with:', params)
  }

  const onFilterChange = (value: string) => {
    console.log('Filter changed to:', value)
  }

  const filter: FilterParams = FilterParams.ALL

  return <SearchBasic filter={filter} onFilterChange={onFilterChange} onSearchSubmit={onSearchSubmit} />
}
