import { WelcomeBanner } from './banner/HelloBanner'
import { StudentRetentionCard } from './card/RetentionCard'
import { ProgressStatisticsCard } from './card/StatisticCard'
import { TotalStudentsCard } from './card/TotalCard'
import { QuickStatsGrid } from './stat/StatsGrid'
import { StudentListTable } from './table/StudentTable'

export default function OrganizationDashboard() {
  return (
    <div className='min-h-screen bg-gray-50 px-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <WelcomeBanner />
          </div>
          <div>
            <QuickStatsGrid />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <TotalStudentsCard />
          <StudentRetentionCard />
          <ProgressStatisticsCard />
        </div>

        <div>
          <StudentListTable />
        </div>
      </div>
    </div>
  )
}
