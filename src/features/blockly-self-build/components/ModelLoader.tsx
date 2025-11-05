'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { UploadCloud, FileJson } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'

export default function ModelLoader({ onLoad }: { onLoad: (modelPath: string, type: 'url' | 'file') => void }) {
  const [modelUrl, setModelUrl] = useState('')
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [camera, setCamera] = useState('')
  const [audio, setAudio] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.json')) {
      alert('Please upload a valid model.json file.')
      return
    }
    setModelFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleReady = async () => {
    if (!modelUrl && !modelFile) {
      alert('Please provide a model URL or upload a model file.')
      return
    }
    setIsLoading(true)
    try {
      if (modelUrl) onLoad(modelUrl.trim(), 'url')
      else if (modelFile) {
        const objectUrl = URL.createObjectURL(modelFile)
        onLoad(objectUrl, 'file')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-lg rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-lg backdrop-blur'>
      <h2 className='mb-4 text-center text-lg font-semibold text-gray-800'>Paste your STEMify model link</h2>

      {/* Input URL */}
      <Input
        type='text'
        placeholder='https://stemify.com/models/[...]'
        value={modelUrl}
        onChange={(e) => setModelUrl(e.target.value)}
        className='mb-5 w-full text-sm'
      />

      <div className='my-3 text-center text-sm text-gray-500'>or upload your exported model.json</div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all',
          isDragging ? 'border-sky-400 bg-sky-50/80' : 'border-gray-300 hover:border-sky-300 hover:bg-sky-50/50'
        )}
      >
        <UploadCloud className='mb-3 h-8 w-8 text-gray-500' />
        {!modelFile ? (
          <p className='text-sm text-gray-600'>
            Drag & drop <span className='font-medium text-sky-600'>model.json</span> file here or click to browse
          </p>
        ) : (
          <div className='flex items-center gap-2 text-sky-600'>
            <FileJson className='h-5 w-5' />
            <span className='text-sm font-medium'>{modelFile.name}</span>
          </div>
        )}
        <input
          type='file'
          accept='.json'
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className='hidden'
        />
      </div>

      {/* Ready button */}
      <div className='mt-6 text-center'>
        <Button onClick={handleReady} disabled={isLoading} className='px-6 py-2'>
          {isLoading ? 'Loading...' : 'Ready!'}
        </Button>
      </div>
    </div>
  )
}
