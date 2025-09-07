import CardHorizontal from '@/components/shared/card/CardHorizontal'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useModal } from '@/providers/ModalProvider'
import { useTranslations } from 'next-intl'
import React from 'react'

type KitListProps = {
  kits: Kit[]
}
export default function KitList({ kits }: KitListProps) {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const { openModal } = useModal()

  return (
    <div className='mt-4 gap-10'>
      <h2 className='mb-6 text-2xl font-semibold'>
        {t('list.title')} <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{kits.length}</span>
      </h2>

      {kits.map((kit) => (
        <CardHorizontal
          key={kit.id}
          imageUrl={
            kit.kitImages?.[0]?.url ||
            'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
          }
          title={kit.name}
          description={kit.description || ''}
          buttonText={tc('button.view')}
          className='max-w-xl'
          height={100}
        />
      ))}
    </div>
  )
}
