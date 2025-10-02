import Image from 'next/image'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { useTranslations } from 'next-intl'

type CardProductProps = {
  imageUrl: string
  title: string
  rating?: number
  reviews?: number
  sku?: string
  availability?: string
  productType?: string
  vendor?: string
  description?: string
  price: number
  oldPrice?: number
  badge?: string
  stockQuantity?: number
  onClick?: () => void
}

export default function CardHorizontal({
  imageUrl,
  title,
  rating = 5,
  reviews = 0,
  sku,
  availability,
  productType,
  vendor,
  description,
  price,
  oldPrice,
  badge,
  stockQuantity,
  onClick
}: CardProductProps) {
  const t = useTranslations('kits.list')

  return (
    <Card
      className='flex w-full cursor-pointer flex-col items-center gap-6 rounded-xl border bg-white pr-4 shadow-sm md:flex-row'
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
          {badge && (
            <Badge variant='secondary' className='text-xs'>
              {badge}
            </Badge>
          )}
        </h3>

        {/* Rating */}
        <div className='mt-2 flex items-center gap-1 text-sm text-yellow-500'>
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} size={16} fill='currentColor' stroke='none' />
          ))}
          <span className='ml-2 text-xs text-gray-700'>
            {reviews} {t('reviews')}
          </span>
        </div>

        {/* Meta info */}
        <div className='mt-2 space-y-1 text-sm text-gray-600'>
          {sku && (
            <p className='text-xs'>
              <span className='text-xs font-medium'>{t('sku')}:</span> {sku}
            </p>
          )}
          {availability && (
            <p className='text-xs'>
              <span className='text-xs font-medium'>{t('availability')}:</span> {availability}
              <span className='ml-2 text-xs text-gray-500'>
                ( {stockQuantity} {t('items')})
              </span>
            </p>
          )}
          {productType && (
            <p className='text-xs'>
              <span className='text-xs font-medium'>{t('productType')}:</span> {productType}
            </p>
          )}
          {vendor && (
            <p className='text-xs'>
              <span className='text-xs font-medium'>{t('vendor')}:</span> {vendor}
            </p>
          )}
        </div>

        {/* Description */}
        {description && <p className='mt-3 line-clamp-2 text-xs text-gray-500'>{description}</p>}

        {/* Price */}
        <div className='mt-2 flex items-center gap-3'>
          <span className='text-xl font-bold text-red-600'>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </span>
        </div>

        {/* CTA button */}
        {/* <Button variant='outline' className='mt-4 w-fit border-blue-600 text-blue-600 hover:bg-blue-50'>
          Select Options
        </Button> */}
      </CardContent>
    </Card>
  )
}
