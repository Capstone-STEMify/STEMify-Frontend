import { Button } from '@/components/shadcn/button'
import Link from 'next/link'
import { ReactNode } from 'react'

type LinkButtonProps = {
  href: string
  children: ReactNode
  className?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export default function LinkButton({ children, className, href, variant }: LinkButtonProps) {
  return (
    <Button asChild variant={variant} className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
