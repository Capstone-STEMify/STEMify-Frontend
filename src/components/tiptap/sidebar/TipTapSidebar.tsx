'use client'

import { useState } from 'react'
import { PanelContent, PanelKey, sidebarItems } from '@/features/resource/content/components/sidebar/panel/PanelContent'
import BackButton from '@/components/shared/button/BackButton'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'

export default function TipTapSidebar() {
  const dispatch = useAppDispatch()
  const activePanel = useAppSelector((state) => state.tiptap.activePanel)

  const togglePanel = (key: PanelKey) => {
    dispatch(setActivePanel(activePanel === key ? null : key))
  }

  return (
    <aside className={`flex h-full border-r transition-all duration-300 ease-in-out ${activePanel ? 'w-96' : 'w-18'}`}>
      {/* Cột icon: chỉ chiếm không gian cần thiết */}
      <div className='flex flex-shrink-0 flex-col items-center gap-2 border-r bg-gradient-to-b from-sky-50 to-emerald-50 p-2'>
        <div>
          <BackButton className='border' />
        </div>
        <ul>
          {sidebarItems
            .filter((item) => item.key !== 'imageAssetDetail')
            .map(({ key, icon: Icon, label }) => (
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
      </div>
      {/* Panel content: chiếm phần còn lại */}
      {activePanel && (
        <div className='flex-1 overflow-auto'>
          <PanelContent />
        </div>
      )}
    </aside>
  )
}
