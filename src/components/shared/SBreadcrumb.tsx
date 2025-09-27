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
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

type SBreadcrumbProps = {
  title?: string
} & VariantProps<typeof textVariants>

function resolveHref(href: string): string {
  const parts = href.split('/').filter(Boolean)
  const locale = parts[0]
  const path = '/' + parts.slice(1).join('/')

  if (path.startsWith('/resource/lesson')) {
    return `/${locale}/resource/lessons`
  }
  if (path.startsWith('/resource/course')) {
    return `/${locale}/resource/courses`
  }

  return href
}

export default function SBreadcrumb({ title, size = 'md', color, weight }: SBreadcrumbProps) {
  const pathname = usePathname()
  const locale = useLocale()
  const segments = pathname
    .split('/')
    .filter((segment) => segment !== locale)
    .filter(Boolean)

  function formatLabel(segment: string): string {
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const items = segments.map((segment, index) => {
    const href = '/' + [locale, ...segments.slice(0, index + 1)].join('/')
    return {
      label: formatLabel(segment),
      href
    }
  })
  const allItems = [{ label: 'Home', href: `/${locale}` }, ...items]

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
