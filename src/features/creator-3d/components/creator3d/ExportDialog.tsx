'use client'

import { useState } from 'react'

/** Utility: convert File → Base64 (remove prefix) */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}

interface ExportDialogProps {
  onClose: () => void
  onExport: (data: {
    name: string
    description: string
    visibility: string
    definition_json: any
    thumbnail_image_base64?: string
    thumbnail_file_name?: string
  }) => void
}

export function ExportDialog({ onClose, onExport }: ExportDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [thumbnailBase64, setThumbnailBase64] = useState<string | undefined>()
  const [thumbnailFileName, setThumbnailFileName] = useState<string | undefined>()

  const definition_json = {} // placeholder — bạn có thể truyền dữ liệu thật từ exportAssembly

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await fileToBase64(file)
      setThumbnailBase64(base64)
      setThumbnailFileName(file.name)
    } catch (err) {
      console.error('❌ Error converting file:', err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return

    onExport({
      name: name.trim(),
      description: description.trim(),
      visibility,
      definition_json,
      thumbnail_image_base64: thumbnailBase64,
      thumbnail_file_name: thumbnailFileName
    })
  }

  return (
    <div className='bg-opacity-60 fixed inset-0 z-50 flex items-center justify-center bg-black'>
      <div className='mx-4 w-full max-w-lg rounded-2xl bg-white shadow-2xl'>
        <div className='border-b px-6 py-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Create Emulator</h2>
          <p className='text-sm text-gray-500'>Fill in details to export your 3D assembly as an emulator.</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-5 p-6'>
          {/* Name */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Name</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Octahedron Assembly Lab'
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Short intro...'
              rows={3}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
              required
            />
          </div>

          {/* Visibility */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
            >
              <option value='public'>Public</option>
              <option value='private'>Private</option>
            </select>
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>Thumbnail Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400'
            />

            {thumbnailBase64 && (
              <div className='mt-3'>
                <p className='text-xs text-gray-500'>{thumbnailFileName}</p>
                {/* Thêm prefix để preview */}
                <img
                  src={`data:image/*;base64,${thumbnailBase64}`}
                  alt='Preview'
                  className='mt-2 h-40 w-full rounded-md object-cover shadow'
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-2'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
