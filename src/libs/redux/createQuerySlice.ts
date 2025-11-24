import { BaseOrderBy } from '@/types/baseModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SliceQueryParams {
  pageNumber: number
  pageSize: number
  search?: string
  orderBy?: BaseOrderBy
  status?: string
  [key: string]: any
  sortDirection?: 'Asc' | 'Desc'
}

export function createQuerySlice<T extends SliceQueryParams>(name: string, initialState: T) {
  return createSlice({
    name,
    initialState,
    reducers: {
      setPageIndex(state, action: PayloadAction<number>) {
        state.pageNumber = action.payload
      },
      setPageSize(state, action: PayloadAction<number>) {
        state.pageSize = action.payload
      },
      setSearchTerm(state, action: PayloadAction<string>) {
        const value = action.payload.trim()
        state.search = value
      },
      setParam(state, action: PayloadAction<{ key: keyof T; value: any }>) {
        const { key, value } = action.payload

        if (value === undefined || value === null) {
          delete (state as any)[key]
        } else {
          ;(state as any)[key] = value
        }

        state.pageNumber = 1
      },
      setMultipleParams(state, action: PayloadAction<Partial<T>>) {
        const draft = state as unknown as T
        Object.entries(action.payload).forEach(([key, value]) => {
          draft[key as keyof T] = value as T[keyof T]
        })
        state.pageNumber = 1
      },
      setSortDirection(state, action: PayloadAction<'Asc' | 'Desc'>) {
        state.sortDirection = action.payload
      },
      resetParams() {
        return initialState
      }
    }
  })
}
