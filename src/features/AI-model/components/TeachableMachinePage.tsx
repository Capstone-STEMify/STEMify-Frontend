'use client'

import { useCallback, useState } from 'react'

import { PredictionResults } from '@/features/AI-model/components/PredictionResults'
import { CameraOverlay } from '@/features/AI-model/components/CameraOverlay'
import { useTeachableMachine } from '@/features/AI-model/UseTeachableMachine'
import { ClassManagement } from '@/features/AI-model/components/ClassManagement'
import { TrainingSection } from '@/features/AI-model/components/TrainingSection'
import { ModelExport } from '@/features/AI-model/components/ModelExport'
import { CameraTest } from '@/features/AI-model/components/CameraTest'
import * as tf from '@tensorflow/tfjs'
import { ArrowDownCircle, ArrowRightCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function TeachableMachinePage() {
  const t = useTranslations('agent.modelMaker')
  const {
    classes,
    classImages,
    model,
    isTraining,
    trainingProgress,
    trainingStatus,
    addNewClass,
    renameClass,
    removeClass,
    updateImagePreview,
    removeImage,
    trainModel,
    downloadModel,
    analyzeImage
  } = useTeachableMachine(['Class 1', 'Class 2'])

  const [showCamera, setShowCamera] = useState(false)
  const [currentCameraClass, setCurrentCameraClass] = useState<string | null>(null)
  const [predictionResults, setPredictionResults] = useState<any[]>([])

  const handleOpenCamera = (className?: string) => {
    setCurrentCameraClass(className || null)
    setShowCamera(true)
  }

  const handleCloseCamera = () => {
    setShowCamera(false)
    setCurrentCameraClass(null)
  }

  const handleCapturePhoto = (imageDataUrl: string) => {
    if (currentCameraClass) {
      // Add to training class
      updateImagePreview(currentCameraClass, imageDataUrl)
    } else {
      // Test image
      analyzeImage(imageDataUrl)
    }
  }
  const handleRealtimePredict = useCallback(
    async (frame: string) => {
      if (!model) {
        console.warn('Model chưa được train — chưa thể predict realtime')
        return
      }

      try {
        const img = new Image()
        img.src = frame

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Không thể lấy context của canvas')

        canvas.width = 224
        canvas.height = 224
        ctx.drawImage(img, 0, 0, 224, 224)

        const tensor = tf.browser.fromPixels(canvas).div(255.0).expandDims(0)
        const results = await model.predict(tensor)
        setPredictionResults(results)
        await tf.nextFrame()

        tensor.dispose()
      } catch (error) {
        console.error('Lỗi khi predict realtime:', error)
      }
    },
    [model]
  )

  return (
    <div className='mx-auto min-h-screen max-w-6xl bg-slate-50 py-10'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold text-blue-500'>{t('title')}</h1>
        <p className='max-w-2xl text-xl font-semibold text-gray-700'>
          {t('description')}
        </p>
      </div>

      <div className='space-y-16'>
        {/* STEP 1: Create Classes */}
        <section>
          <ClassManagement
            classes={classes}
            classImages={classImages}
            onAddNewClass={addNewClass}
            onOpenCamera={handleOpenCamera}
            onRemoveImage={removeImage}
            onEditClassName={renameClass}
            onRemoveClass={removeClass}
          />
        </section>

        {/* STEP 2: Training */}
        <section>
          <div className='flex flex-col items-center justify-center gap-10 md:flex-row'>
            <div className='w-full md:w-1/2'>
              <TrainingSection
                isTraining={isTraining}
                trainingProgress={trainingProgress}
                trainingStatus={trainingStatus}
                onTrain={trainModel}
              />
            </div>
          </div>
        </section>

        {/* STEP 3: Test with Camera */}
        <section>
          <CameraTest
            onPredict={handleRealtimePredict}
            results={predictionResults}
            model={model}
            onDownload={downloadModel}
          />
        </section>
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <CameraOverlay onClose={handleCloseCamera} onCapture={handleCapturePhoto} currentClass={currentCameraClass} />
      )}
    </div>
  )
}
