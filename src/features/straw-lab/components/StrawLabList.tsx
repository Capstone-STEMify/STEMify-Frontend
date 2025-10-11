'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Heart, Star, Play, Settings, Bot, Car, Radar, Award, Music, Eye, Cpu, Wrench, Zap } from 'lucide-react'
import SEmpty from '@/components/shared/empty/SEmpty'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Badge } from '@/components/shadcn/badge'
import { supabase } from '@/libs/supabase/client'
import { useExportAssembly } from '@/features/creator-3d/hooks/creator-3d-helper'
import { ExportDialog } from '@/features/creator-3d/components/creator3d/ExportDialog'
import { toast } from 'sonner'

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

export default function StrawLabList() {
  const exportAssemblyFn = useExportAssembly()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [creating, setCreating] = useState(false)
  const locale = useLocale()
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const router = useRouter()
  const [models, setModels] = useState<ModelItem[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('assembly_data')
        .select('id, name, description, category, image_url, rating, is_available')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching models:', error)
        setLoading(false)
        return
      }

      setModels(data || [])
      setLoading(false)
    }

    fetchModels()
  }, [])

  const filteredModels =
    selectedCategory === 'Tất cả' ? models : models.filter((model) => model.category === selectedCategory)

  const handleNavigate = (id: number) => {
    router.push(`/${locale}/workspace-3d/${id}`)
  }
  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const handleCreateNew = async () => {
    try {
      // 🧱 Xuất workspace trống
      const emptyData = exportAssemblyFn({
        title: 'Untitled Project',
        description: 'New empty workspace',
        author: 'System'
      })

      // 🗄️ Lưu lên Supabase
      const { data, error } = await supabase
        .from('assembly_data')
        .insert([
          {
            name: 'Untitled Project',
            description: 'New empty workspace',
            category: 'Tự tạo',
            image_url: '/images/shape.png',
            is_available: true,
            data: emptyData
          }
        ])
        .select('id')
        .single()

      if (error) {
        console.error('❌ Error creating new workspace:', error)
        alert('Không thể tạo workspace mới.')
        return
      }

      router.push(`/${locale}/workspace-3d/${data.id}`)
    } catch (err) {
      console.error('Error:', err)
      alert('Đã xảy ra lỗi khi tạo workspace mới.')
    }
  }

  if (loading) return <div className='py-10 text-center text-gray-500'>Đang tải danh sách mô hình...</div>
  return (
    <div>
      {/* Main Content with rounded background */}
      <main className='container mx-auto p-4'>
        <div className='bg-white'>
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
            {filteredModels.map((model) => (
              <Card
                key={model.id}
                className='group transform cursor-pointer overflow-hidden border-0 bg-white p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-200'
                onClick={() => {
                  if (model.is_available) handleNavigate(model.id)
                }}
              >
                <CardContent className='p-0'>
                  <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-lg'>
                    <button
                      onClick={() => toggleFavorite(model.id)}
                      className='absolute top-2 right-2 z-10 rounded-full bg-white/20 p-1 backdrop-blur-sm transition-colors hover:bg-white/30'
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(model.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                      />
                    </button>

                    {/* Image */}
                    <Image
                      src={model.image_url || '/images/shape.png'}
                      alt={model.name}
                      fill
                      className='object-cover transition-transform duration-300'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    />

                    {/* Rating */}
                    {model.rating && (
                      <div className='absolute right-2 bottom-2 z-10 flex items-center space-x-1 rounded-full bg-black/40 px-2 py-1 text-white backdrop-blur-sm'>
                        <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                        <span className='text-xs font-medium'>{model.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className='p-4'>
                    <h3 className='text-center text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600'>
                      {model.name}
                    </h3>
                    <p className='mt-1 line-clamp-2 text-center text-xs text-gray-500'>{model.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredModels.length === 0 && (
            <SEmpty
              title='Không tìm thấy model nào'
              description='Hãy liên hệ hỗ trợ'
              icon={<Bot className='h-8 w-8 text-white' />}
            />
          )}
        </div>

        {showCreateDialog && (
          <ExportDialog
            onClose={() => setShowCreateDialog(false)}
            onExport={async (metadata) => {
              try {
                setCreating(true)
                toast.info('⏳ Đang tạo workspace mới...')

                // 🧱 export dữ liệu rỗng
                const emptyData = exportAssemblyFn(metadata)

                // 🗄️ Insert vào Supabase
                const { data, error } = await supabase
                  .from('assembly_data')
                  .insert([
                    {
                      name: metadata.title,
                      description: metadata.description,
                      author: metadata.author,
                      category: metadata.category,
                      image_url: '/images/shape.png',
                      is_available: true,
                      data: emptyData
                    }
                  ])
                  .select('id')
                  .single()

                if (error) throw error

                toast.success('✅ Đã tạo workspace mới!')
                setShowCreateDialog(false)

                router.push(`/${locale}/workspace-3d/${data.id}`)
              } catch (err: any) {
                console.error('❌ Create new workspace error:', err)
                toast.error(err.message || 'Lỗi khi tạo workspace mới.')
              } finally {
                setCreating(false)
              }
            }}
          />
        )}
      </main>
    </div>
  )
}
