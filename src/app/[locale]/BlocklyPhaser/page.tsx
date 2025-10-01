'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { javascriptGenerator } from 'blockly/javascript'
import BlocklyEditor from '@/features/blockly-phaser/blockly/BlocklyEditor'
import { pushAssistantMessage } from '@/features/modal3Display/Assistant3D'

const PhaserGame = dynamic(() => import('@/features/blockly-phaser/phaser/PhaserGame'), {
  ssr: false
})

const Assistant = dynamic(() => import('@/features/modal3Display/Assistant3D'), { ssr: false })

export default function HomePage() {
  const [workspace, setWorkspace] = useState(null)
  const [code, setCode] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      pushAssistantMessage('Nhớ lưu bài làm thường xuyên nhé!')
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  const handleRun = () => {
    if (!workspace) return
    const generatedCode = javascriptGenerator.workspaceToCode(workspace)
    setCode(generatedCode)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Học Lập Trình Qua Game</h1>

      <BlocklyEditor onWorkspaceReady={setWorkspace} />

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

      <button
        onClick={handleRun}
        style={{
          marginTop: 10,
          padding: '10px 20px',
          fontSize: 16,
          background: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer'
        }}
      >
        Chạy chương trình
      </button>

      <PhaserGame code={code} />
    </div>
  )
}
