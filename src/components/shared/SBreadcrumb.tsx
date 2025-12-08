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
import { useLocale, useTranslations } from 'next-intl'
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

function isIdSegment(segment: string) {
  return /^\d+$/.test(segment)
}

const IGNORE_SEGMENTS = ['learn', 'edit', 'view', 'preview']

export default function SBreadcrumb({ title, size = 'md', color, weight }: SBreadcrumbProps) {
  const tc = useTranslations('common.breadcrumb')
  const pathname = usePathname()
  const locale = useLocale()
  const segments = pathname
    .split('/')
    .filter((segment) => segment !== locale)
    .filter(Boolean)
    .filter(
      (segment) =>
        !isIdSegment(segment) && // ✅ bỏ id
        !IGNORE_SEGMENTS.includes(segment) // ✅ bỏ learn
    )

  function formatLabel(segment: string): string {
    const key = segment.replace(/-/g, '_') // nếu muốn hỗ trợ kebab-case

    // thử dịch
    const translated = tc(key)

    // next-intl: nếu không có key -> trả về chính key
    if (translated !== key) return translated

    // fallback: format thủ công
    return segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  const items = segments.map((segment, index) => {
    const href = '/' + [locale, ...segments.slice(0, index + 1)].join('/')
    return {
      label: formatLabel(segment),
      href
    }
  })
  const allItems = [{ label: tc('home'), href: `/${locale}` }, ...items]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {allItems.map((item, index) => (
          <Fragment key={item.href}>
            <BreadcrumbItem className={textVariants({ size })}>
              <BreadcrumbLink asChild>
                <Link href={resolveHref(item.href)}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < allItems.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}

        {title && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem className={textVariants({ size })}>
              <BreadcrumbPage className={textVariants({ color, weight })}>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
