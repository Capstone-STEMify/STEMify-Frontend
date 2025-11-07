'use client'
import { useState } from 'react'
import { useSearchOrgDashboardQuery } from '../api/OrgDashboardApi'
import { WelcomeBanner } from './banner/HelloBanner'
import { StudentRetentionCard } from './card/RetentionCard'
import { ProgressStatisticsCard } from './card/StatisticCard'
import { TotalStudentsCard } from './card/TotalCard'
import { QuickStatsGrid } from './stat/StatsGrid'
import { ClassroomStatisticTable } from './table/ClassroomStatisticTable'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { ChevronDown } from 'lucide-react'
import { DashboardData } from '../types/dashboard.type'

type Period = 'Month' | 'Quarter' | 'Year'

export default function OrganizationDashboard() {
  const [period, setPeriod] = useState<Period>('Month')

  const {
    data: dashboardResponse,
    isLoading,
    error
  } = useSearchOrgDashboardQuery({
    organizationId: 1,
    period: period
  })

  if (isLoading) return <div className='p-8'>Loading...</div>
  if (error || !dashboardResponse || !dashboardResponse.data)
    return <div className='p-8'>Error loading dashboard data!</div>

  const dashboardData: DashboardData = dashboardResponse.data

  return (
    <div className='min-h-screen space-y-8 bg-gray-50 px-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Period Selector Dropdown */}
        <div className='mb-6 flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                {period}
                <ChevronDown className='ml-2 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPeriod('Month')}>Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPeriod('Quarter')}>Quarter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPeriod('Year')}>Year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* First Row */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <WelcomeBanner />
          </div>
          <div>
            <QuickStatsGrid data={dashboardData} />
          </div>
        </div>

        {/* Second Row */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Pass data to Cards */}
          <TotalStudentsCard data={dashboardData} />
          <StudentRetentionCard data={dashboardData} />
          <ProgressStatisticsCard data={dashboardData} />
        </div>

        {/* Third Row */}
        <div>
          <ClassroomStatisticTable data={dashboardData} />
        </div>
      </div>
    </div>
  )
}
