import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import Image from 'next/image'
import { ReactNode } from 'react'

type TabItem = {
  value: string
  label: string
  content: ReactNode
  image: {
    src: string
    alt: string
  }
}

type ImageTabsSectionProps = {
  defaultValue: string
  items: TabItem[]
}

export function ImageTabsSection({ defaultValue, items }: ImageTabsSectionProps) {
  return (
    <Tabs defaultValue={defaultValue} className='w-full'>
      <TabsList className='flex space-x-8 border-b'>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className='text-lg font-medium'>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <div className='mt-5 flex flex-col gap-8 py-4 lg:flex-row'>
            <div className='max-w-xl space-y-4'>{item.content}</div>
            <Image
              src={item.image.src}
              alt={item.image.alt}
              width={500}
              height={200}
              className='w-full rounded-xl object-cover'
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
