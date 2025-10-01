'use client'

import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Assistant3D, { pushAssistantMessage } from '@/features/modal3Display/Assistant3D'

// Canvas/R3F chỉ chạy client → dynamic nếu bạn muốn tách bundle:
const Assistant = dynamic(() => import('@/features/modal3Display/Assistant3D'), { ssr: false })

export default function CodePage() {
  // Ví dụ đẩy message sau khi user mở trang 2s
  useEffect(() => {
    const t = setTimeout(() => {
      pushAssistantMessage('Nhớ lưu bài làm thường xuyên nhé!')
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: 24 }}>
      <h1 className='text-2xl font-semibold'>Code Playground</h1>
      {/* ... editor / UI của bạn ... */}

      <Assistant
        messages={{
          '/code': [
            'Chào mừng tới khu vực lập trình!',
            'Kéo các khối lệnh vào vùng ghép ở bên trái.',
            'Nhấn “Run” để chạy thử. Nếu lỗi, mở tab “Console” để xem gợi ý.'
          ]
        }}
        enabled
      />
    </div>
  )
}
