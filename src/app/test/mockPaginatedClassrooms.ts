type Item = { id: number; name: string }

/**
 * Tạo dữ liệu phân trang giả lập, có hỗ trợ search theo tên.
 */
export function mockPaginatedData(
  pageNumber: number,
  pageSize: number,
  search: string = ''
): {
  items: Item[]
  pageNumber: number
  pageSize: number
  totalCount: number
} {
  const totalItems = 47

  // Tạo danh sách 47 mục tên "Mục 1" đến "Mục 47"
  const allItems: Item[] = Array.from({ length: totalItems }, (_, i) => ({
    id: i + 1,
    name: `Mục ${i + 1}`
  }))

  // Lọc theo từ khoá tìm kiếm (không phân biệt hoa thường)
  const filtered = search ? allItems.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())) : allItems

  const totalCount = filtered.length
  const startIndex = (pageNumber - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedItems = filtered.slice(startIndex, endIndex)

  return {
    items: paginatedItems,
    pageNumber,
    pageSize,
    totalCount
  }
}
