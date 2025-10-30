// app/my-learning/MyLearningSidebar.tsx
'use client'

import { CertificateList } from '@/features/resource/course/components/my-learning/CertificateList'
import { RecentActivityList } from '@/features/resource/course/components/my-learning/RecenActivity'
import React from 'react'

type MyLearningSidebarProps = {
  studentId?: string
}

export function MyLearningSidebar({ studentId }: MyLearningSidebarProps) {
  return (
    <aside className='hidden w-80 shrink-0 lg:block xl:w-96'>
      <div className='space-y-6 py-10'>
        {/* Certificates Section */}
        <CertificateList studentId={studentId} />

        {/* Recent Activity Section */}
        <RecentActivityList studentId={studentId} />
      </div>
    </aside>
  )
}
