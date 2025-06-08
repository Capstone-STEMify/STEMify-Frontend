'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/shadcn/breadcrumb'
import { textVariants } from '@/utils/shadcn/variants'
import { VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

type SBreadcrumbProps = {
  title: string
} & VariantProps<typeof textVariants>

export default function SBreadcrumb({ title, size = 'md' }: SBreadcrumbProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  function formatLabel(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    return {
      label: formatLabel(segment),
      href
    }
  })

  const allItems = [{ label: 'Home', href: '/' }, ...items]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {allItems.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem className={textVariants({ size })}>
              {index === allItems.length - 1 ? (
                <BreadcrumbPage>{title || item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < allItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
