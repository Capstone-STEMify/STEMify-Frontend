import { Button } from '@/components/shadcn/button'
import { useLazyExportToRSAQuery } from '@/features/resource/export/api/exportApi'
import { useEffect } from 'react'

type ExportRSAButtonProps = {
  courseId: number
  className?: string
}

export default function ExportRSAButton({ courseId, className = 'w-full' }: ExportRSAButtonProps) {
  const [triggerExport, { data: exportData, isLoading: isExporting }] = useLazyExportToRSAQuery()

  useEffect(() => {
    if (exportData) {
      // 1. Decode base64 thành binary
      const binary = atob(exportData.data.zipData) // atob chuyển base64 → string nhị phân
      const len = binary.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      // 2. Tạo blob
      const blob = new Blob([bytes], { type: 'application/zip' })

      // 3. Tạo URL download
      const url = URL.createObjectURL(blob)

      // 4. Tạo link ẩn và click
      const a = document.createElement('a')
      a.href = url
      a.download = exportData.data.filename || 'export.zip'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // 5. Giải phóng URL
      URL.revokeObjectURL(url)
    }
  }, [exportData])

  return (
    <Button
      disabled={isExporting}
      variant={'outline'}
      className={className}
      onClick={() => triggerExport({ courseId })}
    >
      {isExporting ? 'Exporting...' : 'Export to RSA'}
    </Button>
  )
}
