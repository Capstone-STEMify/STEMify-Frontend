'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { X, Circle } from 'lucide-react'

interface CameraOverlayProps {
  onClose: () => void
  onCapture: (imageDataUrl: string) => void
  currentClass: string | null
}

export function CameraOverlay({ onClose, onCapture, currentClass }: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraStatus, setCameraStatus] = useState('Đang khởi tạo camera...')
  const [capturedImages, setCapturedImages] = useState<string[]>([])

  useEffect(() => {
    initCamera()
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const initCamera = async () => {
    try {
      setCameraStatus('Đang khởi tạo camera...')

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraStatus('Camera sẵn sàng! Nhấn nút để chụp ảnh')
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      setCameraStatus('Không thể truy cập camera!')
      alert('Không thể truy cập camera. Vui lòng cho phép quyền truy cập camera.')
    }
  }

  const handleCapturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) return

        const reader = new FileReader()
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string

          // Call the parent handler
          onCapture(imageDataUrl)

          // Add to captured images preview
          setCapturedImages((prev) => {
            const newImages = [...prev, imageDataUrl]
            // Keep only last 10 images
            return newImages.slice(-10)
          })
        }
        reader.readAsDataURL(blob)
      },
      'image/jpeg',
      0.8
    )
  }

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
    onClose()
  }

  return (
    <div className='fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95'>
      {/* Close button */}
      <div className='absolute top-5 right-5'>
        <Button onClick={handleClose} variant='destructive' size='icon' className='h-12 w-12 rounded-full'>
          <X className='h-6 w-6' />
        </Button>
      </div>

      {/* Status */}
      <div className='mb-5 text-lg text-white'>
        {cameraStatus}
        {currentClass && <span className='ml-2 text-blue-300'>(Đang chụp cho: {currentClass})</span>}
      </div>

      {/* Camera preview */}
      <div className='relative h-[60%] w-[80%] max-w-[800px] overflow-hidden rounded-2xl bg-black shadow-2xl'>
        <video ref={videoRef} className='h-full w-full object-cover' autoPlay muted playsInline />
        <canvas ref={canvasRef} className='hidden' />
      </div>

      {/* Capture button */}
      <div className='mt-5'>
        <Button
          onClick={handleCapturePhoto}
          className='flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-red-500 transition-all hover:bg-red-600'
        >
          <Circle className='h-10 w-10 fill-white' />
        </Button>
      </div>

      {/* Captured images preview */}
      {capturedImages.length > 0 && (
        <div className='absolute bottom-5 left-5 flex max-w-[200px] gap-2.5 overflow-x-auto'>
          {capturedImages.map((imageSrc, index) => (
            <img
              key={index}
              src={imageSrc}
              alt={`Captured ${index + 1}`}
              className='h-15 w-15 cursor-pointer rounded-lg border-2 border-white object-cover transition-transform hover:scale-110'
              onClick={() => onCapture(imageSrc)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
