'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Heart, Star, Bot } from 'lucide-react'
import SEmpty from '@/components/shared/empty/SEmpty'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Badge } from '@/components/shadcn/badge'
import { supabase } from '@/libs/supabase/client'
import { useExportAssembly } from '@/features/creator-3d/hooks/creator-3d-helper'
import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { toast } from 'sonner'
import { useCreateEmulatorMutation, useSearchEmulationsQuery } from '@/features/emulator/api/emulatorApi'
import { fileToBase64 } from '@/utils/index'

interface ModelItem {
  id: number
  name: string
  category: string
  description: string
  image_url: string
  rating?: number
  is_available: boolean
}

const categories = ['Tất cả', 'Hình học', 'Cảm biến', 'Robot', 'Phương tiện', 'Chơi game', 'Âm nhạc']

export default function StrawLabProject() {
  const exportAssemblyFn = useExportAssembly()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const locale = useLocale()
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const router = useRouter()

  const { data, isLoading } = useSearchEmulationsQuery({})
  const emulations = data?.data.items || []

  const [createEmulation, { isLoading: isCreating }] = useCreateEmulatorMutation()

  const handleNavigate = (id: string) => {
    router.push(`/${locale}/workspace-3d/${id}`)
  }

  if (emulations.length === 0) {
    return (
      <SEmpty
        title='Không tìm thấy mô hình nào'
        description='Hãy thử lại sau'
        icon={<Bot className='h-8 w-8 text-white' />}
      />
    )
  }

  if (isLoading) return <div className='py-10 text-center text-gray-500'>Đang tải danh sách mô hình...</div>
  return (
    <div>
      {/* Main Content with rounded background */}
      <main className='bg-light min-h-screen'>
        <div>
          {/* Tab Navigation */}
          <div className='mb-6'>
            <div className='flex justify-between'>
              <div className='space-x-2'>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? 'scale-105 transform rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'rounded-full border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div>
                <Button variant='outline' size='sm' onClick={() => setShowCreateDialog(true)}>
                  Create new
                </Button>
              </div>
            </div>
          </div>

          {/* Models Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {emulations.map((e) => (
              <Card
                key={e.emulationId}
                className='group transform cursor-pointer overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-200'
                onClick={() => {
                  handleNavigate(e.emulationId)
                }}
              >
                <CardContent className='p-0'>
                  <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
                    <Image
                      src={e.thumbnailUrl || '/images/shape.png'}
                      alt={e.name}
                      fill
                      className='object-cover transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    />
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    <h3 className='text-center text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600'>
                      {e.name}
                    </h3>
                    <p className='mt-1 line-clamp-2 text-center text-xs text-gray-500'>{e.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {showCreateDialog && (
          <ExportDialog
            onClose={() => setShowCreateDialog(false)}
            onExport={async (metadata) => {
              toast.info('⏳ Đang tạo workspace mới...')

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
            }}
          />
        )}
      </main>
    </div>
  )
}
