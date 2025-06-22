import ResourceCard from '@/components/shared/card/ResourceCard'
import Link from 'next/link'

interface GalleryGridProps {
  resources: any[]
}

export default function SearchGrid({ resources }: GalleryGridProps) {
  return (
    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'>
      {resources.map((resource) => (
        <Link href={`/resources/courses/${resource.id}`} key={resource.id}>
          <ResourceCard size='md' resource={resource} />
        </Link>
      ))}
    </div>
  )
}
