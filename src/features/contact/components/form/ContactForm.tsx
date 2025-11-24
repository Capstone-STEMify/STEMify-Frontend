'use client'

import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/shadcn/card'
import UpsertContact from '@/features/contact/components/upsert/UpsertContact'

export default function ContactForm() {
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
          <UpsertContact />
        </CardContent>
      </Card>
    </div>
  )
}
