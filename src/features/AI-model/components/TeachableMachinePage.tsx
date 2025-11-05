'use client'

import { useState } from 'react'

import { PredictionResults } from '@/features/AI-model/components/PredictionResults'
import { CameraOverlay } from '@/features/AI-model/components/CameraOverlay'
import { useTeachableMachine } from '@/features/AI-model/UseTeachableMachine'
import { AITypeSelector } from '@/features/AI-model/components/AITypeSelector'
import { ClassManagement } from '@/features/AI-model/components/ClassManagement'
import { ImageUpload } from '@/features/AI-model/components/ImageUpload'
import { TrainingSection } from '@/features/AI-model/components/TrainingSection'
import { ModelExport } from '@/features/AI-model/components/ModelExport'
import { CameraTest } from '@/features/AI-model/components/CameraTest'
import { Header } from '@/features/AI-model/components/Header'

export default function TeachableMachinePage() {
  const {
    classes,
    classImages,
    model,
    isTraining,
    trainingProgress,
    trainingStatus,
    predictionResults,
    addNewClass,
    updateImagePreview,
    removeImage,
    trainModel,
    downloadModel,
    analyzeImage
  } = useTeachableMachine(['Class 1', 'Class 2'])

  const [showCamera, setShowCamera] = useState(false)
  const [currentCameraClass, setCurrentCameraClass] = useState<string | null>(null)

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

  return (
    <div className='min-h-screen p-5'>
      <div className='mx-auto max-w-7xl overflow-hidden rounded-3xl'>
        <Header />

        <div className='py-8'>
          {/* Step 2: Create Classes */}
          <div className='mb-10'>
            <ClassManagement
              classes={classes}
              classImages={classImages}
              onAddNewClass={addNewClass}
              onOpenCamera={handleOpenCamera}
              onRemoveImage={removeImage}
            />
          </div>

          {/* Step 3: Upload Images */}
          {/* <div className='mb-10'>
            <ImageUpload
              classes={classes}
              classImages={classImages}
              onOpenCamera={handleOpenCamera}
              onRemoveImage={removeImage}
            />
          </div> */}

          <div className='mt-20 flex items-center justify-center gap-10'>
            {/* Step 4: Train Model */}
            <div className='mb-10'>
              <TrainingSection
                isTraining={isTraining}
                trainingProgress={trainingProgress}
                trainingStatus={trainingStatus}
                onTrain={trainModel}
              />
            </div>
            <hr className='my-10' />

            {/* Step 5: Export Model */}
            <div className='mb-10'>
              <ModelExport model={model} onDownload={downloadModel} />
            </div>
          </div>

          {/* Results */}
          {predictionResults && (
            <div className='mb-10'>
              <PredictionResults results={predictionResults} />
            </div>
          )}

          {/* Step 6: Test with Camera */}
          <div className='mb-10'>
            <CameraTest onOpenCamera={() => handleOpenCamera()} />
          </div>
        </div>
      </div>

      {/* Camera Overlay */}
      {showCamera && (
        <CameraOverlay onClose={handleCloseCamera} onCapture={handleCapturePhoto} currentClass={currentCameraClass} />
      )}
    </div>
  )
}
