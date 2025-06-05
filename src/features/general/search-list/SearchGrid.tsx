import ResourceCard from '@/components/shared/card/CourseCard'

interface GalleryGridProps {
  resources: any[]
}

export default function SearchGrid({ resources }: GalleryGridProps) {
  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} />
      ))}
    </div>
  )
}
