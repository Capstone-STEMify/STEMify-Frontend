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
    <Tabs defaultValue={defaultValue} className={`${className} py-4`}>
      <TabsList className={`bg-light mb-4 grid w-full grid-cols-2 p-4 ${customStyle?.list}`}>
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
