import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SliceQueryParams {
  pageNumber: number
  pageSize: number
  search: string
  orderBy?: string
  status?: string
  [key: string]: any
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
        state.search = action.payload
        state.pageNumber = 1
      },
      setParam(state, action: PayloadAction<{ key: keyof T; value: any }>) {
        const { key, value } = action.payload
        const draft = state as unknown as T
        draft[key] = value
        state.pageNumber = 1
      },
      setMultipleParams(state, action: PayloadAction<Partial<T>>) {
        const draft = state as unknown as T
        Object.entries(action.payload).forEach(([key, value]) => {
          draft[key as keyof T] = value as T[keyof T]
        })
        state.pageNumber = 1
      },
      resetParams() {
        return initialState
      }
    }
  })
}
