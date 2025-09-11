import { useRef, useState, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useFieldContext } from '.'

type MultiImageFieldProps = {
  label?: string
  previewUrlsFromServer?: string[]
  onDeleteServerImage?: (url: string, index: number) => void
}

export default function MultiImageField({
  label,
  previewUrlsFromServer = [],
  onDeleteServerImage
}: MultiImageFieldProps) {
  const field = useFieldContext<File[]>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [serverUrls, setServerUrls] = useState<string[]>(previewUrlsFromServer)
  const [localUrls, setLocalUrls] = useState<string[]>([])

  useEffect(() => {
    const files = field.state.value ?? []
    const objectUrls = files.map((file) => URL.createObjectURL(file))
    setLocalUrls(objectUrls)

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [field.state.value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.length) {
      const newFiles = Array.from(files)
      field.handleChange([...(field.state.value ?? []), ...newFiles])
    }
  }

  const handleRemove = (index: number) => {
    const serverCount = serverUrls.length
    const files = field.state.value ?? []

    if (index < serverCount) {
      const urlToDelete = serverUrls[index]

      // UI update ngay lập tức
      setServerUrls((prev) => prev.filter((_, i) => i !== index))

      // update form state
      const currentPictures = Array.isArray(field.form.state.values.branchPicture)
        ? field.form.state.values.branchPicture
        : typeof field.form.state.values.branchPicture === 'string'
          ? JSON.parse(field.form.state.values.branchPicture)
          : []

      field.form.setFieldValue(
        'branchPicture',
        currentPictures.filter((u: string) => u !== urlToDelete)
      )

      // gọi API
      onDeleteServerImage?.(urlToDelete, index)
    } else {
      const newFiles = [...files]
      newFiles.splice(index - serverCount, 1)
      field.handleChange(newFiles)
    }
  }

  const previewUrls = [...serverUrls, ...localUrls]

  return (
    <>
      <h3 className='mb-3 text-base font-semibold text-gray-800'>{label}</h3>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        {previewUrls.map((url, index) => (
          <div
            key={index}
            className='relative aspect-square overflow-hidden rounded-2xl border-2 border-dashed border-gray-300'
          >
            <img src={url} alt={`Preview ${index}`} className='h-full w-full rounded-2xl object-cover' />
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

        <div
          className='flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 hover:bg-gray-50'
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className='h-8 w-8 text-gray-400' />
          <p className='text-xs text-gray-600'>Upload</p>
        </div>
      </div>

      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileChange} multiple className='hidden' />
    </>
  )
}
