'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { getInitials } from '@/utils/index'
import { cn } from '@/utils/shadcn/utils'

type UserAvatarProps = {
  fullName?: string
  size?: number
  className?: string
}

export default function UserAvatar({ fullName, size = 80, className }: UserAvatarProps) {
  const initials = getInitials(fullName)
  const dicebearUrl = fullName
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`
    : undefined

  return (
    <Avatar className={cn('border-2 border-slate-100 shadow-sm', className)} style={{ width: size, height: size }}>
      {dicebearUrl && <AvatarImage src={dicebearUrl} alt={fullName} />}
      <AvatarFallback className='bg-primary/10 text-primary font-bold'>{initials}</AvatarFallback>
    </Avatar>
  )
}
