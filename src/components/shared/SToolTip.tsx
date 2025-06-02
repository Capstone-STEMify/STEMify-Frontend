import { Button } from '@/components/shadcn/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip'
import React from 'react'

export interface SToolTipProps {
  content: string
  className?: string
  children: React.ReactNode
}

export default function SToolTip({ content, className, children }: SToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
