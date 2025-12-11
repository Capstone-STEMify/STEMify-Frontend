'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/shadcn/dialog'
import {
  useGetEmulatorByIdQuery,
  useCreateEmulatorMutation,
  useUpdateEmulatorMutation
} from '@/features/emulator/api/emulatorApi'
import { useModal } from '@/providers/ModalProvider'
import { fileToBase64 } from '@/utils/index'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useTranslations } from 'next-intl'

interface UpsertEmulatorProps {
  emulationId?: string
}

export function UpsertEmulator({ emulationId }: UpsertEmulatorProps) {
  const t = useTranslations('common')
  const t3d = useTranslations('workspace3D')

  const { closeModal } = useModal()
  const isUpdate = Boolean(emulationId)
  const userId = useAppSelector((state) => state.auth.user?.userId)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')
  const [thumbnailBase64, setThumbnailBase64] = useState<string | undefined>()
  const [thumbnailFileName, setThumbnailFileName] = useState<string | undefined>()
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string | undefined>()

  const { data, isLoading } = useGetEmulatorByIdQuery({ emulationId: emulationId || '' }, { skip: !emulationId })

  const [createEmulator, { isLoading: isCreating }] = useCreateEmulatorMutation()
  const [updateEmulator, { isLoading: isUpdating }] = useUpdateEmulatorMutation()

  // Prefill data khi edit
  useEffect(() => {
    if (!isUpdate || !data?.data) return
    const item = data.data
    console.log('Fetched emulator data for editing:', item)

    setName(item.name || '')
    setDescription(item.description || '')
    setVisibility(item.visibility)

    if (item.thumbnailUrl) {
      setExistingThumbnailUrl(item.thumbnailUrl)
    }
  }, [data, isUpdate])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const base64 = await fileToBase64(file)
      setThumbnailBase64(base64)
      setThumbnailFileName(file.name)
      setExistingThumbnailUrl(undefined)
    } catch (err) {
      console.error('Error converting file:', err)
    }
  }

  const handleRemoveThumbnail = () => {
    setThumbnailBase64(undefined)
    setThumbnailFileName(undefined)
    setExistingThumbnailUrl(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isUpdate && emulationId) {
        // Update existing emulator
        const updatePayload: any = {
          name,
          description,
          visibility,
          definition_json: ''
        }

        // Chỉ gửi thumbnail nếu có file mới
        if (thumbnailBase64 && thumbnailFileName) {
          updatePayload.thumbnail_image_base64 = thumbnailBase64
          updatePayload.thumbnail_file_name = thumbnailFileName
        }

        await updateEmulator({
          emulationId,
          body: updatePayload
        }).unwrap()
      } else {
        // Create new emulator
        await createEmulator({
          body: {
            name,
            description,
            visibility,
            definition_json: '',
            thumbnail_image_base64: thumbnailBase64,
            thumbnail_file_name: thumbnailFileName,
            userId: userId || ''
          }
        }).unwrap()
      }

      closeModal()
    } catch (error) {
      console.error('Error saving emulator:', error)
    }
  }

  const isSubmitting = isCreating || isUpdating

  // Hiển thị thumbnail: ưu tiên file mới upload, sau đó mới đến existing
  const displayThumbnail = thumbnailBase64 ? `data:image/*;base64,${thumbnailBase64}` : existingThumbnailUrl
  const hasThumbnail = Boolean(displayThumbnail)

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent className='p-0'>
        {/* Header */}
        <div className='w-3xl'>
          <div className='border-b px-6 py-4'>
            <DialogTitle className='text-lg font-semibold text-gray-900'>
              {isUpdate ? t3d('upsert.updateTitle') : t3d('upsert.createTitle')}
            </DialogTitle>
            <p className='mt-1 text-sm text-gray-500'>
              {isUpdate ? t3d('upsert.updateDescription') : t3d('upsert.createDescription')}
            </p>
          </div>

          {isLoading ? (
            <div className='flex items-center justify-center p-12'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent'></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='max-h-[calc(90vh-120px)] overflow-y-auto'>
              <div className='grid grid-cols-1 gap-6 p-6 lg:grid-cols-2'>
                {/* Left Column - Form Fields */}
                <div className='space-y-4'>
                  {/* Name */}
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>{t3d('upsert.nameLabel')}</label>
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t3d('upsert.namePlaceholder')}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none'
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                      {t3d('upsert.descriptionLabel')}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t3d('upsert.descriptionPlaceholder')}
                      rows={4}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none'
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Visibility */}
                  <div>
                    <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                      {t3d('upsert.visibilityLabel')}
                    </label>
                    <select
                      value={visibility}
                      onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none'
                      disabled={isSubmitting}
                    >
                      <option value='public'>{t3d('upsert.publicOption')}</option>
                      <option value='private'>{t3d('upsert.privateOption')}</option>
                    </select>
                  </div>
                </div>

                {/* Right Column - Thumbnail */}
                <div>
                  <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                    {t3d('upsert.thumbnailLabel')}
                  </label>

                  {hasThumbnail ? (
                    <div className='relative'>
                      <img
                        src={displayThumbnail}
                        alt='Preview'
                        className='h-64 w-full rounded-md object-cover shadow-sm'
                      />
                      <button
                        type='button'
                        onClick={handleRemoveThumbnail}
                        disabled={isSubmitting}
                        className='absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        <X className='h-4 w-4' />
                      </button>
                      {thumbnailFileName && <p className='mt-2 text-xs text-gray-500'>{thumbnailFileName}</p>}
                    </div>
                  ) : (
                    <div className='flex h-64 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50'>
                      <input
                        id='thumbnail-upload'
                        type='file'
                        accept='image/*'
                        onChange={handleFileChange}
                        className='hidden'
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor='thumbnail-upload'
                        className='flex cursor-pointer flex-col items-center justify-center space-y-2'
                      >
                        <svg className='h-12 w-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        <span className='text-sm text-gray-600'>{t3d('upsert.thumbnailPlaceholder')}</span>
                        <span className='text-xs text-gray-400'>PNG, JPG, GIF {t3d('upsert.thumbnailSize')}</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className='border-t bg-gray-50 px-6 py-4'>
                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={closeModal}
                    disabled={isSubmitting}
                    className='flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {t('button.cancel')}
                  </button>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    {isSubmitting ? (
                      <span className='flex items-center justify-center gap-2'>
                        <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
                        {isUpdate ? 'Updating...' : 'Creating...'}
                      </span>
                    ) : isUpdate ? (
                      <div>{t3d('upsert.updateButton')}</div>
                    ) : (
                      <div>{t3d('upsert.createButton')}</div>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
