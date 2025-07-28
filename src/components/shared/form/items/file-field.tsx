'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload, FileText, Video } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '@/components/shared/form/items'
import { SCard } from '@/components/shared/card/SCard'

type FileFieldProps = {
  previewUrlFromServer?: string
  accept?: string
  label?: string
}

export default function FileField({ previewUrlFromServer, accept = '*', label = 'File Upload' }: FileFieldProps) {
  const field = useFieldContext<File | null>()
  const [preview, setPreview] = useState<{ url: string | null; name: string; isImage: boolean }>({
    url: null,
    name: '',
    isImage: false
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastObjectUrl = useRef<string | null>(null)

  // Effect to handle preview logic
  useEffect(() => {
    // Clean up previous object URL
    const cleanup = () => {
      if (lastObjectUrl.current) {
        URL.revokeObjectURL(lastObjectUrl.current)
        lastObjectUrl.current = null
      }
    }

    const file = field.state.value
    if (file) {
      cleanup() // Revoke old URL before creating a new one
      const isImage = file.type.startsWith('image/')
      const objectUrl = isImage ? URL.createObjectURL(file) : null
      if (objectUrl) {
        lastObjectUrl.current = objectUrl
      }
      setPreview({ url: objectUrl, name: file.name, isImage })
    } else if (previewUrlFromServer) {
      // Handle existing file from server
      const isImageUrl = /\.(jpg|jpeg|png|gif)$/i.test(previewUrlFromServer)
      setPreview({ url: isImageUrl ? previewUrlFromServer : null, name: 'Existing file', isImage: isImageUrl })
    } else {
      // Reset state
      setPreview({ url: null, name: '', isImage: false })
    }

    return cleanup // Cleanup on unmount
  }, [field.state.value, previewUrlFromServer])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    field.handleChange(file)
  }

  const renderPreview = () => {
    if (preview.isImage && preview.url) {
      return <img src={preview.url} alt='Preview' className='mx-auto mb-3 max-h-64 rounded-xl object-cover' />
    }
    if (preview.name) {
      const isVideo = accept.startsWith('video/')
      const Icon = isVideo ? Video : FileText
      return (
        <div className='flex flex-col items-center justify-center text-gray-600'>
          <Icon className='mb-3 h-12 w-12' />
          <p className='max-w-full truncate text-sm font-medium'>{preview.name}</p>
        </div>
      )
    }
    return <Upload className='mx-auto mb-3 h-12 w-12 text-gray-400' />
  }

  return (
    <SCard
      content={
        <>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>{label}</h3>
          <div className='relative rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center'>
            {renderPreview()}
            <p className='my-2 text-gray-600'>Drag & drop or click to upload</p>
            <Button type='button' className='rounded-full px-4 py-2' onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <input type='file' accept={accept} ref={fileInputRef} onChange={handleFileChange} className='hidden' />
          </div>
        </>
      }
    />
  )
}
