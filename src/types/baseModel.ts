// base entity
export type BaseEntity = {
  id: string | number
}

export type Entity<T> = {
  [K in keyof T]: T[K]
} & BaseEntity

// Response
export type PaginatedResult<T> = {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  currentPageSize: number
  currentStartIndex: number
  currentEndIndex: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

export type ApiResponse = {
  message: string
  isSucceeded: boolean
  statusCode: number
}

export type ApiSuccessResponse<T> = { data: T } & ApiResponse

export type ApiErrorResponse = {
  errors?: string[]
} & ApiResponse

// Request params
export type BaseOrderBy =
  | 'createdDate'
  | 'title'
  | ''
  | 'orderindex'
  | 'price'
  | 'name'
  | 'upcoming'
  | 'inprogress'
  | 'endsoon'
export type SortDirection = 'Asc' | 'Desc'

export type SearchPaginatedRequestParams = {
  pageNumber?: number
  pageSize?: number
  search?: string
  orderBy?: string | BaseOrderBy
  status?: string
  sortDirection?: 'Asc' | 'Desc'
}
