import { useRef, useState } from 'react'

export type FileType = 'image' | 'video' | 'pdf' | 'audio' | 'document' | 'any'

export function useFileUpload(
  onFileSelect: (file: File, base64: string) => void,
  acceptedType: FileType = 'any',
  maxSizeMB: number = 10 // optional giới hạn dung lượng
) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const processFile = (file: File) => {
    if (file.size / 1024 / 1024 > maxSizeMB) {
      alert(`File exceeds ${maxSizeMB}MB limit.`)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1] ?? ''
      onFileSelect(file, base64)
    }
    reader.readAsDataURL(file)
  }

  const getAccept = () => {
    switch (acceptedType) {
      case 'image':
        return 'image/*'
      case 'video':
        return 'video/*'
      case 'audio':
        return 'audio/*'
      case 'pdf':
        return 'application/pdf'
      case 'document':
        return '.doc,.docx,.txt,.odt,.rtf,.pdf'
      default:
        return '*/*'
    }
  }

  return {
    inputRef,
    handleClick,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    accept: getAccept(),
    isDragging
  }
}
