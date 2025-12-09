

















'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Bot, MoreVertical } from 'lucide-react'

import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import SEmpty from '@/components/shared/empty/SEmpty'

import {
  useDeleteEmulatorMutation,
  useSearchEmulationsQuery,
  useUpdateEmulatorMutation
} from '@/features/emulator/api/emulatorApi'
import BackButton from '@/components/shared/button/BackButton'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { EmulatorStatus, EmulatorWithThumbnail } from '@/features/emulator/types/emulator.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import { useModal } from '@/providers/ModalProvider'
import { UserRole } from '@/types/userRole'
import SearchBar from '@/components/shared/search/SearchBar'
import SSelect from '@/components/shared/SSelect'

export default function Workspace3dLibrary() {
  const { openModal } = useModal()
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('common')
  const tt = useTranslations('toast')
  const t3d = useTranslations('workspace3D')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const userRole = useAppSelector((state) => state.auth.user?.userRole)
  const userId = useAppSelector((state) => state.auth.user?.userId)

  const allowRoles = [UserRole.STAFF, UserRole.ADMIN]
  const statusQuery = statusFilter === 'all' ? undefined : statusFilter

  const { data, isLoading } = useSearchEmulationsQuery({
    page: 1,
    search,
    status: statusQuery as EmulatorStatus | undefined,
    userId: userId
  })
  const [updateEmulation] = useUpdateEmulatorMutation()
  const [deleteEmulation] = useDeleteEmulatorMutation()

  const emulations = data?.data.items || []

  const emulationOtptions = [
    { label: t('status.all'), value: 'all' },
    { label: t('status.published'), value: EmulatorStatus.PUBLISHED },
    { label: t('status.draft'), value: EmulatorStatus.DRAFT },
    { label: t('status.archived'), value: EmulatorStatus.ARCHIVED }
  ]

  // === Handlers ===
  const handleNavigate = (id: string) => router.push(`/${locale}/lab/workspace-3d/${id}`)

  const handlePublishEmulation = async (id: string) => {
    try {
      await updateEmulation({
        emulationId: id,
        body: {
          status: EmulatorStatus.PUBLISHED
        }
      }).unwrap()

      toast.success('Mô hình đã được công khai!')
    } catch (error) {
      toast.error('Thất bại khi công khai mô hình.')
      console.error(error)
    }
  }

  const handleDeleteEmulation = async (emulator: EmulatorWithThumbnail) => {
    openModal('confirm', {
      message: tt('confirmMessage.delete', { title: emulator.name }),
      onConfirm: async () => {
        await deleteEmulation({
          emulationId: emulator.emulationId,
          permanent: true
        }).unwrap()

        toast.success('Đã xóa mô hình!')
      }
    })
  }

  if (isLoading) {
    return <div className='py-10 text-center text-gray-500'>{t3d('loading')}</div>
  }

  // === Empty state ===
  if (emulations.length === 0) {
    return (
      <div className='mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='flex gap-2'>
            <BackButton />
            <h1>{t3d('list.title')}</h1>
          </div>
          <Button variant='outline' size='sm' onClick={() => openModal('upsertEmulator')}>
            {t('button.create')}
          </Button>
        </div>
        <div className='my-4 flex gap-4'>
          <SearchBar onDebouncedSearch={(query) => setSearch(query)} className='w-96' />

          {/* Placeholder for future filters */}
          <SSelect
            placeholder={t('select.placeholder')}
            options={emulationOtptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            className='w-64'
          />
        </div>
        <SEmpty
          title='Không tìm thấy mô hình nào'
          description='Hãy thử lại sau'
          icon={<Bot className='h-8 w-8 text-white' />}
        />
      </div>
    )
  }

  // === Main content ===
  return (
    <div className='mx-auto max-w-7xl p-4 pb-16 sm:px-6 lg:px-8'>
      {/* Header actions */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex gap-2'>
          <BackButton />
          <h1>{t3d('list.title')}</h1>
        </div>
        <Button variant='outline' size='sm' onClick={() => openModal('upsertEmulator')}>
          {t('button.create')}
        </Button>
      </div>
      <div className='my-4 flex gap-4'>
        <SearchBar onDebouncedSearch={(query) => setSearch(query)} className='w-96' />

        {/* Placeholder for future filters */}
        <SSelect
          placeholder={t('select.placeholder')}
          options={emulationOtptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          className='w-64 bg-transparent'
        />
      </div>

      {/* Model list */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {emulations.map((e) => (
          <Card
            key={e.emulationId}
            onClick={() => handleNavigate(e.emulationId)}
            className='group cursor-pointer overflow-hidden border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-200'
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

                {allowRoles.includes(userRole as UserRole) && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant='ghost'
                        className='absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 p-1 shadow-sm backdrop-blur-md hover:bg-white'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className='h-4 w-4 text-gray-700' />
                      </Button>
                    </PopoverTrigger>

                    {/* Popover menu */}
                    <PopoverContent
                      className='w-32 p-2'
                      align='end'
                      sideOffset={4}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className='flex flex-col gap-1 text-sm'>
                        <button
                          className='rounded px-2 py-1 text-left hover:bg-gray-100'
                          onClick={() => openModal('upsertEmulator', { emulationId: e.emulationId })}
                        >
                          {t('button.update')}
                        </button>
                        {e.status !== EmulatorStatus.PUBLISHED && userRole && allowRoles.includes(userRole) && (
                          <button
                            className='rounded px-2 py-1 text-left hover:bg-gray-100'
                            onClick={() => handlePublishEmulation(e.emulationId)}
                          >
                            {t('button.publish')}
                          </button>
                        )}
                        <button
                          className='rounded px-2 py-1 text-left text-red-500 hover:bg-red-100'
                          onClick={() => handleDeleteEmulation(e)}
                        >
                          {t('button.delete')}
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
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
    </div>
  )
}
