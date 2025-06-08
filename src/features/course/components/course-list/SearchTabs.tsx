import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'

type STabsProps = {
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  categories: string[]
}

export default function SearchTabs({ selectedCategory, setSelectedCategory, categories }: STabsProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className='w-full sm:w-auto'>
      <TabsList className='gap-2 bg-white/80 p-1 backdrop-blur-md sm:grid-cols-4'>
        {categories.map((cat) => (
          <TabsTrigger
            key={cat}
            value={cat}
            className='data-[state=active]:bg-amber-custom-400 px-2 py-1 text-sm transition-all duration-200 data-[state=active]:text-white sm:px-3 sm:py-2'
          >
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
