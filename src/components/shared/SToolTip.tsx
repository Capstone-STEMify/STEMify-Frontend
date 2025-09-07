import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip'
import React from 'react'

type SToolTipProps = {
  content: string
  children: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export default function SToolTip({ content, children, side }: SToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  )
}
