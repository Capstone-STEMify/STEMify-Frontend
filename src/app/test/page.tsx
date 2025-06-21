'use client'

import { PaginationWithLinks } from '@/components/shared/pagination/pagination-with-links'
import { mockPaginatedData } from 'app/test/mockPaginatedClassrooms'
import { usePaginationParams } from 'app/test/usePaginationParams'

export default function PaginationTestPage() {
  const { pageNumber, pageSize, search, orderBy } = usePaginationParams()

  // Giả lập API mock hỗ trợ search
  const { items, totalCount } = mockPaginatedData(pageNumber, pageSize, search)

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Danh sách mục</h1>

      <ul className='list-disc pl-5'>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <PaginationWithLinks
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        pageSearchParam='pageNumber'
        pageSizeSelectOptions={{
          pageSizeOptions: [5, 10, 20, 50],
          pageSizeSearchParam: 'pageSize'
        }}
      />
    </div>
  )
}
