import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import SAvatar from '@/components/shared/SAvatar'
import { Size } from '@/types/general'
import Image from 'next/image'

type ClassroomCardProps = {
  name: string
  image: string
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
        <Image
          src={classroom.image}
          alt={classroom.name}
          className='h-full w-full object-cover transition-transform duration-300'
          fill
        />
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
