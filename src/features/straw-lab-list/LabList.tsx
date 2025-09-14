'use client'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/shadcn/card'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import {
  Heart,
  Star,
  Play,
  Settings,
  Bot,
  Car,
  Radar,
  Award,
  Music,
  Eye,
  Cpu,
  Wrench,
  Zap,
} from 'lucide-react'

interface ModelItem {
  id: number
  name: string
  category: string
  description: string
  bgColor: string
  icon: React.ReactNode
  isFavorite?: boolean
  rating?: number
}

const models: ModelItem[] = [
  {
    id: 1,
    name: 'Race Against Time',
    category: 'Racing',
    description: 'Chiếc xe đua tốc độ với cảm biến thời gian',
    bgColor: 'bg-gradient-to-br from-pink-400 via-red-400 to-pink-500',
    icon: <Car className='h-8 w-8' />,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Bus Assistant',
    category: 'Transport',
    description: 'Trợ lý thông minh cho xe buýt',
    bgColor: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500',
    icon: <Bot className='h-8 w-8' />,
    rating: 4.6
  },
  {
    id: 3,
    name: 'Sonar Radar',
    category: 'Sensor',
    description: 'Hệ thống radar siêu âm thông minh',
    bgColor: 'bg-gradient-to-br from-green-400 via-emerald-400 to-green-500',
    icon: <Radar className='h-8 w-8' />,
    rating: 4.9
  },
  {
    id: 4,
    name: 'Big Prize Wheel',
    category: 'Game',
    description: 'Bánh xe may mắn với nhiều giải thưởng',
    bgColor: 'bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500',
    icon: <Award className='h-8 w-8' />,
    rating: 4.7
  },
  {
    id: 5,
    name: 'Air Guitar',
    category: 'Music',
    description: 'Đàn guitar không dây công nghệ cao',
    bgColor: 'bg-gradient-to-br from-purple-400 via-indigo-400 to-purple-500',
    icon: <Music className='h-8 w-8' />,
    rating: 4.5
  },
  {
    id: 6,
    name: 'AGV Car',
    category: 'Autonomous',
    description: 'Xe tự hành thông minh AGV',
    bgColor: 'bg-gradient-to-br from-red-400 via-pink-400 to-red-500',
    icon: <Car className='h-8 w-8' />,
    rating: 4.8
  },
  {
    id: 7,
    name: 'AGV Car - Line Patrol System',
    category: 'Autonomous',
    description: 'Hệ thống tuần tra theo đường kẻ',
    bgColor: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500',
    icon: <Settings className='h-8 w-8' />,
    rating: 4.6
  },
  {
    id: 8,
    name: 'Robotic Arms',
    category: 'Robotics',
    description: 'Cánh tay robot đa năng',
    bgColor: 'bg-gradient-to-br from-green-400 via-teal-400 to-green-500',
    icon: <Wrench className='h-8 w-8' />,
    rating: 4.9
  },
  {
    id: 9,
    name: 'Transforming Robot',
    category: 'Robotics',
    description: 'Robot biến hình đa chức năng',
    bgColor: 'bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500',
    icon: <Zap className='h-8 w-8' />,
    rating: 4.8
  },
  {
    id: 10,
    name: 'uKit Explore Box',
    category: 'Educational',
    description: 'Hộp khám phá công nghệ uKit',
    bgColor: 'bg-gradient-to-br from-indigo-400 via-purple-400 to-indigo-500',
    icon: <Cpu className='h-8 w-8' />,
    rating: 4.7
  },
  {
    id: 11,
    name: 'Air Electric Guitar',
    category: 'Music',
    description: 'Guitar điện tử không dây cao cấp',
    bgColor: 'bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500',
    icon: <Music className='h-8 w-8' />,
    rating: 4.6
  },
  {
    id: 12,
    name: 'Eye See You',
    category: 'Vision',
    description: 'Hệ thống nhận dạng thị giác AI',
    bgColor: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500',
    icon: <Eye className='h-8 w-8' />,
    rating: 4.9
  }
]

const categories = [
  'Tất cả',
  'Racing',
  'Transport',
  'Sensor',
  'Game',
  'Music',
  'Autonomous',
  'Robotics',
  'Educational',
  'Vision'
]

export default function StrawLabList() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const filteredModels =
    selectedCategory === 'Tất cả' ? models : models.filter((model) => model.category === selectedCategory)

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <div className='mb-4 flex items-center space-x-3'>
            <h2 className='text-lg font-semibold text-gray-800'>Models</h2>
            <Badge className='bg-gradient-to-r from-blue-500 to-purple-600 text-white'>Stemify Advanced Builds</Badge>
          </div>

          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size='sm'
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? 'scale-105 transform bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'border-gray-200 bg-white/70 text-gray-700 backdrop-blur-sm hover:border-blue-300 hover:bg-blue-50'
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6'>
          {filteredModels.map((model) => (
            <Card
              key={model.id}
              className='group transform overflow-hidden border-0 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl'
            >
              <CardContent className='p-0'>
                {/* Model Image/Icon Area */}
                <div className={`${model.bgColor} relative flex h-48 items-center justify-center overflow-hidden`}>
                  {/* Decorative elements */}
                  <div className='absolute top-2 right-2 h-8 w-8 animate-pulse rounded-full bg-white/20'></div>
                  <div className='absolute bottom-4 left-4 h-6 w-6 animate-pulse rounded-full bg-white/30 delay-300'></div>
                  <div className='absolute top-1/2 left-2 h-4 w-4 animate-pulse rounded-full bg-white/25 delay-700'></div>

                  {/* Main Icon */}
                  <div className='text-white transition-transform duration-300 group-hover:scale-110'>{model.icon}</div>

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(model.id)}
                    className='absolute top-3 right-3 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-colors hover:bg-white/30'
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.has(model.id) ? 'fill-red-500 text-red-500' : 'text-white'}`}
                    />
                  </button>

                  {/* Rating */}
                  {model.rating && (
                    <div className='absolute right-3 bottom-3 flex items-center space-x-1 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm'>
                      <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                      <span className='text-xs font-medium text-white'>{model.rating}</span>
                    </div>
                  )}
                </div>

                {/* Model Info */}
                <div className='flex item-center justify-center p-4'>
                    <h3 className='mb-1 text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600'>
                      {model.name}
                    </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredModels.length === 0 && (
          <div className='py-16 text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600'>
              <Bot className='h-8 w-8 text-white' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>Không tìm thấy model nào</h3>
            <p className='text-gray-600'>Thử chọn danh mục khác hoặc quay lại xem tất cả models</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='mt-16 border-t border-white/20 bg-white/80 backdrop-blur-md'>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center'>
            <p className='mb-2 text-gray-600'>🤖 Khám phá thế giới stem với Stemify Advanced Builds</p>
            <p className='text-sm text-gray-500'>Tạo, học hỏi và phát triển cùng công nghệ tương lai</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
