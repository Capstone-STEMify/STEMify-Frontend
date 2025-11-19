'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Trash2, X } from 'lucide-react'
import { useModal } from '@/providers/ModalProvider'
import { useDeleteKitComponentsMutation } from '@/features/kit-components/api/kitComponentApi'
import { Badge } from '@/components/shadcn/badge'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'
import { Component, KitComponent } from '@/features/kit-components/types/kit-component.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { UserRole } from '@/types/userRole'

export type WhatsIncludedProps = {
  components: KitComponent[]
  name?: string
  addBtn?: React.ReactNode
  refetch?: () => void
}
const WhatsIncluded: React.FC<WhatsIncludedProps> = ({ components, name, addBtn, refetch }) => {
  const tt = useTranslations('toast')
  const t = useTranslations('kits')
  const [isExpanded, setIsExpanded] = useState(true)
  const { openModal } = useModal()

  const user = useAppSelector((state) => state.auth?.user)
  const role = user?.userRole
  const isEditable = role === UserRole.ADMIN || role === UserRole.STAFF

  const [deleteComponentFromKit] = useDeleteKitComponentsMutation()

  const handleDelete = (id: number) => {
    openModal('confirm', {
      message: tt('confirmMessage.removeComponent'),
      onConfirm: async () => {
        await deleteComponentFromKit({ ids: [id] }).unwrap()
        toast.success(tt('successMessage.removeComponent'))
        refetch?.()
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className='rounded-3xl bg-white p-10 shadow-xl'
    >
      <div className='mb-8 flex cursor-pointer items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-4xl font-semibold text-gray-900'>{t('detail.whatsIncluded')}</h2>
          {addBtn && <div>{addBtn}</div>}
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className='h-8 w-8 text-gray-600' onClick={() => setIsExpanded(!isExpanded)} />
        </motion.div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className='overflow-hidden'
      >
        <div className='mb-6 border-b border-gray-200 pb-6'>
          {name && <h3 className='text-2xl font-semibold text-gray-900'>{name}</h3>}
        </div>

        <div className='grid grid-cols-4 gap-4 md:grid-cols-6 lg:grid-cols-8'>
          {components.map((item, idx) => (
            <div key={item.id} className='flex flex-col items-center'>
              <div className='relative mb-2 flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2'>
                <img src={item.imageUrl} alt={item.name} className='h-full w-full object-contain' />

                {/* button delete */}
                {isEditable && (
                  <Badge
                    onClick={() => handleDelete(item.id as number)}
                    className='absolute top-1 right-1 cursor-pointer rounded-full bg-red-50 p-1 text-red-500 hover:text-red-600'
                  >
                    <Trash2 size={14} />
                  </Badge>
                )}
              </div>
              <h4 className='mb-1 text-center leading-tight font-medium text-gray-900'>{item.name}</h4>
              <p className='text-sm text-gray-500'>x{item.quantity}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default WhatsIncluded
