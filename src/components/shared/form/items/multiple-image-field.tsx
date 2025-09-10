import { useRef, useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '@/components/shared/form/items'

type MultiImageFieldProps = {
  previewUrlsFromServer?: string[]
  onDeleteServerImage?: (url: string, index: number) => void
}
export default function MultiImageField({
  previewUrlsFromServer = [],
  onDeleteServerImage,
  label = 'Pictures'
}: MultiImageFieldProps & { label?: string }) {
  const field = useFieldContext<File[]>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localPreviews, setLocalPreviews] = useState<string[]>([])

  useEffect(() => {
    const files = Array.isArray(field.state.value) ? field.state.value : []
    const urls = files.map((file) => URL.createObjectURL(file))
    setLocalPreviews(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [field.state.value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      field.handleChange([...(field.state.value ?? []), ...newFiles])
    }
  }

  const handleRemove = (index: number) => {
    const serverCount = previewUrlsFromServer.length
    const files = field.state.value ?? []

    if (index < serverCount) {
      const urlToDelete = previewUrlsFromServer[index]
      onDeleteServerImage?.(urlToDelete, index)
    } else {
      const newFiles = [...files]
      newFiles.splice(index - serverCount, 1)
      field.handleChange(newFiles)
    }
  }

  const allPreviews = [...previewUrlsFromServer, ...localPreviews]

  return (
    <>
      <h3 className='mb-3 text-base font-semibold text-gray-800'>{label}</h3>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        {allPreviews.map((url, index) => (
          <div
            key={index}
            className='relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-gray-300'
          >
            <img src={url} alt={`Preview ${index + 1}`} className='h-full w-full rounded-2xl object-cover' />
            <div className='absolute inset-0 bg-black/30' />
            <Button
              type='button'
              className='absolute top-2 right-2 z-10 rounded-full border-gray-400 text-black backdrop-blur-md'
              variant='outline'
              onClick={() => handleRemove(index)}
            >
              <X />
            </Button>
          </div>
        ))}

        {/* Nút thêm ảnh */}
        {allPreviews.length < 5 && ( // limit 5 ảnh
          <div
            className='flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 hover:bg-gray-50'
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className='h-8 w-8 text-gray-400' />
            <p className='text-xs text-gray-600'>Upload</p>
          </div>
        )}
      </div>

      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} multiple className='hidden' />
    </>
  )
}
