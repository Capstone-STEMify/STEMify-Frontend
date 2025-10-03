'use client'

import { Badge } from '@/components/shadcn/badge'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import { useGetLessonAssetByIdQuery } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { ArrowLeft, Download, Pencil, Trash2, Tag, Plus } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

export default function ImageAssetDetail() {
  const { lessonId } = useParams()
  const assetId = useAppSelector((state) => state.tiptap.assetId)
  const dispatch = useAppDispatch()

  const { data, isLoading } = useGetLessonAssetByIdQuery(
    { lessonId: Number(lessonId), assetId: assetId! },
    { skip: !assetId }
  )

  const imageAsset = data?.data

  if (isLoading) {
    return <div className='p-4 text-sm font-semibold'>Loading asset...</div>
  }

  if (!imageAsset) {
    return <div className='p-4 text-sm font-semibold'>No image selected</div>
  }

  // format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='flex items-center gap-2 px-3 py-2'>
        <button className='rounded p-1 hover:bg-gray-200' onClick={() => dispatch(setActivePanel({ panel: 'upload' }))}>
          <ArrowLeft size={15} />
        </button>
        <div className='flex flex-1 items-center gap-2'>
          <h4 className='truncate text-sm font-medium'>{imageAsset.name}</h4>
          <button className='hover:text-sky-custom-600 font-semibold'>
            <Pencil size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className='flex-1 space-y-4 overflow-auto py-3'>
        {/* Preview */}
        <div className='flex justify-center'>
          <div className='relative max-h-[400px] w-full'>
            <Image
              src={imageAsset.assetUrl}
              alt={imageAsset.name}
              width={400}
              height={400}
              className='rounded object-contain'
            />
          </div>
        </div>

        {/* Metadata */}
        <div className='space-y-2 px-4 text-sm'>
          <div className='flex justify-between'>
            <span className='font-semibold'>Format</span>
            <span className='text-gray-500 uppercase'>{imageAsset.format}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Size</span>
            <span className='text-gray-500'>{formatSize(imageAsset.size)}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Resolution</span>
            <span className='text-gray-500'>
              {imageAsset.width} × {imageAsset.height}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Created at</span>
            <span className='text-gray-500'>{new Date(imageAsset.createdAt).toLocaleString()}</span>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Tags</span>
            </div>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              {imageAsset.tags.length === 0 && <span className='text-gray-500'>No tags</span>}
              {imageAsset.tags.map((tag: string, i: number) => (
                <Badge key={i} variant={'outline'}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
