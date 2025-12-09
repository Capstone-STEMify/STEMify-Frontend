'use client'

import { useState } from 'react'
import { PanelContent, PanelKey, sidebarItems } from '@/features/resource/content/components/sidebar/panel/PanelContent'
import BackButton from '@/components/shared/button/BackButton'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setActivePanel } from '@/components/tiptap/slice/tiptapSlice'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

export default function TipTapSidebar() {
  const tContent = useTranslations('content')
  const dispatch = useAppDispatch()
  const activePanel = useAppSelector((state) => state.tiptap.activePanel)
  const locale = useLocale()
  const { lessonId, sectionId, contentId } = useParams()

  const togglePanel = (key: PanelKey) => {
    if (activePanel === key) {
      dispatch(setActivePanel({ panel: null as any }))
    } else {
      dispatch(setActivePanel({ panel: key }))
    }
  }

  return (
    <aside className={`flex h-full border-r transition-all duration-300 ease-in-out ${activePanel ? 'w-96' : 'w-18'}`}>
      <div className='flex flex-shrink-0 flex-col items-center gap-2 border-r bg-gradient-to-b from-sky-50 to-emerald-50 p-2'>
        <div>
          <BackButton className='border' url={`/${locale}/admin/lesson/${lessonId}/pacing-guide`} />
        </div>
        <ul>
          {sidebarItems
            .filter((item) => item.key !== 'assetDetail')
            .map(({ key, icon: Icon, label }) => (
              <li key={key}>
                <button
                  className={`flex w-14 flex-col items-center gap-1 rounded p-2 hover:bg-blue-100 ${
                    activePanel === key ? 'text-sky-custom-600' : ''
                  }`}
                  onClick={() => togglePanel(key)}
                >
                  <Icon size={20} />
                  <span className='text-[10px]'>{tContent(label.toLowerCase())}</span>
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
