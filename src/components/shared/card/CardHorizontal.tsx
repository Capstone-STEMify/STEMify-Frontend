import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'
import { getStatusBadgeClass } from '@/utils/badgeColor'
import { useStatusTranslation } from '@/utils/index'

type CardProductProps = {
  imageUrl: string
  title: string
  productType?: string
  description?: string
  badge?: string
  onClick?: () => void
}

export default function CardHorizontal({
  imageUrl,
  title,
  productType,
  description,
  badge,
  onClick
}: CardProductProps) {
  const t = useTranslations('kits.list')
  const translateStatus = useStatusTranslation()

  return (
    <Card
      className='flex w-full cursor-pointer flex-col items-start gap-6 rounded-xl border bg-white pr-4 shadow-sm md:flex-row'
      onClick={onClick}
    >
      {/* Image */}
      <div className='flex-shrink-0 p-4 md:p-6'>
        <Image src={imageUrl} alt={title} width={160} height={160} className='rounded-lg border object-contain' />
      </div>

      {/* Text */}
      <CardContent className='flex flex-1 flex-col px-3 py-4 md:px-0'>
        {/* Title */}
        <h3 className='text-md flex items-center gap-2 font-semibold text-gray-900'>
          {title}
          {badge && <Badge className={getStatusBadgeClass(badge.toLowerCase())}>{translateStatus(badge)}</Badge>}
        </h3>

        {/* Description */}
        {description && <p className='mt-3 line-clamp-4 text-xs text-gray-500'>{description}</p>}

        {/* CTA button */}
        {/* <Button variant='outline' className='mt-4 w-fit border-blue-600 text-blue-600 hover:bg-blue-50'>
          Select Options
        </Button> */}
      </CardContent>
    </Card>
  )
}
