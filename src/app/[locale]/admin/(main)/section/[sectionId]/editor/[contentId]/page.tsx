'use client'
import UpsertContent from '@/features/resource/content/components/upsert/UpsertContent'
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {
  const { sectionId, contentId } = useParams()
  const sectionIdNum = Array.isArray(sectionId) ? parseInt(sectionId[0]!) : parseInt(sectionId!)
  const contentIdNum =
    contentId !== undefined ? (Array.isArray(contentId) ? parseInt(contentId[0]!) : parseInt(contentId!)) : undefined
  return <UpsertContent sectionId={sectionIdNum} contentId={contentIdNum} />
}
