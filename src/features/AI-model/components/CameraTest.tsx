'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shadcn/card'
import { Button } from '@/components/shadcn/button'
import { Camera, Download } from 'lucide-react'
import { PredictionResults } from './PredictionResults'
import { CameraOverlay } from './CameraOverlay'
import { cn } from '@/utils/shadcn/utils'
import { useTranslations } from 'next-intl'

interface CameraTestProps {
  onPredict: (frame: string) => void
  results?: any
  onDownload: () => void
  model: any
}

export function CameraTest({ onPredict, results, onDownload, model }: CameraTestProps) {
  const t = useTranslations('agent.modelMaker.model')
  const tc = useTranslations('common')
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  return (
    <Card className='border-2 border-gray-200 py-4 shadow-md'>
      <CardHeader>
        <CardTitle className='mb-2 text-xl'>
          <div className='flex justify-between'>
            <p>{t('testModel')}</p>
            <Button onClick={onDownload} disabled={!model} className='bg-sky-100 text-blue-500'>
              <Download /> {t('export')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!isCameraOpen ? (
          // === Chưa mở camera ===
          <div className='flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-5 transition-all hover:border-[#4facfe] hover:bg-blue-50/50'>
            <Button
              onClick={() => setIsCameraOpen(true)}
              className='mb-2.5 bg-sky-100 px-8 py-6 text-blue-500 hover:bg-sky-200'
            >
              <Camera className='mr-2 h-5 w-5' />
              {tc('button.camera')}
            </Button>
            <p className='text-center text-sm text-gray-500'>{t('tesDes')}</p>
          </div>
        ) : (
          // === Đã mở camera ===
          <div className='flex flex-col gap-6 md:flex-row'>
            {/* LEFT: Camera */}
            <div className='flex-1 rounded-xl border border-gray-200 bg-black/5 p-3'>
              <CameraOverlay inline onClose={() => setIsCameraOpen(false)} onPredict={onPredict} />
            </div>

            {/* RIGHT: Prediction Results */}
            <div
              className={cn(
                'flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all',
                !results && 'flex items-center justify-center text-gray-400'
              )}
            >
              {results ? (
                <PredictionResults results={results} />
              ) : (
                <p className='text-center text-sm italic'>{t('identify')}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
