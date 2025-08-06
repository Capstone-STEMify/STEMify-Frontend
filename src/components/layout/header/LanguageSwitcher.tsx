'use client'

import { useLocale, useTranslations } from 'next-intl'
// highlight-start
// Sử dụng các import tiêu chuẩn của Next.js
import { usePathname, useRouter } from 'next/navigation'
// highlight-end
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Languages } from 'lucide-react'

export default function LanguageSwitcher() {
  const t = useTranslations('Header')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const onSelectChange = (newLocale: string) => {
    // Tách pathname thành các phần
    const segments = pathname.split('/')
    
    // Thay đổi phần ngôn ngữ (luôn ở vị trí thứ 2, ví dụ: ['', 'en', 'about'])
    segments[1] = newLocale
    
    // Nối các phần lại và điều hướng đến URL mới
    router.replace(segments.join('/'))
  }

  return (
    <Select onValueChange={onSelectChange} defaultValue={locale}>
      <SelectTrigger className='w-fit border-none bg-transparent shadow-none focus:ring-0'>
        <div className='flex items-center gap-2'>
          <Languages size={20} className='text-gray-600' />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent align='end'>
        <SelectItem value='en'>{t('english')}</SelectItem>
        <SelectItem value='vi'>{t('vietnamese')}</SelectItem>
      </SelectContent>
    </Select>
  )
}