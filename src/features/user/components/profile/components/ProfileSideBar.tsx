import React from 'react'
import { User, Settings, Bell, Lock, HelpCircle, LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Sidebar Component
export default function ProfileSideBar() {
  const t = useTranslations('profile')
  const sidebarItems = [
    { icon: User, label: `${t('settings.profile')}`, active: true }
    // { icon: Settings, label: `${t('settings.account')}`, active: false },
    // { icon: Bell, label: `${t('settings.notifications')}`, active: false },
    // { icon: Lock, label: `${t('settings.privacy')}`, active: false },
    // { icon: HelpCircle, label: `${t('settings.help')}`, active: false },
    // { icon: LogOut, label: `${t('settings.signout')}`, active: false },
  ]

  return (
    <div className='flex-shrink-0 lg:w-64'>
      <div className='rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>{t('title')}</h3>
        <nav className='space-y-1'>
          {sidebarItems.map((item, index) => {
            const IconComponent = item.icon
            return (
              <button
                key={index}
                className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  item.active ? 'border border-blue-200 bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className='h-4 w-4' />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
