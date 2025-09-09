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
  title?: string
} & VariantProps<typeof textVariants>

function resolveHref(href: string): string {
  const map: Record<string, string> = {
    '/resource/course': '/resource/courses',
    '/resource/lesson': '/resource/lessons'
  }
  return map[href] || href
}

export default function SBreadcrumb({ title, size = 'md', color, weight }: SBreadcrumbProps) {
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
        {allItems.map((item) => (
          <Fragment key={item.href}>
            <BreadcrumbItem className={textVariants({ size })}>
              {item.href === pathname ? (
                <BreadcrumbPage className={textVariants({ color, weight })}>{title || item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={resolveHref(item.href)}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {item.href !== pathname && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
