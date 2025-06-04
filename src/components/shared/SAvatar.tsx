import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'

type SAvatarProps = {
  src: string
  className?: string
}
export default function SAvatar({ src, className }: SAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}
