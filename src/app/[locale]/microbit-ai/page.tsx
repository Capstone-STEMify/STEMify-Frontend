'use client'

import MicroAI from '@/features/blockly-self-build/components/MicroAI'
import ModelLoader from '@/features/blockly-self-build/components/ModelLoader'
import { useState } from 'react'

export default function MicroAiPage() {
  const [modelInfo, setModelInfo] = useState<{ path: string; type: 'url' | 'file' } | null>(null)

  const handleModelLoad = (path: string, type: 'url' | 'file') => {
    console.log('Model loaded:', path, type)
    setModelInfo({ path, type })
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
      {!modelInfo ? (
        <ModelLoader onLoad={handleModelLoad} />
      ) : (
        <div className='w-full'>
          <MicroAI modelPath={modelInfo.path} modelType={modelInfo.type} />
        </div>
      )}
    </main>
  )
}
