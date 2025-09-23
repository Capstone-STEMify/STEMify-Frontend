import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import STabs from '@/components/shared/STabs'
import UploadImageContent from '@/features/resource/content/components/sidebar/panel/upload/UploadImageContent'
import { CloudUpload } from 'lucide-react'
import React from 'react'

export default function UploadContent() {
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
          { label: 'Images', value: 'Images', content: <UploadImageContent /> },
          { label: 'Videos', value: 'Videos', content: <div>Videos content</div> },
          { label: 'Documents', value: 'Documents', content: <div>Documents content</div> }
        ]}
      />
    </div>
  )
}
