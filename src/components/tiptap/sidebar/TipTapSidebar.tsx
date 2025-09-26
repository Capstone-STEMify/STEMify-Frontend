'use client'

import { useState } from 'react'
import { PanelContent, PanelKey, sidebarItems } from '@/features/resource/content/components/sidebar/panel/PanelContent'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { useIsMobile } from '@/hooks/use-mobile'
export default function TipTapSidebar() {
  const [activePanel, setActivePanel] = useState<PanelKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useIsMobile()

  const togglePanel = (key: PanelKey) => {
    setActivePanel(activePanel === key ? null : key)
    if (isMobile) setMobileOpen(false)
  }

  return (
    <div className='relative h-full flex-shrink-0'>
      {/* Nút mở trên mobile */}
      <button
        className='absolute top-2 left-2 z-20 rounded bg-gray-200 p-2 md:hidden'
        onClick={() => setMobileOpen(true)}
      >
        <IconMenu2 size={20} />
      </button>

      {/* Sidebar desktop */}
      <aside
        className={`hidden h-full transition-all duration-300 ease-in-out md:flex ${
          activePanel ? 'w-96' : 'w-18'
        } border-r`}
      >
        {/* Cột icon */}
        <ul className='flex flex-col items-center gap-2 border-r bg-gradient-to-b from-sky-50 to-emerald-50 p-2'>
          {sidebarItems.map(({ key, icon: Icon, label }) => (
            <li key={key}>
              <button
                className={`flex w-14 flex-col items-center gap-1 rounded p-2 hover:bg-blue-100 ${
                  activePanel === key ? 'text-sky-custom-600' : ''
                }`}
                onClick={() => togglePanel(key)}
              >
                <Icon size={20} />
                <span className='text-[10px]'>{label}</span>
              </button>
            </li>
          ))}
        </ul>

        {activePanel && (
          <div className='flex-1 overflow-auto p-4'>
            <PanelContent activePanel={activePanel} />
          </div>
        )}
      </aside>

      {/* Sidebar mobile */}
      {mobileOpen && (
        <div className='fixed inset-0 z-30 flex'>
          <div className='flex-1 bg-black/40' onClick={() => setMobileOpen(false)} />
          <div className='relative w-64 bg-gray-50 p-4 dark:bg-gray-900'>
            <button className='absolute top-2 right-2 rounded bg-gray-200 p-1' onClick={() => setMobileOpen(false)}>
              <IconX size={18} />
            </button>

            <ul className='mt-6 space-y-2'>
              {sidebarItems.map(({ key, icon: Icon, label }) => (
                <li key={key}>
                  <button
                    className={`flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-gray-200 ${
                      activePanel === key ? 'bg-gray-300' : ''
                    }`}
                    onClick={() => togglePanel(key)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>

            {activePanel && (
              <div className='flex flex-1 flex-col bg-white'>
                <div className='flex-1 overflow-auto p-4'>
                  <PanelContent activePanel={activePanel} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
