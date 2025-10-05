'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { SCarousel } from '@/components/shared/SCarousel'
import { useLazyGetKitByIdQuery } from '@/features/resource/kit/api/kitProductApi'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type KitInformationSectionProps = {
  kitIds: number[]
}

export default function KitInformationSection({ kitIds }: KitInformationSectionProps) {
  const t = useTranslations('curriculum')
  const [kits, setKits] = useState<Kit[]>([])
  const [loadingKits, setLoadingKits] = useState(false)

  const [triggerGetKitById] = useLazyGetKitByIdQuery()
  // curriculum: fetch từng kitId
  useEffect(() => {
    const fetchKits = async () => {
      if (kitIds.length > 0) {
        setLoadingKits(true)
        const kits: any[] = []

        for (const id of kitIds) {
          try {
            const result = await triggerGetKitById(id).unwrap()
            kits.push(result.data)
          } catch (err: any) {
            if (err?.status === 404) {
              console.warn(`Kit ${id} not found (404), skipping.`)
            } else {
              console.error(`Error loading kit ${id}:`, err)
            }
          }
        }
        setKits(kits)
        setLoadingKits(false)
      }
    }

    fetchKits()
  }, [kitIds, triggerGetKitById])

  if (loadingKits) return <LoadingComponent />
  if (kits.length === 0) return null

  return (
    <div className='space-y-10'>
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
              items={(kit.images?.length ? kit.images : [{ imageUrl: '/images/fallback.png' }])
                .filter((img) => img?.imageUrl && img.imageUrl.trim() !== '')
                .map((img, j) => (
                  <div className='flex justify-center p-1' key={j}>
                    <Image
                      src={img.imageUrl || '/images/fallback.png'}
                      alt='Kit Image'
                      width={500}
                      height={500}
                      className='aspect-square rounded-3xl object-cover shadow-xs'
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
