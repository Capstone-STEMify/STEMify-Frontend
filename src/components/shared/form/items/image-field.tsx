'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '@/components/shared/form/items'
import { SCard } from '@/components/shared/card/SCard'

export default function ImageField() {
  const field = useFieldContext<File | null>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastObjectUrl = useRef<string | null>(null)

  useEffect(() => {
    if (field.state.value) {
      const objectUrl = URL.createObjectURL(field.state.value)
      setPreviewUrl(objectUrl)
      if (lastObjectUrl.current) URL.revokeObjectURL(lastObjectUrl.current)
      lastObjectUrl.current = objectUrl

      return () => {
        if (lastObjectUrl.current) {
          URL.revokeObjectURL(lastObjectUrl.current)
          lastObjectUrl.current = null
        }
      }
    } else {
      setPreviewUrl(null)
    }
  }, [field.state.value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      field.handleChange(file)
    }
  }

  return (
    <SCard
      content={
        <>
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>Cover Image</h3>
          <div className='relative rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center'>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt='Preview'
                className='mx-auto mb-3 max-h-64 rounded-xl object-cover transition'
              />
            ) : (
              <Upload className='mx-auto mb-3 h-12 w-12 text-gray-400' />
            )}
            <p className='mb-1 text-gray-600'>Upload cover image</p>
            <p className='mb-4 text-sm text-gray-400'>Make the Lesson more engaging</p>
            <Button type='button' className='rounded-full px-4 py-2' onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
            <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
          </div>
        </>
      }
    />
  )
}
