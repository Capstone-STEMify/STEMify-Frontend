import { Button } from '@/components/shadcn/button'
import { Card } from '@/components/shadcn/card'
import CardHorizontal from '@/components/shared/card/CardHorizontal'
import { SDropDown } from '@/components/shared/SDropDown'
import { useUpdateCurriculumMutation } from '@/features/resource/curriculum/api/curriculumApi'
import { Kit } from '@/features/resource/kit/types/kit.type'
import { useModal } from '@/providers/ModalProvider'
import { EllipsisVertical, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

type KitListProps = {
  kits: Kit[]
}
export default function CurriculumKitList({ kits }: KitListProps) {
  const t = useTranslations('kits')
  const tc = useTranslations('common')
  const tt = useTranslations('toast')
  const { openModal } = useModal()
  const { curriculumId } = useParams()

  const [updateCurriculumkit] = useUpdateCurriculumMutation()

  const handleDelete = async (e: React.MouseEvent, kitId: number, kitName: string) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      console.log('Deleting kit with ID:', kitId)
      openModal('confirm', {
        message: tt('confirmMessage.removeKit', { title: kitName }),
        onConfirm: async () => {
          await updateCurriculumkit({
            id: Number(curriculumId),
            body: { kitIds: { values: kits.filter((kit) => kit.id !== kitId).map((kit) => kit.id) } }
          }).unwrap()
          toast.success(tt('successMessage.delete'))
        }
      })
    } catch (error) {
      toast.error(tt('errorMessage'))
    }
  }

  return (
    <div className='mt-4 gap-10'>
      <div className='mb-3 flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>
          {t('list.title')} <span className='rounded bg-sky-200 px-2 text-sm text-gray-600'>{kits.length}</span>
        </h2>
        <Button className='bg-amber-custom-400' onClick={() => {}}>
          <Plus className='mr-1 h-4 w-4' />
          {tc('button.addKit')}
        </Button>
      </div>

      {kits.length > 0 ? (
        kits.map((kit) => (
          <div key={kit.id} className='relative flex max-w-xl min-w-0 gap-1'>
            <CardHorizontal
              key={kit.id}
              imageUrl={
                kit.kitImages?.[0]?.imageUrl ||
                'https://6234779.fs1.hubspotusercontent-na1.net/hub/6234779/hubfs/product_imagination-kit_02.jpg?width=1920&name=product_imagination-kit_02.jpg'
              }
              title={kit.name}
              description={kit.description || ''}
              className='mb-2 max-w-xl'
              height={100}
            />

            <div key={kit.id} className='absolute top-2 right-2 flex flex-col items-center justify-center gap-1'>
              <SDropDown
                trigger={<EllipsisVertical className='mt-2 h-5 w-5 cursor-pointer text-yellow-400 hover:scale-[1.1]' />}
                items={[
                  <button
                    key={`delete-${kit.id}`}
                    className='cursor-pointer text-sm text-red-500'
                    onClick={(e) => handleDelete(e, kit.id, kit.name)}
                  >
                    {tc('button.remove')}
                  </button>
                ].filter(Boolean)}
              />
            </div>
          </div>
        ))
      ) : (
        <Card className='border-2 border-dashed border-gray-300 py-10 text-center text-sm text-gray-500'>
          <p className='text-gray-500'>{t('list.noData')}</p>
        </Card>
      )}
    </div>
  )
}
