import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { MoreHorizontal } from 'lucide-react'
export default function OrganizationAdmins() {
  return (
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
  )
}
