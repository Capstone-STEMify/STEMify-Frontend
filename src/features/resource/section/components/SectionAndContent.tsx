'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { useSearchSectionQuery, useUpdateSectionMutation } from '@/features/resource/section/api/sectionApi'
import { Section } from '@/features/resource/section/types/section.type'
import SectionItems from '@/features/resource/section/components/list/SectionItems'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { Button } from '@/components/shadcn/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function SectionAndContent() {
  const { lessonId } = useParams()
  const token = useAppSelector((state) => state.auth.token)
  const { openModal } = useModal()

  const { data, isLoading } = useSearchSectionQuery({ lessonId: Number(lessonId) }, { skip: !token })
  const [updateSection] = useUpdateSectionMutation()
  const [isOrderChanged, setIsOrderChanged] = useState(false)

  const sortedSections = useMemo(
    () => [...(data?.data.items ?? [])].sort((a, b) => a.orderIndex - b.orderIndex),
    [data]
  )
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [items, setItems] = useState<Section[]>(sortedSections)
  const toggleSection = (id: number) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

  useEffect(() => {
    setItems(sortedSections)
  }, [sortedSections])

  const isExpanded = (id: number) => expandedSections.includes(id)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over?.id)
      const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        orderIndex: index + 1
      }))
      setItems(newItems)
      setIsOrderChanged(true)
    }
  }

  if (isLoading || !data) {
    return (
      <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
        <LoadingComponent size={150} />
      </div>
    )
  }

  return (
    <div>
      <h2 className='mb-6 text-center text-4xl font-bold'>Manage Sections</h2>

      <div className='transition-all'>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className='space-y-5'>
              {items.map((section) => (
                <SectionItems
                  key={section.id}
                  section={section}
                  isExpanded={isExpanded}
                  toggleSection={toggleSection}
                />
              ))}
              <Button
                className='w-full py-6 text-lg'
                variant='outline'
                onClick={() => openModal('upsertSection', { lessonId: Number(lessonId) })}
              >
                <Plus className='mr-2 h-5 w-5' /> Add new section
              </Button>
            </div>
            {isOrderChanged && (
              <Button
                className='mt-4 w-full py-6 text-base'
                onClick={async () => {
                  try {
                    const updates = items.filter((item, idx) => {
                      const original = sortedSections.find((s) => s.id === item.id)
                      return original && original.orderIndex !== item.orderIndex
                    })

                    if (updates.length === 0) {
                      toast.info('Nothing changed.')
                      setIsOrderChanged(false)
                      return
                    }

                    await Promise.all(
                      updates.map((item) =>
                        updateSection({ id: item.id, body: { orderIndex: item.orderIndex } }).unwrap()
                      )
                    )

                    toast.success('Order saved successfully.')
                    setIsOrderChanged(false)
                  } catch (err) {
                    toast.error('Failed to save order.')
                  }
                }}
              >
                Save Order
              </Button>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
