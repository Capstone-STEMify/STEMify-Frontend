import { Button } from '@/components/shadcn/button'
import STabs from '@/components/shared/STabs'
import { CloudUpload } from 'lucide-react'
import React from 'react'

export default function UploadContent() {
  return (
    <div className='space-y-4'>
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
          { label: 'Images', value: 'Images', content: <div>Images content</div> },
          { label: 'Videos', value: 'Videos', content: <div>Videos content</div> },
          { label: 'Documents', value: 'Documents', content: <div>Documents content</div> }
        ]}
      />
    </div>
  )
}
