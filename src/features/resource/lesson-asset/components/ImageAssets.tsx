import { LessonAsset } from '@/features/resource/lesson-asset/types/lessonAsest.type'
import { PaginatedResult } from '@/types/baseModel'
import Image from 'next/image'

type ImageAssetsProps = {
  assets: PaginatedResult<LessonAsset>
}

export default function ImageAssets({ assets }: ImageAssetsProps) {
  if (!assets.items.length) {
    return <div className='text-sm text-gray-500'>No images uploaded yet</div>
  }

  return (
    <div className='grid grid-cols-2 gap-2'>
      {assets?.items.map((asset) => (
        <div
          key={asset.id}
          className='relative h-24 w-full cursor-pointer overflow-hidden rounded-md border hover:ring-2 hover:ring-purple-400'
        >
          <Image src={asset.assetUrl} alt={asset.name} fill className='object-contain' />
        </div>
      ))}
    </div>
  )
}
