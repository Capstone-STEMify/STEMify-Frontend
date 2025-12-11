'use client'

import React, { useState, useMemo } from 'react'
import { DataTable } from '@/components/shared/data-table/data-table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/shadcn/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Badge } from '@/components/shadcn/badge'
import { Users, Building2, BookOpen, DollarSign, TrendingUp, TrendingDown, Book } from 'lucide-react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useTranslations } from 'next-intl'
import { useGetSystemDashboardQuery } from '../api/AdminDashboardApi'
import { TopOrganizationTableItem, useTopOrgColumns } from './tableColumn/TopOrgColumns'
import { TopCourseTableItem, useTopCourseColumns } from './tableColumn/TopCourseColumns'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function SystemDashboardPage() {
  const t = useTranslations('dashboard.admin')
  const [period, setPeriod] = useState<'Month' | 'Quarter' | 'Year'>('Month')
  const { data: response, isLoading } = useGetSystemDashboardQuery({ period })
  
  const orgColumns = useTopOrgColumns()
  const courseColumns = useTopCourseColumns()

  const tableDataOrgs: TopOrganizationTableItem[] = useMemo(() => {
    if (!response?.data?.topOrganizations) return []
    return response.data.topOrganizations.map((org) => ({
      ...org,
      id: org.organizationId
    }))
  }, [response])

  const tableDataCourses: TopCourseTableItem[] = useMemo(() => {
    if (!response?.data?.topCourses) return []
    return response.data.topCourses.map((course) => ({
      ...course,
      id: course.courseId
    }))
  }, [response])

  if (isLoading)
    return (
      <div className='flex h-screen items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  if (!response?.data) return <div>{t('charts.noData')}</div>

  const { summary, subscriptions, periodComparison } = response.data

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

  const GrowthIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0
    return (
      <Badge
        variant={isPositive ? 'default' : 'destructive'}
        className={`ml-2 border-none ${isPositive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
      >
        {isPositive ? <TrendingUp className='mr-1 h-3 w-3' /> : <TrendingDown className='mr-1 h-3 w-3' />}
        {Math.abs(value)}%
      </Badge>
    )
  }

  const revenueChartData = {
    labels: subscriptions.byPlan.map((p) => p.planName),
    datasets: [
      {
        label: t('stats.revenue'),
        data: subscriptions.byPlan.map((p) => p.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(139, 92, 246, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <div className='min-h-screen space-y-6 bg-slate-50/50 p-6'>
      {/* Header & Filter */}
      <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>{t('title')}</h1>
          <p className='mt-1 text-muted-foreground'>{t('subtitle')}</p>
        </div>
        <div className='w-[120px]'>
          <Select value={period} onValueChange={(val: any) => setPeriod(val)}>
            <SelectTrigger className='bg-white'>
              <SelectValue placeholder={t('period.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Month'>{t('period.month')}</SelectItem>
              <SelectItem value='Quarter'>{t('period.quarter')}</SelectItem>
              <SelectItem value='Year'>{t('period.year')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='shadow-sm transition-shadow hover:shadow-md py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('stats.revenue')}</CardTitle>
            <DollarSign className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(subscriptions.totalRevenue)}</div>
            <p className='mt-1 flex items-center text-xs text-muted-foreground'>
              {t('stats.compare')}: <GrowthIndicator value={periodComparison.revenueGrowth} />
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-sm transition-shadow hover:shadow-md py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('stats.activeOrg')}</CardTitle>
            <Building2 className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {summary.activeOrganizations} / {summary.totalOrganizations}
            </div>
            <p className='mt-1 flex items-center text-xs text-muted-foreground'>
              {t('stats.growth')}: <GrowthIndicator value={periodComparison.organizationGrowth} />
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-sm transition-shadow hover:shadow-md py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('stats.totalStudent')}</CardTitle>
            <Users className='h-4 w-4 text-orange-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.totalStudents}</div>
            <p className='mt-1 flex items-center text-xs text-muted-foreground'>
               {t('stats.growth')}: <GrowthIndicator value={periodComparison.studentGrowth} />
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-sm transition-shadow hover:shadow-md py-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('stats.enrollment')}</CardTitle>
            <BookOpen className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.totalEnrollments}</div>
            <p className='mt-1 flex items-center text-xs text-muted-foreground'>
              {t('stats.completionRate')}:{' '}
              <span className='ml-1 font-semibold text-gray-700'>
                {response.data.enrollments.completionRate}%
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-6'>
        <Card className='col-span-3 shadow-sm py-4'>
          <CardHeader>
            <CardTitle>{t('charts.revenueByPlan')}</CardTitle>
            <CardDescription>{t('charts.revenueDesc')}</CardDescription>
          </CardHeader>
          <CardContent className='flex h-[300px] items-center justify-center'>
            {subscriptions.byPlan.length > 0 ? (
              <div className='h-[250px] w-[250px]'>
                <Doughnut data={revenueChartData} options={{ maintainAspectRatio: false }} />
              </div>
            ) : (
              <div className='text-sm text-muted-foreground'>{t('charts.noData')}</div>
            )}
          </CardContent>
        </Card>

        <Card className='col-span-3 shadow-sm py-4'>
          <CardHeader>
            <CardTitle>{t('charts.planDetail')}</CardTitle>
            <CardDescription className='mb-2'>{t('charts.planDetailDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-6 grid grid-cols-3 gap-4'>
              <div className='rounded-lg border border-blue-100 bg-blue-50 p-4'>
                <div className='text-sm font-medium text-blue-600'>{t('charts.totalPlan')}</div>
                <div className='text-2xl font-bold text-blue-900'>
                  {subscriptions.totalSubscriptions}
                </div>
              </div>
              <div className='rounded-lg border border-green-100 bg-green-50 p-4'>
                <div className='text-sm font-medium text-green-600'>{t('charts.active')}</div>
                <div className='text-2xl font-bold text-green-900'>
                  {subscriptions.activeSubscriptions}
                </div>
              </div>
              <div className='rounded-lg border border-red-100 bg-red-50 p-4'>
                <div className='text-sm font-medium text-red-600'>{t('charts.expired')}</div>
                <div className='text-2xl font-bold text-red-900'>
                  {subscriptions.expiredSubscriptions}
                </div>
              </div>
            </div>

            <div className='space-y-4'>
              {subscriptions.byPlan.map((plan, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between rounded-md bg-gray-50 p-3'
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`h-8 w-2 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-purple-500'}`}
                    ></div>
                    <div>
                      <div className='text-sm font-semibold'>{plan.planName}</div>
                      <div className='text-xs text-muted-foreground'>
                        {t('charts.active')}: {plan.activeCount}
                      </div>
                    </div>
                  </div>
                  <div className='font-bold text-gray-700'>{formatCurrency(plan.revenue)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row: Top Org & Top Courses */}
      <div className='grid gap-6 xl:grid-cols-2'>
        <Card className='shadow-sm py-4'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div>
              <CardTitle>{t('tables.topOrg')}</CardTitle>
              <CardDescription>{t('tables.topOrgDesc')}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={orgColumns}
              data={tableDataOrgs}
              pagingData={undefined}
              pagingParams={{ pageNumber: 1, pageSize: tableDataOrgs.length }}
              handlePageChange={() => {}}
              placeholder={t('tables.placeholders.org')}
            />
          </CardContent>
        </Card>

        <Card className='shadow-sm py-4'>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <div>
              <CardTitle>{t('tables.topCourse')}</CardTitle>
              <CardDescription>{t('tables.topCourseDesc')}</CardDescription>
            </div>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <DataTable
              columns={courseColumns}
              data={tableDataCourses}
              pagingData={undefined}
              pagingParams={{ pageNumber: 1, pageSize: tableDataCourses.length }}
              handlePageChange={() => {}}
              placeholder={t('tables.placeholders.course')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}