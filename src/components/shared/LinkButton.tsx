import { Button } from '@/components/shadcn/button'
import Link from 'next/link'
import { ReactNode } from 'react'

export interface LinkButtonProps {
  href: string
  children: ReactNode
  className?: string
}

export default function LinkButton({ children, className, href }: LinkButtonProps) {
  return (
    <Button asChild className={className}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
