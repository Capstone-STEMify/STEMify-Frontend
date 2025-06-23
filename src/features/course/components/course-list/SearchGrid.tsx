import { Badge } from '@/components/shadcn/badge'
import CardLayout from '@/components/shared/card/CardLayout'
import { formatDuration } from '@/utils/index'
import Link from 'next/link'

interface GalleryGridProps {
  resources: any[]
}

export default function SearchGrid({ resources }: GalleryGridProps) {
  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'>
      {resources.map((resource, index) => (
        <Link href={`/resources/courses/${resource.id}`} key={resource.id}>
          <CardLayout
            size='lg'
            key={index}
            imageSrc={resource.imageUrl}
            infor={<Badge>{resource.categoryNames}</Badge>}
          >
            <div className='flex min-h-0 flex-1 flex-col'>
              <h3 className='text-lg font-semibold'>{resource.title}</h3>
              <p className='text-sm text-gray-600'>{resource.description}</p>
              {/* footer */}
              <div className='mt-auto flex items-center gap-2'>
                <Badge className='bg-blue-100 text-blue-800'>{resource.ageRangeLabel}</Badge>
                <Badge className='bg-green-100 text-green-800'>{resource.duration}</Badge>
              </div>
            </div>
          </CardLayout>
        </Link>
      ))}
    </div>
  )
}
