'use client'

import { Section } from '@/features/resource/section/types/section.type'
import React, { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SectionItems from '@/features/resource/section/components/list/SectionItems'

interface LessonSectionsProps {
  sections: Section[]
}

export default function SectionsInLesson({ sections }: LessonSectionsProps) {
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [items, setItems] = useState<Section[]>([...sections].sort((a, b) => a.orderIndex - b.orderIndex))

  const toggleSection = (id: number) => {
    setExpandedSections((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]))
  }

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
    }
  }

  return (
    <div className='transition-all'>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-5'>
            {items.map((section) => (
              <SectionItems key={section.id} section={section} isExpanded={isExpanded} toggleSection={toggleSection} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
