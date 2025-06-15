import SAvatar from '@/components/shared/SAvatar'
import { Size } from '@/types/general'
import Image from 'next/image'

type ClassroomCardProps = {
  name: string
  image?: string | null
  member: number
  avatar?: string[]
}

type Props = {
  classroom: ClassroomCardProps
  size?: Size
}

const sizeConfig = {
  sm: {
    imageHeight: 'h-32',
    nameSize: 'text-base',
    memberSize: 'text-sm',
    padding: 'p-4',
    cardWidth: 'w-56'
  },
  md: {
    imageHeight: 'h-40',
    nameSize: 'text-lg',
    memberSize: 'text-sm',
    padding: 'p-5',
    cardWidth: 'w-64'
  },
  lg: {
    imageHeight: 'h-48',
    nameSize: 'text-xl',
    memberSize: 'text-base',
    padding: 'p-6',
    cardWidth: 'w-80'
  },
  xl: {
    imageHeight: 'h-56',
    nameSize: 'text-2xl',
    memberSize: 'text-base',
    padding: 'p-7',
    cardWidth: 'w-96'
  }
}

export default function ClassroomCard({ classroom, size = 'md' }: Props) {
  const config = sizeConfig[size]
  return (
    <div
      className={`relative h-fit overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${config.cardWidth}`}
    >
      <div className={`relative overflow-hidden ${config.imageHeight}`}>
        {classroom.image ? (
          <Image
            src={
              classroom.image ||
              'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_steam-starter-kit_01-1.jpg?width=1920&name=product_steam-starter-kit_01-1.jpg'
            }
            alt={classroom.name}
            className='h-full w-full object-cover transition-transform duration-300'
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-gray-200'>
            <span className='text-gray-500'>No Image</span>
          </div>
        )}
      </div>

      <div className={`${config.padding}`}>
        <h3 className={`font-semibold ${config.nameSize} mb-1`}>{classroom.name}</h3>
        <p className={`${config.memberSize} text-gray-600`}>{classroom.member} members</p>

        {classroom.avatar && (
          <div className='*:data-[slot=avatar]:ring-background mt-1 flex -space-x-2 *:data-[slot=avatar]:ring-2'>
            {classroom.avatar.map((ava, index) => (
              <SAvatar className='h-7 w-7' src={ava} fallback='STEM' key={index + 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
