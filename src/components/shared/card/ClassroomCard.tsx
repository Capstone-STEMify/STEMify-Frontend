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

export default function ClassroomCard({ classroom, size = 'md' }: Props) {
  const config = sizeConfig[size]
  const avatarList = classroom.avatar ?? []
  const shownAvatars = avatarList.slice(0, 3)
  const remaining = classroom.member - shownAvatars.length
  const showExtra = remaining > 0

  return (
    <div
      className={`hover:shadow-6 relative h-fit overflow-hidden rounded-2xl shadow transition-all duration-300 hover:scale-[1.03] ${config.cardWidth}`}
    >
      <div className={`relative overflow-hidden ${config.imageHeight}`}>
        <Image
          src={
            classroom.image ??
            'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_steam-starter-kit_01-1.jpg?width=1920&name=product_steam-starter-kit_01-1.jpg'
          }
          alt={'no image'}
          className='h-full w-full object-cover transition-transform duration-300'
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </div>

      <div className={`${config.padding}`}>
        <h3 className={`font-semibold ${config.nameSize} mb-1`}>{classroom.name}</h3>
        <p className={`${config.memberSize} text-gray-600`}>{classroom.member} members</p>
        {avatarList.length > 0 && (
          <div className='*:data-[slot=avatar]:ring-background mt-1 flex -space-x-2 *:data-[slot=avatar]:ring-2'>
            {shownAvatars.map((ava, index) => (
              <SAvatar className='h-7 w-7' src={ava} fallback='STEM' key={index} />
            ))}

            {showExtra && (
              <div
                key='more'
                className='z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-700'
                data-slot='avatar'
              >
                +{remaining}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
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
