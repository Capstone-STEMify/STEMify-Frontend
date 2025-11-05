'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Bot } from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import SEmpty from '@/components/shared/empty/SEmpty'

import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { useCreateEmulatorMutation, useSearchEmulationsQuery } from '@/features/emulator/api/emulatorApi'

export default function StrawLabProject() {
  const locale = useLocale()
  const router = useRouter()

  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { data, isLoading } = useSearchEmulationsQuery({})
  const [createEmulation, { isLoading: isCreating }] = useCreateEmulatorMutation()

  const emulations = data?.data.items || []

  // === Handlers ===
  const handleNavigate = (id: string) => router.push(`/${locale}/workspace-3d/${id}`)

  const handleCreateEmulation = async (metadata: any) => {
    toast.info('⏳ Đang tạo workspace mới...')

    try {
      const res = await createEmulation({
        body: {
          name: metadata.name,
          description: metadata.description,
          visibility: 'private',
          definition_json: {},
          thumbnail_file_name: metadata.thumbnail_file_name,
          thumbnail_image_base64: metadata.thumbnail_image_base64
        }
      }).unwrap()

      if (res) {
        toast.success('✅ Đã tạo workspace mới!')
        setShowCreateDialog(false)
      }
    } catch (error) {
      toast.error('❌ Tạo workspace thất bại.')
      console.error(error)
    }
  }

  if (isLoading) {
    return <div className='py-10 text-center text-gray-500'>Đang tải danh sách mô hình...</div>
  }

  // === Empty state ===
  if (emulations.length === 0) {
    return (
      <main className='bg-light min-h-screen'>
        <div className='flex justify-end'>
          <Button variant='outline' size='sm' onClick={() => setShowCreateDialog(true)}>
            Create new
          </Button>
        </div>
        <SEmpty
          title='Không tìm thấy mô hình nào'
          description='Hãy thử lại sau'
          icon={<Bot className='h-8 w-8 text-white' />}
        />
        {showCreateDialog && (
          <ExportDialog onClose={() => setShowCreateDialog(false)} onExport={handleCreateEmulation} />
        )}
      </main>
    )
  }

  // === Main content ===
  return (
    <main className='bg-light min-h-screen'>
      {/* Header actions */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='space-x-2'></div>
        <Button variant='outline' size='sm' onClick={() => setShowCreateDialog(true)}>
          Create new
        </Button>
      </div>

      {/* Model list */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {emulations.map((e) => (
          <Card
            key={e.emulationId}
            onClick={() => handleNavigate(e.emulationId)}
            className='group cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-200'
          >
            <CardContent className='p-0'>
              {/* Thumbnail */}
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
                <Image
                  src={e.thumbnailUrl || '/images/shape.png'}
                  alt={e.name}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                />
              </div>

              {/* Content */}
              <div className='p-4 text-center'>
                <h3 className='text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600'>
                  {e.name}
                </h3>
                <p className='mt-1 line-clamp-2 text-xs text-gray-500'>{e.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showCreateDialog && <ExportDialog onClose={() => setShowCreateDialog(false)} onExport={handleCreateEmulation} />}
    </main>
  )
}
