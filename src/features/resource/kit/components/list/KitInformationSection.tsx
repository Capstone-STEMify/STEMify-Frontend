'use client'
import { SCarousel } from '@/components/shared/SCarousel'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type KitInformationSectionProps = {
  kits: Kit[]
}

export default function KitInformationSection({ kits }: KitInformationSectionProps) {
  const t = useTranslations('curriculum')

  return (
    <div className='space-y-10 py-10'>
      <div className='clip-slant relative h-[300px] bg-[#fec708] py-10 text-center'>
        <h1 className='text-5xl'>{t('custom.kitListTitle')}</h1>
        <p className='mx-auto w-180 py-5'>{t('custom.kitListDescription')}</p>
      </div>
      {kits.map((kit, i) => (
        <section key={kit.id} className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 md:grid-cols-2'>
          {/* Left Section (text) */}
          <div className={`max-w-2xl ${i % 2 === 1 ? 'md:order-2' : ''}`}>
            <h2 className='mb-4 text-4xl font-bold tracking-tight'>{kit.name}</h2>
            <p className='mb-4 leading-relaxed text-gray-700'>{kit.description || 'No description available.'}</p>
          </div>

          {/* Right Section (carousel) */}
          <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
            <SCarousel
              variant='plugin'
              autoplayDelay={2000}
              items={(kit.images?.length ? kit.images : [{ imageUrl: '/images/fallback.png' }]).map((img, j) => (
                <div className='p-1' key={j}>
                  <Image
                    src={img?.imageUrl ?? '/images/fallback.png'}
                    alt='Kit Image'
                    width={600}
                    height={600}
                    className='w-full max-w-xl rounded-3xl object-cover shadow-xs'
                  />
                </div>
              ))}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
