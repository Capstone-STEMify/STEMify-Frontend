'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '@/components/shared/form/items'
import { SCard } from '@/components/shared/card/SCard'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ImageField({ previewUrlFromServer }: { previewUrlFromServer?: string }) {
  const t = useTranslations('courseManagement')

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
      setPreviewUrl(previewUrlFromServer ?? null)
    }
  }, [field.state.value, previewUrlFromServer])

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
          <h3 className='mb-3 text-xl font-semibold text-gray-800'>{t('image.label')}</h3>
          <div className='relative rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center'>
            {previewUrl ? (
              <Image
                width={256}
                height={256}
                src={previewUrl}
                alt='Preview'
                className='mx-auto mb-3 max-h-64 rounded-xl object-cover transition'
              />
            ) : (
              <Upload className='mx-auto mb-3 h-12 w-12 text-gray-400' />
            )}
            <p className='mb-1 text-gray-600'>{t('image.note')}</p>
            <p className='mb-4 text-sm text-gray-400'>{t('image.placeholder')}</p>
            <Button
              type='button'
              className='bg-amber-custom-400 rounded-full px-4 py-2'
              onClick={() => fileInputRef.current?.click()}
            >
              {t('image.btn')}
            </Button>
            <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
          </div>
        </>
      }
    />
  )
}
