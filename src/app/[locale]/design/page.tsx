import { Button } from '@/components/shadcn/button'
import SearchBar from '@/components/shared/search/SearchBar'
import { DesignSidebar } from '@/features/design/sidebar/DesignSidebar'

export default function DesignPage() {
  return (
    <div className=''>
      <DesignSidebar />
      <div className='flex justify-between'>
        <h1>My Design</h1>
        <div className='flex items-center gap-3'>
          <SearchBar />
          <Button className='bg-sky-custom-600 rounded-full'> + New</Button>
        </div>
      </div>
      <div></div>
    </div>
  )
}
