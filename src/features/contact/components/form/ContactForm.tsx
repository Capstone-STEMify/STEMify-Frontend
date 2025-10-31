'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import { useGetAllJobRolesQuery } from '@/features/contact/api/jobRoleApi'
import { getOptions } from '@/utils/index'
import SSelect from '@/components/shared/SSelect'

export default function ContactForm() {
  const { data: jobRoleData, isLoading: jobRoleLoading } = useGetAllJobRolesQuery()
  const jobRoleOptions = getOptions(jobRoleData?.data.items, 'name')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    jobRole: '',
    organizationName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Form submitted:', formData)
  }

  return (
    <div className='flex min-w-2xl items-center justify-center'>
      <Card className='py-5'>
        <CardHeader className='space-y-2 pb-6'>
          <CardTitle className='text-3xl font-bold text-slate-900'>Get in touch</CardTitle>
          <CardDescription className='text-base text-slate-600'>
            We're here to help! Fill out the form below and we'll get back to you shortly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Personal Information Section */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='firstName' className='text-sm font-medium text-slate-700'>
                    First Name
                  </Label>
                  <Input
                    id='firstName'
                    type='text'
                    placeholder='John'
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className='h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lastName' className='text-sm font-medium text-slate-700'>
                    Last Name
                  </Label>
                  <Input
                    id='lastName'
                    type='text'
                    placeholder='Doe'
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className='h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='email' className='text-sm font-medium text-slate-700'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='john.doe@company.com'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className='h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-sm font-medium text-slate-700'>
                    Phone
                  </Label>
                  <Input
                    id='phone'
                    type='tel'
                    placeholder='+1 (555) 000-0000'
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className='h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                {/* <SSelect
                  placeholder={t('list.placeholder.skill')}
                  value={filters.skillId?.toString() ?? ''}
                  onChange={(val) => dispatch(setParam({ key: 'skillId', value: Number(val) }))}
                  options={skillOptions}
                  onOpen={(open) => {
                    if (open && !skills) getSkill()
                  }}
                /> */}
              </div>
            </div>

            {/* Organization Information Section */}
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='organizationName' className='text-sm font-medium text-slate-700'>
                  Organization Name
                </Label>
                <Input
                  id='organizationName'
                  type='text'
                  placeholder='Acme Corporation'
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className='h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500'
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button type='submit' className='w-full bg-sky-400'>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
