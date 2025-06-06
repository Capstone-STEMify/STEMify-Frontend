// base entity
export type BaseEntity = {
  id: string | number
}

export type Entity<T> = {
  [K in keyof T]: T[K]
} & BaseEntity

// Response
export type MetaData = {
  totalItems: number
  currentPage: number
  totalPages: number
  pageSize: number
}

export type PaginatedResult<T> = {
  data: T[]
  metaData: MetaData
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
export type SearchPaginatedRequestParams = {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}
