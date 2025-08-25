import React from 'react';
import { User, Settings, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

// Sidebar Component
export default function ProfileSideBar() {
  const t = useTranslations('profile')
  const sidebarItems = [
    { icon: User, label: `${t('settings.profile')}`, active: true },
    { icon: Settings, label: `${t('settings.account')}`, active: false },
    { icon: Bell, label: `${t('settings.notifications')}`, active: false },
    { icon: Lock, label: `${t('settings.privacy')}`, active: false },
    { icon: HelpCircle, label: `${t('settings.help')}`, active: false },
    { icon: LogOut, label: `${t('settings.signout')}`, active: false },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('title')}</h3>
        <nav className="space-y-1">
          {sidebarItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

