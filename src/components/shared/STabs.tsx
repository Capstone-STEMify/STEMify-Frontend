import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { cn } from '@/utils/shadcn/utils'
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
  layout?: 'stack' | 'side'
  listWidthClass?: string
  customStyle?: {
    list?: string
    trigger?: string
    content?: string
  }
  additionalContent?: Additional
}

export default function STabs({
  defaultValue,
  items,
  className,
  customStyle,
  additionalContent,
  layout = 'stack',
  listWidthClass = 'w-56'
}: STabsProps) {
  const { leftSide, rightSide } = additionalContent || {}
  const isSide = layout === 'side'
  return (
    <Tabs defaultValue={defaultValue} orientation={isSide ? 'horizontal' : 'vertical'} className={`${className}`}>
      {isSide ? (
        <>
          {/* Cột trái: trigger */}
          <TabsList className={cn('shrink-0 flex-col', listWidthClass, customStyle?.list)}>
            {items.map((item) => (
              <TabsTrigger key={item.value} value={item.value} className={customStyle?.trigger}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Cột phải: content (một content hiển thị tại một thời điểm) */}
          <div className='flex-1'>
            {items.map((item) => (
              <TabsContent key={item.value} value={item.value} className={cn('mt-0', customStyle?.content)}>
                {item.content}
              </TabsContent>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Header: trigger ở giữa, left/right phụ hai bên */}
          <div className='flex justify-between'>
            {leftSide && <div>{leftSide}</div>}
            <TabsList className={customStyle?.list}>
              {items.map((item) => (
                <TabsTrigger key={item.value} value={item.value} className={customStyle?.trigger}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {rightSide && <div>{rightSide}</div>}
          </div>

          {/* Content bên dưới */}
          {items.map((item) => (
            <TabsContent key={item.value} value={item.value} className={cn('mt-2', customStyle?.content)}>
              {item.content}
            </TabsContent>
          ))}
        </>
      )}
    </Tabs>
  )
}
