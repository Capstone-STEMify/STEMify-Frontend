import LanguageSwitcher from '@/components/layout/header/LanguageSwitcher'
import { Button } from '@/components/shadcn/button'
import BackButton from '@/components/shared/button/BackButton'
import { useExportAssembly } from '@/features/creator-3d/hooks/creator-3d-helper'
import { useLocale, useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

export default function Creator3DHeader() {
  const { workspaceId } = useParams()
  const locale = useLocale()
  const t3d = useTranslations('creator3D')
  const exportAssemblyFn = useExportAssembly()

  function downloadJsonFile(filename: string, jsonData: any) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = url
    a.download = filename
    a.click()

    URL.revokeObjectURL(url)
  }

  const handleExportToJSON = useCallback(() => {
    const exportData = exportAssemblyFn({
      title: `Assembly_${workspaceId}`,
      description: 'Exported assembly JSON',
      author: 'STEMify User'
    })

    downloadJsonFile(`assembly_${workspaceId}.json`, exportData)
    toast.success('📦 Export JSON thành công!')
  }, [workspaceId, exportAssemblyFn])

  return (
    <div className='flex-shrink-0 border-b bg-white px-6 py-4 shadow-sm'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <BackButton />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{t3d('header.title')}</h1>
            <p className='text-sm text-gray-600'>{t3d('header.subtitle')}</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Button className='bg-blue-600 hover:bg-blue-700' onClick={handleExportToJSON}>
            {t3d('header.export')}
          </Button>
        </div>
      </div>
    </div>
  )
}
