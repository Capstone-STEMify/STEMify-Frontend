'use client'
import dynamic from 'next/dynamic'
import React from 'react'

export default function page() {
  const ExcalidrawWrapper = dynamic(async () => (await import('@/providers/ExcalidrawWrapper')).default, {
    ssr: false
  })
  return <ExcalidrawWrapper />
}
