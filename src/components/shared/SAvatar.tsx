import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'

type SAvatarProps = {
  src: string
  fallback?: string
  className?: string
}
export default function SAvatar({ src, className, fallback = 'STEM' }: SAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback className='text-xs'>{fallback}</AvatarFallback>
    </Avatar>
  )
}
