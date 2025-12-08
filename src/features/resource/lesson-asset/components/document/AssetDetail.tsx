'use client'

import { Badge } from '@/components/shadcn/badge'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import { useGetLessonAssetByIdQuery } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import { getFileIcon } from '@/features/resource/lesson-asset/components/document/DocumentAssets'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { formatDate } from '@/utils/index'
import { a } from '@react-spring/three'
import { ArrowLeft, Pencil } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'

export default function AssetDetail() {
  const locale = useLocale()
  const tc = useTranslations('common')
  const tContent = useTranslations('content')
  const { lessonId } = useParams()
  const assetId = useAppSelector((state) => state.tiptap.assetId)
  const dispatch = useAppDispatch()

  const { data, isLoading } = useGetLessonAssetByIdQuery(
    { lessonId: Number(lessonId), assetId: assetId! },
    { skip: !assetId }
  )

  const asset = data?.data

  if (isLoading) return <div className='p-4 text-sm font-semibold'>{tc('loading')}</div>
  if (!asset) return <div className='p-4 text-sm font-semibold'>{tc('noData')}</div>

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Detect loại file
  const format = asset.format?.toLowerCase()
  const type = asset.type

  const renderPreview = () => {
    if (type === 'image') {
      return (
        <Image
          src={asset.assetUrl}
          alt={asset.name}
          width={400}
          height={400}
          className='mx-auto rounded object-contain'
        />
      )
    }

    if (type === 'video') {
      return <video src={asset.assetUrl} controls className='mx-auto h-[200px] w-full rounded border bg-black' />
    }

    if (type === 'raw') {
      return (
        <div className='flex h-fit w-fit flex-col items-center justify-center rounded-2xl border p-12'>
          {getFileIcon(asset.format?.toLowerCase(), 30)}
          <p className='mt-3 text-xs font-medium'>{asset.name}</p>
          <p className='text-xs text-gray-500'>{formatSize(asset.size)}</p>
        </div>
      )
    }

    return (
      <div className='flex h-[200px] w-full flex-col items-center justify-center rounded border bg-gray-50'>
        {getFileIcon(asset.format?.toLowerCase(), 20)}
        <p className='mt-2 text-sm font-medium'>{asset.name}</p>
        <p className='text-xs text-gray-500'>
          {asset.format.toUpperCase()} • {formatSize(asset.size)}
        </p>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col'>
      {/* Header */}
      <div className='flex items-center gap-2 px-3 py-2'>
        <button className='rounded p-1 hover:bg-gray-200' onClick={() => dispatch(setActivePanel({ panel: 'upload' }))}>
          <ArrowLeft size={15} />
        </button>
        <div className='flex flex-1 items-center gap-2'>
          <h4 className='truncate text-sm font-medium'>{asset.name}</h4>
          <button className='hover:text-sky-custom-600 font-semibold'>
            <Pencil size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 space-y-4 overflow-auto py-3'>
        {/* Preview */}
        <div className='flex justify-center px-4'>{renderPreview()}</div>

        {/* Metadata */}
        <div className='space-y-2 px-4 text-sm'>
          <div className='flex justify-between'>
            <span className='font-semibold'>{tContent('format')}</span>
            <span className='text-gray-500 uppercase'>{asset.format}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>{tContent('size')}</span>
            <span className='text-gray-500'>{formatSize(asset.size)}</span>
          </div>
          {asset.width && asset.height && (
            <div className='flex justify-between'>
              <span className='font-semibold'>{tContent('resolution')}</span>
              <span className='text-gray-500'>
                {asset.width} × {asset.height}
              </span>
            </div>
          )}
          <div className='flex justify-between'>
            <span className='font-semibold'>{tContent('createAt')}</span>
            <span className='text-gray-500'>{formatDate(asset.createdAt, { locale })}</span>
          </div>

          {/* Tags */}
          <div>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>{tContent('tag')}</span>
            </div>
            <div className='mt-2 flex flex-wrap items-center gap-2'>
              {asset.tags.length === 0 && <span className='text-gray-500'>{tContent('noTag')}</span>}
              {asset.tags.map((tag: string, i: number) => (
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
