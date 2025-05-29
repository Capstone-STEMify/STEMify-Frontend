export type BaseEntity = {
  id: string | number
  createdAt?: Date | string
  updatedAt?: Date | string
}

export type PaginatedResponse<T extends BaseEntity> = {
  data: T[]
  pageIndex: number
  pageSize: number
  count: number
}

export type SearchPaginatedResponse<T extends BaseEntity> = {
  results: T[]
  pageCount: number
  totalCount: number
}

export type SearchPaginatedRequestParams = {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
}

export type Entity<T> = {
  [K in keyof T]: T[K]
} & BaseEntity
