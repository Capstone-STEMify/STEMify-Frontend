import BackButton from '@/components/shared/button/BackButton'
import SBreadcrumb from '@/components/shared/SBreadcrumb'
import { textVariants } from '@/utils/shadcn/variants'
import { VariantProps } from 'class-variance-authority'
import React from 'react'

type BreadcrumbPageLayoutProps = {
  title: string
  children: React.ReactNode
} & VariantProps<typeof textVariants>

export default function BreadcrumbPageLayout({
  title,
  children,
  color,
  size,
  weight = 'semibold'
}: BreadcrumbPageLayoutProps) {
  return (
    <div className='bg-light pb-20'>
      <div className='container mx-auto py-6'>
        <div className='mx-8'>
          <div className='flex items-center gap-5'>
            <BackButton />
            <SBreadcrumb title={title} size={size} color={color} weight={weight} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
