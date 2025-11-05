'use client'

import MicroAI from '@/features/blockly-self-build/components/MicroAI'
import ModelLoader from '@/features/blockly-self-build/components/ModelLoader'
import { useState } from 'react'

export default function MicroAiPage() {
  const [zipFile, setZipFile] = useState<File | undefined>()
  const [modelUrl, setModelUrl] = useState<string | undefined>()
  const [ready, setReady] = useState(false)

  return !ready ? (
    <ModelLoader
      onLoadZip={(f) => {
        setZipFile(f)
        setModelUrl(undefined)
        setReady(true)
      }}
      onLoadUrl={(u) => {
        setModelUrl(u)
        setZipFile(undefined)
        setReady(true)
      }}
    />
  ) : (
    <MicroAI zipFile={zipFile} modelUrl={modelUrl} />
  )
}
