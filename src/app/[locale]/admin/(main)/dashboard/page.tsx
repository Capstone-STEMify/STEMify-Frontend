import { ChartAreaInteractive } from 'components/shadcn/chart-area-interactive'
import { SectionCards } from 'components/shadcn/section-cards'

import data from './data.json'
import { DataTable } from '@/components/shadcn/data-table'

export default function Page() {
  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <SectionCards />
      <div className='px-4 lg:px-6'>
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  )
}
