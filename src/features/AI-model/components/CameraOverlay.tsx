'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/shadcn/button'
import { X, Circle } from 'lucide-react'
import { cn } from '@/utils/shadcn/utils'

interface CameraOverlayProps {
  inline?: boolean
  onClose?: () => void
  onCapture?: (imageDataUrl: string) => void
  onPredict?: (frame: string) => void
  currentClass?: string | null
}

export function CameraOverlay({ inline = false, onClose, onCapture, onPredict, currentClass }: CameraOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraStatus, setCameraStatus] = useState('Đang khởi tạo camera...')
  const [capturedImages, setCapturedImages] = useState<string[]>([])

  useEffect(() => {
    initCamera()
    return () => stopCamera()
  }, [])

  useEffect(() => {
    initCamera()

    let interval: NodeJS.Timeout
    if (onPredict) {
      interval = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current
          const video = videoRef.current
          if (!video.videoWidth || !video.videoHeight) return
          const ctx = canvas.getContext('2d')
          if (!ctx) return
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const frame = canvas.toDataURL('image/jpeg', 0.6)
          onPredict(frame) // luôn gọi hàm mới nhất
        }
      }, 500)
    }

    return () => {
      clearInterval(interval)
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [onPredict])

  // Init camera
  const initCamera = async () => {
    try {
      setCameraStatus('Đang khởi tạo camera...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraStatus('Camera sẵn sàng!')
      }
    } catch (err) {
      console.error('Không thể truy cập camera:', err)
      setCameraStatus('Không thể truy cập camera!')
      alert('Vui lòng cho phép quyền truy cập camera.')
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose?.()
  }

  const handleCapturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const img = canvas.toDataURL('image/jpeg', 0.8)
    onCapture?.(img)
    setCapturedImages((prev) => [...prev, img])
  }

  return (
    <div
      className={cn(
        inline
          ? 'relative flex w-full flex-col items-center rounded-xl border border-gray-300 bg-black/5 p-3'
          : 'fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95'
      )}
    >
      {/* Close button */}
      {!inline && (
        <div className='absolute top-5 right-5'>
          <Button onClick={handleClose} variant='destructive' size='icon' className='h-12 w-12 rounded-full'>
            <X className='h-6 w-6' />
          </Button>
        </div>
      )}

      {/* Status */}
      <div className={cn('mb-4 text-center text-sm md:text-lg', inline ? 'text-gray-600' : 'text-white')}>
        {cameraStatus}
        {currentClass && (
          <span className={cn('ml-2 font-medium', inline ? 'text-blue-600' : 'text-blue-300')}>
            (Đang chụp cho: {currentClass} | Số lượng ảnh: {capturedImages.length})
          </span>
        )}
      </div>

      {/* Camera preview */}
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-2xl shadow-xl',
          inline ? 'h-[320px]' : 'h-[60%] max-w-[800px]'
        )}
      >
        <video ref={videoRef} className='h-full w-full object-cover' autoPlay muted playsInline />
        <canvas ref={canvasRef} className='hidden' />
      </div>

      {/* Capture button - chỉ hiện khi fullscreen */}
      {!inline && (
        <div className='mt-4'>
          <Button
            onClick={handleCapturePhoto}
            className='flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-500 transition-all hover:bg-red-600'
          >
            <Circle className='h-8 w-8 fill-white' />
          </Button>
        </div>
      )}

      {/* Captured images preview */}
      {capturedImages.length > 0 && !inline && (
        <div className="absolute bottom-5 left-0 right-0 mx-auto w-full px-5 flex gap-2.5 overflow-x-auto">
          {capturedImages.map((imageSrc, index) => (
            <img
              key={index}
              src={imageSrc}
              alt={`Captured ${index + 1}`}
              className='h-15 w-15 cursor-pointer rounded-lg border-2 border-white object-cover transition-transform hover:scale-110'
              onClick={() => onCapture?.(imageSrc)}
            />
          ))}
        </div>
      )}
      
    </div>
  )
}
