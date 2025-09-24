import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import STabs from '@/components/shared/STabs'
import { useGetListLessonAssetsQuery } from '@/features/resource/lesson-asset/api/lessonAssetApi'
import ImageAssets from '@/features/resource/lesson-asset/components/ImageAssets'
import { useAppSelector } from '@/hooks/redux-hooks'
import { CloudUpload } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

export default function UploadContent() {
  const { lessonId } = useParams()
  const queryParams = useAppSelector((state) => state.lessonAssetSlice)
  const { data, isLoading } = useGetListLessonAssetsQuery({ lessonId: Number(lessonId), params: queryParams })
  const lessonAsset = data?.data

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!lessonAsset) {
    return <div className='text-sm text-gray-500'>No assets uploaded yet</div>
  }

  return (
    <div className='space-y-4'>
      <SearchBar />
      <Button variant={'outline'} className='w-full'>
        <CloudUpload /> Upload files
      </Button>
      <STabs
        customStyle={{
          list: 'w-full'
        }}
        className='w-full'
        defaultValue='Images'
        items={[
          { label: 'Images', value: 'Images', content: <ImageAssets assets={lessonAsset} /> },
          { label: 'Videos', value: 'Videos', content: <div>Videos content</div> },
          { label: 'Documents', value: 'Documents', content: <div>Documents content</div> }
        ]}
      />
    </div>
  )
}
