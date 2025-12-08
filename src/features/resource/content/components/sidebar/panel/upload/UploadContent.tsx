import { Button } from '@/components/shadcn/button'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SearchBar from '@/components/shared/search/SearchBar'
import STabs from '@/components/shared/STabs'
import {
  useDeleteListLessonAssetsMutation,
  usePostLessonAssetsMutation
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import DocumentAssets from '@/features/resource/lesson-asset/components/document/DocumentAssets'
import ImageAssets from '@/features/resource/lesson-asset/components/image/ImageAssets'
import VideoAssets from '@/features/resource/lesson-asset/components/video/VideoAssets'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { fileToBase64 } from '@/utils/index'
import { CloudUpload, Download, Trash2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { JSX, useRef } from 'react'
import { toast } from 'sonner'

export default function UploadContent() {
  const tt = useTranslations('toast')
  const tc = useTranslations('common')
  const tContent = useTranslations('content')
  const { lessonId } = useParams()
  const { openModal } = useModal()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dispatch = useAppDispatch()
  const [uploadFiles, { isLoading }] = usePostLessonAssetsMutation()

  const handleSelectFiles = () => {
    fileInputRef.current?.click()
  }
  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const files = Array.from(event.target.files)
    const lessonAssets = await Promise.all(
      files.map(async (file) => {
        const base64 = await fileToBase64(file)
        return {
          name: file.name,
          assetBytes: base64
        }
      })
    )
    await uploadFiles({
      lessonId: Number(lessonId),
      body: { lessonAssets }
    })
    toast.success(tt('successMessage.uploadFile'))
  }

  return (
    <div className='flex h-full flex-col space-y-2 px-2 pt-2'>
      {/* Header cố định */}
      <div className='flex-shrink-0 space-y-4'>
        <SearchBar />
        <input type='file' multiple ref={fileInputRef} className='hidden' onChange={handleUploadFiles} />
        <Button variant='outline' className='w-full' onClick={handleSelectFiles}>
          <CloudUpload /> {tc('button.uploadFile')}
        </Button>
      </div>

      <div className='flex-1 overflow-hidden'>
        <STabs
          customStyle={{ list: 'w-full' }}
          defaultValue='Images'
          className='h-full'
          items={[
            {
              label: tContent('image'),
              value: 'Images',
              content: <ImageAssets />
            },
            {
              label: tContent('video'),
              value: 'Videos',
              content: <VideoAssets />
            },
            {
              label: tContent('document'),
              value: 'Documents',
              content: <DocumentAssets />
            }
          ]}
        />
      </div>
    </div>
  )
}
