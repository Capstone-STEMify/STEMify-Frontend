import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { ReactNode } from 'react'

type TabsItem = {
  value: string
  label: ReactNode
  content: ReactNode
}

type Additional = {
  leftSide?: ReactNode
  rightSide?: ReactNode
}

type STabsProps = {
  defaultValue: string
  items: TabsItem[]
  className?: string
  customStyle?: {
    list?: string
    trigger?: string
  }
  additionalContent?: Additional
}

export default function STabs({ defaultValue, items, className, customStyle, additionalContent }: STabsProps) {
  const { leftSide, rightSide } = additionalContent || {}
  return (
    <Tabs defaultValue={defaultValue} className={`${className}`}>
      <div className='flex justify-between'>
        {leftSide && <div>{leftSide}</div>}
        <TabsList className={` ${customStyle?.list}`}>
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} className={`${customStyle?.trigger}`}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {rightSide && <div>{rightSide}</div>}
      </div>
      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
