'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Badge } from '@/components/shadcn/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar'
import { Input } from '@/components/shadcn/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { MoreHorizontal, FileText, Calendar } from 'lucide-react'

export default function OrganizationDetail() {
  const [noteText, setNoteText] = useState('')

  return (
    <div className='bg-muted/30 min-h-screen p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Customer Details</h1>
          <Button variant='outline'>Change plan</Button>
        </div>

        <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          {/* Left Sidebar */}
          <div className='space-y-6'>
            {/* Company Info Card */}
            <Card className='py-4'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500'>
                    <span className='text-lg font-bold text-white'>A</span>
                  </div>
                  <CardTitle className='text-lg'>Amazing Company</CardTitle>
                </div>
              </CardHeader>
              <CardContent className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Industry</span>
                  <span className='font-medium'>Marketing</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Organization ID</span>
                  <span className='font-medium'>122234908</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Managed by</span>
                  <span className='font-medium'>Domain Label</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Created on</span>
                  <span className='font-medium'>9/18/16</span>
                </div>
                <Button variant='link' className='h-auto p-0 text-blue-600'>
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Notes Section */}
            <Card className='py-4'>
              <CardHeader>
                <Tabs defaultValue='notes' className='w-full'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='notes'>Notes</TabsTrigger>
                    <TabsTrigger value='activity'>Activity</TabsTrigger>
                  </TabsList>
                  <TabsContent value='notes' className='mt-4 space-y-4'>
                    <div className='space-y-2'>
                      <Input
                        placeholder='Client is always late for paying!'
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className='min-h-[60px]'
                      />
                      <div className='flex items-center justify-between'>
                        <Button variant='ghost' size='sm'>
                          Attach
                        </Button>
                        <div className='flex gap-2'>
                          <Button variant='ghost' size='sm'>
                            Cancel
                          </Button>
                          <Button size='sm'>Add note</Button>
                        </div>
                      </div>
                    </div>

                    {/* Attached File */}
                    <div className='bg-muted/50 flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex items-center gap-2'>
                        <FileText className='text-muted-foreground h-4 w-4' />
                        <div>
                          <p className='text-sm font-medium'>Contract Amazing Company.pdf</p>
                          <p className='text-muted-foreground text-xs'>45.6 KB</p>
                        </div>
                      </div>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </div>

                    {/* Activity Item */}
                    <div className='space-y-3 border-t pt-4'>
                      <div className='flex gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src='/placeholder.svg?height=32&width=32' />
                          <AvatarFallback>JC</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium'>Jane Cooper</span>
                            <span className='text-muted-foreground text-xs'>Feb 2, 2019 19:28</span>
                          </div>
                          <p className='text-muted-foreground mt-1 text-sm'>
                            User reports that their desktop app crashed while they were using it, and when they came
                            back, they were missing 2 or 3 recorded videos from the previous week.
                          </p>
                        </div>
                      </div>

                      <div className='bg-muted/50 ml-11 flex items-center justify-between rounded-lg border p-3'>
                        <div className='flex items-center gap-2'>
                          <FileText className='text-muted-foreground h-4 w-4' />
                          <div>
                            <p className='text-sm font-medium'>Contract Amazing Company.pdf</p>
                            <p className='text-muted-foreground text-xs'>45.6 KB</p>
                          </div>
                        </div>
                      </div>

                      <div className='flex gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarImage src='/placeholder.svg?height=32&width=32' />
                          <AvatarFallback>AF</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium'>Albert Flores</span>
                            <span className='text-muted-foreground text-xs'>Jul 30, 2019 18:48</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value='activity'>
                    <p className='text-muted-foreground text-sm'>Activity feed will appear here</p>
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>

          {/* Main Content */}
          <div className='space-y-6'>
            {/* Price Plan Card */}
            <Card className='py-5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <CardTitle className='text-base'>Price plan info</CardTitle>
                    <Badge variant='secondary' className='bg-blue-500 text-white'>
                      Default
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid gap-6 lg:grid-cols-2'>
                  {/* Left Column - Plan Details */}
                  <div className='space-y-4'>
                    <div>
                      <div className='mb-4 flex items-center gap-2'>
                        <h3 className='text-xl font-semibold'>Standard Annual</h3>
                        <Badge variant='secondary' className='bg-green-100 text-green-700'>
                          Active
                        </Badge>
                      </div>
                      <p className='text-2xl font-bold'>
                        $8
                        <span className='text-muted-foreground text-sm font-normal'> per seat per month</span>
                      </p>
                    </div>

                    <div className='space-y-3 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Seats</span>
                        <span className='font-medium'>5-250</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Billing users</span>
                        <span className='font-medium'>300</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Billing period</span>
                        <span className='font-medium'>Annual</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Charges</span>
                        <span className='font-medium'>12 months</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Invoice & Contract Info */}
                  <div className='space-y-3 text-sm'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div className='flex items-center gap-2'>
                        <Calendar className='text-muted-foreground h-4 w-4' />
                        <span className='text-muted-foreground'>Upcoming Invoice: 5/10/20</span>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Payment net</span>
                      <span className='font-medium'>30 days</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Overage</span>
                      <span className='font-medium'>Prorated</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Contract effective date</span>
                      <span className='font-medium'>10/28/20</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Contract end date</span>
                      <span className='font-medium'>10/28/21</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Invoices */}
            <Card className='py-5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>Last Invoices</CardTitle>
                  <Button variant='link' className='h-auto p-0 text-blue-600'>
                    View History
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>INVOICE</TableHead>
                      <TableHead>CREATED</TableHead>
                      <TableHead>DUE DATE</TableHead>
                      <TableHead>PAYMENT METHOD</TableHead>
                      <TableHead>SUM</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className='font-medium text-blue-600'>#2841782751</TableCell>
                      <TableCell>22/9/20</TableCell>
                      <TableCell>15/10/20</TableCell>
                      <TableCell>
                        <div className='text-xs'>
                          <div>****4438 Visa Debit</div>
                          <div className='text-muted-foreground'>Paid on: 9/2/20</div>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>$22,050</TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='bg-gray-100 text-gray-700'>
                          Unpaid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium text-blue-600'>#2841782751</TableCell>
                      <TableCell>22/9/20</TableCell>
                      <TableCell>15/10/20</TableCell>
                      <TableCell>
                        <div className='text-xs'>
                          <div>****4438 Visa Debit</div>
                          <div className='text-muted-foreground'>Paid on: 9/2/20</div>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>$30,500</TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='bg-green-100 text-green-700'>
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium text-blue-600'>#2841782751</TableCell>
                      <TableCell>22/9/20</TableCell>
                      <TableCell>15/10/20</TableCell>
                      <TableCell>
                        <div className='text-xs'>
                          <div>****4438 Visa Debit</div>
                          <div className='text-muted-foreground'>Paid on: 9/2/20</div>
                        </div>
                      </TableCell>
                      <TableCell className='font-medium'>$22,150</TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='bg-pink-100 text-pink-700'>
                          Rejected
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Organization Admins */}
            <Card className='py-5'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base'>Organization Admins</CardTitle>
                  <Button variant='link' className='h-auto p-0 text-blue-600'>
                    Add new admin
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-MAIL</TableHead>
                      <TableHead>NAME</TableHead>
                      <TableHead>CREATED ON</TableHead>
                      <TableHead className='w-[50px]'></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className='font-medium text-blue-600'>alma.lawson@example.com</TableCell>
                      <TableCell>Cameron Williamson</TableCell>
                      <TableCell>22/09/2020</TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className='font-medium text-blue-600'>alma.lawson@example.com</TableCell>
                      <TableCell>Cameron Williamson</TableCell>
                      <TableCell>22/09/2020</TableCell>
                      <TableCell>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
