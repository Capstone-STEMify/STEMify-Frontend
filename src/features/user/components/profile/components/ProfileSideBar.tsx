import React from 'react';
import { User, Settings, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';

// Sidebar Component
export default function ProfileSideBar() {
  const sidebarItems = [
    { icon: User, label: 'Profile Information', active: true },
    { icon: Settings, label: 'Account Settings', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Lock, label: 'Privacy & Security', active: false },
    { icon: HelpCircle, label: 'Help & Support', active: false },
    { icon: LogOut, label: 'Sign Out', active: false },
  ];

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
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

