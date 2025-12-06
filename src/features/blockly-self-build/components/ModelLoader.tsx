'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { UploadCloud, FileArchive, Loader } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'
import { useTranslations } from 'next-intl'

interface ModelLoaderProps {
  onLoadUrl: (url: string) => void
  onLoadZip: (file: File) => void
}

export default function ModelLoader({ onLoadUrl, onLoadZip }: ModelLoaderProps) {
  const t = useTranslations('agent.modelMaker.microbit')
  const tc = useTranslations('common')
  const [modelUrl, setModelUrl] = useState('')
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ✅ Chỉ chấp nhận file .zip
  const handleFileUpload = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.zip')) {
      alert('Please upload a valid model.zip file.')
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
      alert('Please provide a model URL or upload a model.zip file.')
      return
    }

    setIsLoading(true)
    try {
      if (modelUrl.trim()) {
        onLoadUrl(modelUrl.trim())
      } else if (modelFile) {
        onLoadZip(modelFile) // ✅ Gửi file gốc, không cần createObjectURL
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-lg rounded-2xl border border-gray-200 p-8 shadow-lg backdrop-blur'>
      <h2 className='mb-4 text-center text-lg font-semibold text-gray-800'>{t('title')}</h2>

      <div className='my-3 text-center text-sm text-gray-500'>
        {t('suggest')} <span className='font-semibold text-sky-600'>model.zip</span>
      </div>

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
            {t('drag')}
            <br />
            {t('click')}
          </p>
        ) : (
          <div className='flex items-center gap-2 text-sky-600'>
            <FileArchive className='h-5 w-5' />
            <span className='text-sm font-medium'>{modelFile.name}</span>
          </div>
        )}

        <input
          type='file'
          accept='.zip'
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className='hidden'
        />
      </div>

      {/* Ready button */}
      <div className='mt-6 text-center'>
        <Button onClick={handleReady} disabled={isLoading} className='px-6 py-2'>
          {isLoading ? <Loader /> : tc('button.ready')}
        </Button>
      </div>
    </div>
  )
}
