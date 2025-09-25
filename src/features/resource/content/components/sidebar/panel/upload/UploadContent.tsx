import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import STabs from '@/components/shared/STabs'
import {
  useDeleteListLessonAssetsMutation,
  usePostLessonAssetsMutation
} from '@/features/resource/lesson-asset/api/lessonAssetApi'
import DocumentAssets from '@/features/resource/lesson-asset/components/DocumentAssets'
import ImageAssets from '@/features/resource/lesson-asset/components/ImageAssets'
import VideoAssets from '@/features/resource/lesson-asset/components/VideoAssets'
import { clearSelection } from '@/features/resource/lesson-asset/slice/lessonAssetSelectionSliice'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { fileToBase64 } from '@/utils/index'
import { CloudUpload, Download, Trash2, X } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useRef } from 'react'
import { toast } from 'sonner'

export default function UploadContent() {
  const { lessonId } = useParams()
  const { openModal } = useModal()

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const selectedIds = useAppSelector((state) => state.lessonAssetSelection.selectedIds)
  const dispatch = useAppDispatch()
  const [uploadFiles, { isLoading }] = usePostLessonAssetsMutation()
  const [deleteFiles, { isLoading: deletingFiles }] = useDeleteListLessonAssetsMutation()

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
    toast.success('Uploaded files successfully')
  }

  const handleDeleteFiles = async (ids: number[]) => {
    if (ids.length === 0) return
    await deleteFiles({ lessonId: Number(lessonId), ids })
    toast.success('Deleted files successfully')
    dispatch(clearSelection())
  }

  if (isLoading || deletingFiles) {
    return <div>Processing...</div>
  }

  return (
    <div className='relative flex h-full flex-col space-y-4'>
      <SearchBar />
      <input type='file' multiple ref={fileInputRef} className='hidden' onChange={handleUploadFiles} />
      <Button variant={'outline'} className='w-full' onClick={handleSelectFiles}>
        <CloudUpload /> Upload files
      </Button>
      <STabs
        customStyle={{
          list: 'w-full'
        }}
        className='w-full'
        defaultValue='Images'
        items={[
          {
            label: 'Images',
            value: 'Images',
            content: <ImageAssets />
          },
          {
            label: 'Videos',
            value: 'Videos',
            content: <VideoAssets />
          },
          {
            label: 'Documents',
            value: 'Documents',
            content: <DocumentAssets />
          }
        ]}
      />
      {selectedIds.length > 0 && (
        <div
          className={`absolute right-0 bottom-0 left-0 transform border-t bg-white shadow-md transition-transform duration-300 ${
            selectedIds.length > 0 ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className='flex items-center justify-between px-4 py-3'>
            <span className='text-sm font-medium'>{selectedIds.length} selected</span>
            <div className='flex items-center gap-4'>
              <button className='rounded p-2 hover:bg-gray-100'>
                <Download size={18} />
              </button>
              <button
                className='rounded p-2 text-red-500 hover:bg-red-50'
                onClick={() =>
                  openModal('confirm', {
                    message: 'Are you sure you want to delete these files?',
                    onConfirm: () => handleDeleteFiles(selectedIds)
                  })
                }
              >
                <Trash2 size={18} />
              </button>
              <button onClick={() => dispatch(clearSelection())} className='rounded p-2 hover:bg-gray-100'>
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
