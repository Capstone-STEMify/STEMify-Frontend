import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/shadcn/tooltip'
import React from 'react'

type SToolTipProps = {
  content: string
  children: React.ReactNode
}

export default function SToolTip({ content, children }: SToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
