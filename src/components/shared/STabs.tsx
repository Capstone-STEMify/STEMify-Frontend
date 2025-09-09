import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/shadcn/tabs'
import { ReactNode } from 'react'

type TabsItem = {
  value: string
  label: string
  content: ReactNode
}

type STabsProps = {
  defaultValue: string
  items: TabsItem[]
  className?: string
  customStyle?: {
    list?: string
    trigger?: string
  }
}

export default function STabs({ defaultValue, items, className, customStyle }: STabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={`${className}`}>
      <TabsList className={`w-full ${customStyle?.list}`}>
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value} className={`${customStyle?.trigger}`}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {items.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {item.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
