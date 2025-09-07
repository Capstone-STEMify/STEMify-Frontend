import ContentManagement from '@/features/resource/content/components/upsert/UpsertContent'
import { useDeleteSectionMutation, useUpdateSectionMutation } from '@/features/resource/section/api/sectionApi'
import { Section } from '@/features/resource/section/types/section.type'
import { useModal } from '@/providers/ModalProvider'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Edit, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export default function SectionItems({
  section,
  isExpanded,
  toggleSection
}: {
  section: Section
  isExpanded: (id: number) => boolean
  toggleSection: (id: number) => void
}) {
  const { openModal } = useModal()
  const [deleteSection] = useDeleteSectionMutation()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })

  const t = useTranslations('sectionManagement')
  const tt = useTranslations('toast')

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} className='rounded-lg border p-4 py-4'>
      <div className='flex items-center justify-between select-none' onClick={() => toggleSection(section.id)}>
        <div className='flex items-center gap-2'>
          <span className='cursor-grab text-gray-400' {...attributes} {...listeners}>
            ⠿
          </span>
          <h3 className='text-lg font-semibold'>{section.title}</h3>

          <Edit
            size={15}
            className='text-sky-600'
            onClick={(e) => {
              e.stopPropagation()
              openModal('upsertSection', { sectionId: section.id })
            }}
          />
          <Trash2
            size={15}
            className='text-red-500'
            onClick={(e) => {
              e.stopPropagation()
              openModal('confirm', {
                message: `${t('section.del_message')}`,
                onConfirm: async () => {
                  try {
                    await deleteSection(section.id).unwrap()
                    toast.success(tt('successMessage.delete'))
                  } catch (err) {
                    toast.error(tt('errorMessage'))
                  }
                }
              })
            }}
          />
        </div>{' '}
        <span className='text-sm text-gray-500'>{isExpanded(section.id) ? '▲' : '▼'}</span>
      </div>

      {isExpanded(section.id) && (
        <div className='mt-3 text-sm text-gray-700'>
          <div className='flex gap-10 px-3'>
            <p>
              <strong className='mr-2'>{t('section.dur')}:</strong> {section.duration} mins
            </p>
            {/* <p>
              <strong className='mr-2'>{t('section.status')}:</strong> {section.status}
            </p> */}
          </div>
          <div className='px-3'>
            <p>
              <strong className='mr-2 leading-relaxed break-words whitespace-pre-wrap'>
                {t('section.description')}:
              </strong>
            </p>

            <div className='mt-1 break-words whitespace-pre-wrap text-gray-700'>{section.description}</div>
          </div>{' '}
          <ContentManagement sectionId={section.id} />
        </div>
      )}
    </div>
  )
}
