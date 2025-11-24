'use client'
import React, { useState } from 'react'
import { Camera, Edit, Save } from 'lucide-react'
import { Input } from '@/components/shadcn/input'
import { useModal } from '@/providers/ModalProvider'
import { useSession } from 'next-auth/react'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import Image from 'next/image'
import { Button } from '@/components/shadcn/button'
import { useGetUserByIdQuery } from '@/features/user/api/userApi'
import { useTranslations } from 'next-intl'

export default function ProfileDetails() {
  const { data: session, status } = useSession()

  const t = useTranslations('profile')
  const tc = useTranslations('common')

  const { data: userData } = useGetUserByIdQuery(session?.user.userId as string, {
    skip: !session?.user?.userId
  })

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: userData?.data.firstName || '',
    lastName: userData?.data.lastName || '',
    website: '',
    bio: ''
  })
  const { openModal } = useModal()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    console.log('Profile data:', formData)
    // Handle save logic here
  }

  if (status === 'loading') {
    return (
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
        <LoadingComponent size={18} textShow={false} />
      </div>
    )
  }

  return (
    <div className='mb-50 flex-1'>
      {/* Cover Photo Section */}
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm'>
        {/* Cover Photo */}
        <div className='relative h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 sm:h-64'>
          <img
            src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'
            alt='Cover'
            className='h-full w-full object-cover'
          />
          <button className='absolute top-4 right-4 flex items-center space-x-2 rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 backdrop-blur-sm transition-colors hover:bg-white'>
            <Edit onClick={() => openModal('image')} className='h-4 w-4' />
            <span className='hidden sm:inline'>{tc('button.editCoverPhoto')}</span>
          </button>
        </div>

        {/* Profile Info Section */}
        <div className='relative px-6 pb-6'>
          {/* Avatar */}
          <div className='relative -mt-16 mb-4 sm:-mt-20'>
            <Image
              width={160}
              height={160}
              src={session?.user?.image || 'https://github.com/shadcn.png'}
              alt='Profile'
              className='h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-lg sm:h-40 sm:w-40'
            />
            <button
              onClick={() => openModal('image')}
              className='absolute -bottom-2 left-28 rounded-full bg-gray-800 p-2 text-white shadow-lg transition-colors hover:bg-gray-700'
            >
              <Camera className='h-4 w-4' />
            </button>
          </div>

          {/* Profile Header */}
          <div className='mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center'>
            <div className='mb-4 sm:mb-0'>
              <h1 className='text-2xl font-bold text-gray-900 sm:text-3xl'>{session?.user?.name}</h1>
              <p className='text-sm text-gray-600 sm:text-base'>{t('description')}s</p>
            </div>
          </div>

          {/* Form */}
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Left Column */}
            <div className='space-y-6'>
              {/* Username */}
              <div>
                <label htmlFor='username' className='mb-2 block text-sm font-medium text-gray-700'>
                  {t('username')}
                </label>
                <Input
                  type='text'
                  id='username'
                  name='username'
                  value={session?.user?.userName || ''}
                  placeholder={t('placeholders.username')}
                  readOnly
                />
              </div>
              {/* First Name */}
              <div>
                <label htmlFor='firstName' className='mb-2 block text-sm font-medium text-gray-700'>
                  {t('firstName')}
                </label>
                <Input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={userData?.data.firstName || ''}
                  onChange={handleInputChange}
                  placeholder={t('placeholders.firstName')}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              {/* Email */}
              <div>
                <label htmlFor='email' className='mb-2 block text-sm font-medium text-gray-700'>
                  {t('email')}
                </label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  value={session?.user?.email || ''}
                  placeholder={t('placeholders.email')}
                  readOnly
                />
              </div>
              {/* Last Name */}
              <div>
                <label htmlFor='lastName' className='mb-2 block text-sm font-medium text-gray-700'>
                  {t('lastName')}
                </label>
                <Input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={userData?.data.lastName || ''}
                  onChange={handleInputChange}
                  placeholder={t('placeholders.lastName')}
                />
              </div>
            </div>
          </div>

          {/* Bio Section - Full Width */}
          <div className='mt-6'>
            <label htmlFor='bio' className='mb-2 block text-sm font-medium text-gray-700'>
              {t('bio')}
            </label>
            <textarea
              id='bio'
              name='bio'
              value={formData.bio}
              onChange={handleInputChange}
              placeholder={t('placeholders.bio')}
              rows={4}
              className='flex min-h-[80px] w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
            />
          </div>
          <div className='my-5 flex gap-3'>
            <Button
              onClick={handleSave}
              className='bg-sky-custom-600 flex w-full items-center justify-center space-x-2 rounded-lg p-4 text-white transition-colors sm:w-auto'
            >
              <Save className='h-4 w-4' />
              <span>{tc('button.saveChanges')}</span>
            </Button>
            <Button
              onClick={handleSave}
              className='text-sky-custom-600 flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-200 p-4 transition-colors sm:w-auto'
            >
              <span>{tc('button.cancel')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
