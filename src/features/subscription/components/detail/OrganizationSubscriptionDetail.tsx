'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Progress } from '@/components/shadcn/progress'
import {
  CheckCircle,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Search,
  UserPlus,
  Calendar,
  CreditCard
} from 'lucide-react'

export default function OrganizationSubscriptionDetail() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6'>
      <div className='mx-auto max-w-7xl space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-foreground text-3xl font-bold tracking-tight'>Subscription Overview</h1>
            <p className='text-muted-foreground mt-1'>Manage your organization's subscription and users</p>
          </div>
          {/* Action Buttons */}
          <div className='flex gap-3 lg:items-end'>
            <Button className='bg-amber-400 text-white shadow-lg'>Send Renewal Request</Button>
            <Button className='bg-sky-400 shadow-lg'>Change Plan</Button>
            <Button variant='outline' className='shadow-lg'>
              Cancel Subscription
            </Button>
          </div>
        </div>

        {/* Current Plan Card - Enhanced */}
        <Card className='overflow-hidden bg-gradient-to-br from-sky-100 to-sky-300 shadow-xl'>
          <CardContent className='p-8'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
              <div className='flex-1 space-y-6'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm'>
                    <CreditCard className='h-6 w-6' />
                  </div>
                  <div>
                    <div className='flex items-center gap-2'>
                      <h2 className='text-xl font-semibold'>Current Plan</h2>
                      <Badge className='bg-emerald-500/90 hover:bg-emerald-500'>
                        <span className='mr-1'>●</span> Active
                      </Badge>
                    </div>
                    <p className='text-sm'>Your subscription is active and running</p>
                  </div>
                </div>

                <div className='grid gap-6 sm:grid-cols-2'>
                  <div className='rounded-xl bg-sky-100/90 p-4 backdrop-blur-sm'>
                    <p className='text-sm font-medium'>Package Details</p>
                    <p className='mt-1 text-2xl font-bold'>Basic Package</p>
                    <p className='mt-1 text-sm'>100K đ/Seat/6 Months</p>
                  </div>
                  <div className='rounded-xl bg-sky-100/90 p-4 backdrop-blur-sm'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4' />
                      <p className='text-sm font-medium'>Expires On</p>
                    </div>
                    <p className='mt-1 text-2xl font-bold'>Oct 26, 2025</p>
                    <p className='mt-1 text-sm'>6 months remaining</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className=''>Subscription Period</span>
                    <span className='font-medium'>50% Complete</span>
                  </div>
                  <Progress
                    value={50}
                    className='h-3 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500'
                  />
                  <div className='flex justify-between text-xs'>
                    <span>Jan 06, 2025</span>
                    <span>Oct 26, 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid - Enhanced */}
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Assigned Licenses */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white'>
                  <Users className='h-6 w-6' />
                </div>
                <Badge variant='secondary' className='text-xs'>
                  80/100
                </Badge>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Assigned Licenses</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <p className='text-3xl font-bold'>
                80 <span className='text-muted-foreground text-lg font-normal'>of 100</span>
              </p>
              <Progress value={80} className='h-2 bg-blue-100 [&>div]:bg-blue-600' />
              <p className='text-muted-foreground text-xs'>20 licenses remaining</p>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-amber-100'>
                  <GraduationCap className='h-6 w-6' />
                </div>
                <div className='flex items-center gap-1 text-red-600'>
                  <TrendingDown className='h-4 w-4' />
                  <span className='text-xs font-medium'>-20%</span>
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Students</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>60</p>
              <p className='text-muted-foreground text-xs'>Down 20% this period</p>
            </CardContent>
          </Card>

          {/* Total Teachers */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-emerald-100'>
                  <Users className='h-6 w-6' />
                </div>
                <div className='flex items-center gap-1 text-emerald-600'>
                  <TrendingUp className='h-4 w-4' />
                  <span className='text-xs font-medium'>+12.5%</span>
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Teachers</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>10</p>
              <p className='text-muted-foreground text-xs'>Strong user retention</p>
            </CardContent>
          </Card>

          {/* Total Curricula */}
          <Card className='group py-4 shadow-lg transition-all hover:shadow-xl'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-purple-100'>
                  <BookOpen className='h-6 w-6' />
                </div>
              </div>
              <CardTitle className='text-muted-foreground mt-4 text-sm font-medium'>Total Curricula</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              <p className='text-3xl font-bold'>2</p>
              <p className='text-muted-foreground text-xs'>Including 10 courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Section */}
        <Card className='py-4 shadow-lg'>
          <CardHeader>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle className='text-xl'>User Management</CardTitle>
                <p className='text-muted-foreground mt-1 text-sm'>Manage users and pending invitations</p>
              </div>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                <UserPlus className='mr-2 h-4 w-4' />
                Invite Users
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Search and Tabs */}
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div className='relative flex-1 sm:max-w-sm'>
                <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                <Input placeholder='Search users...' className='pl-9' />
              </div>
              <div className='flex gap-2'>
                <Badge variant='default' className='cursor-pointer px-4 py-1.5'>
                  Users
                </Badge>
                <Badge variant='secondary' className='cursor-pointer px-4 py-1.5'>
                  Pending Invites
                </Badge>
              </div>
            </div>

            {/* Table */}
            <div className='overflow-hidden rounded-lg'>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead className='bg-muted/50'>
                    <tr>
                      <th className='text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                        Name
                      </th>
                      <th className='text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                        Email
                      </th>
                      <th className='text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                        Status
                      </th>
                      <th className='text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                        Account Type
                      </th>
                      <th className='text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase'>
                        Date Added
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y bg-white'>
                    <tr className='hover:bg-muted/50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600'>
                            R
                          </div>
                          <span className='font-medium'>Rosie</span>
                        </div>
                      </td>
                      <td className='text-muted-foreground px-6 py-4 text-sm whitespace-nowrap'>rosie91@fpt.edu.vn</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge variant='outline' className='-emerald-200 bg-emerald-50 text-emerald-700'>
                          <CheckCircle className='mr-1 h-3 w-3' />
                          Active
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap'>Student</td>
                      <td className='text-muted-foreground px-6 py-4 text-sm whitespace-nowrap'>Jan 09, 2025</td>
                    </tr>
                    <tr className='hover:bg-muted/50 transition-colors'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600'>
                            L
                          </div>
                          <span className='font-medium'>Leo</span>
                        </div>
                      </td>
                      <td className='text-muted-foreground px-6 py-4 text-sm whitespace-nowrap'>leo@example.com</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge variant='outline' className='-emerald-200 bg-emerald-50 text-emerald-700'>
                          <CheckCircle className='mr-1 h-3 w-3' />
                          Active
                        </Badge>
                      </td>
                      <td className='px-6 py-4 text-sm whitespace-nowrap'>Student</td>
                      <td className='text-muted-foreground px-6 py-4 text-sm whitespace-nowrap'>Jan 09, 2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Curriculum Section */}
        <Card className='py-4 shadow-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>Included Curricula</CardTitle>
            <p className='text-muted-foreground mt-1 mb-4 text-sm'>
              Courses and learning materials available in your subscription
            </p>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <Card className='group overflow-hidden shadow-md transition-all hover:shadow-xl'>
                <div className='relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200'>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <BookOpen className='h-16 w-16 text-blue-400' />
                  </div>
                </div>
                <CardContent className='p-5'>
                  <div className='mb-3 flex items-center gap-2'>
                    <Badge variant='secondary' className='bg-blue-100 text-blue-700'>
                      6-12+
                    </Badge>
                    <Badge variant='secondary'>Beginner</Badge>
                  </div>
                  <p className='text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase'>STEM-01</p>
                  <h3 className='mb-2 text-lg font-semibold'>Basic STEM</h3>
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    Introduction to basic STEM concepts and foundational learning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
