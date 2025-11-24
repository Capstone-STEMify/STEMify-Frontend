// app/my-learning/components/CertificateList.tsx
'use client'

import React from 'react'
import { Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import Link from 'next/link'

type Certificate = {
  id: number
  title: string
  issueDate: string
  imageUrl?: string
}

type CertificateListProps = {
  studentId?: string
}

export function CertificateList({ studentId }: CertificateListProps) {
  // TODO: Replace with actual API call
  const certificates: Certificate[] = [
    {
      id: 1,
      title: 'Web Development Fundamentals',
      issueDate: '2024-03-15',
      imageUrl: '/certificates/cert1.png'
    },
    {
      id: 2,
      title: 'React Advanced Concepts',
      issueDate: '2024-02-20',
      imageUrl: '/certificates/cert2.png'
    },
    {
      id: 3,
      title: 'JavaScript ES6+ Mastery',
      issueDate: '2024-01-10',
      imageUrl: '/certificates/cert3.png'
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      issueDate: '2023-12-05',
      imageUrl: '/certificates/cert4.png'
    },
    {
      id: 5,
      title: 'Database Design & SQL',
      issueDate: '2023-11-20',
      imageUrl: '/certificates/cert5.png'
    }
  ]

  return (
    <Card className='p-4'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-lg font-bold'>
            <Award className='h-5 w-5 text-blue-600' />
            My Certificates
          </CardTitle>
          <Badge variant='secondary' className='bg-purple-100 text-blue-700'>
            {certificates.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {certificates.length > 0 ? (
          <div className='scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 max-h-[500px] space-y-3 overflow-y-auto pr-2'>
            {certificates.map((cert) => (
              <Link
                key={cert.id}
                href={`/certificates/${cert.id}`}
                className='group block cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-purple-300 hover:shadow-md'
              >
                <div className='flex items-start gap-3'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-100'>
                    <Award className='h-6 w-6 text-blue-600' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h4 className='line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-purple-600'>
                      {cert.title}
                    </h4>
                    <p className='mt-1 text-xs text-gray-500'>
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className='py-8 text-center'>
            <Award className='mx-auto h-10 w-10 text-gray-300' />
            <p className='mt-2 text-sm text-gray-500'>No certificates yet</p>
            <p className='mt-1 text-xs text-gray-400'>Complete courses to earn certificates</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
