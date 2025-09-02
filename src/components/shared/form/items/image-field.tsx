'use client'

import { useRef, useState, useEffect } from 'react'
import { Edit, Upload } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '@/components/shared/form/items'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ImageField({ previewUrlFromServer }: { previewUrlFromServer?: string }) {
  const t = useTranslations('course')
  const tc = useTranslations('common')

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
    <>
      <h3 className='mb-3 text-base font-semibold text-gray-800'>{t('form.fields.image.label')}</h3>
      <div className='mx-auto w-64'>
        <div className='relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-gray-300'>
          <div className='flex h-full flex-col items-center justify-center gap-4 p-4 text-center'>
            {previewUrl ? (
              <div className='relative flex h-full w-full items-center justify-center'>
                <Image src={previewUrl} alt='Preview' fill className='rounded-2xl object-cover transition' />
                <div className='absolute inset-0 rounded-2xl bg-black/30' />
                <Button
                  type='button'
                  className='absolute top-4 right-4 z-10 rounded-full border-gray-400 text-black backdrop-blur-md'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Edit />
                </Button>
              </div>
            ) : (
              <>
                <Upload className='h-12 w-12 text-gray-400' />
                <p className='text-sm text-gray-600'>{t('form.fields.image.note')}</p>
                <Button
                  type='button'
                  className='rounded-full border-gray-400 px-4 py-2'
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                >
                  {tc('button.browse')}
                </Button>
              </>
            )}
          </div>
          <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} className='hidden' />
        </div>
      </div>
    </>
  )
}
