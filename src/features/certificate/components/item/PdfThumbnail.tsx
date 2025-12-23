'use client'
import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Loader2, FileWarning, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfThumbnailProps {
  url: string
  width?: number
  className?: string
}

export default function PdfThumbnail({ url, width = 500, className }: PdfThumbnailProps) {
  const t = useTranslations('certificate')
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [containerWidth, setContainerWidth] = useState(width)

  useEffect(() => {
    const handleResize = () => {
      const newWidth = Math.min(window.innerWidth - 48, width)
      setContainerWidth(newWidth)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [width])

  function onDocumentLoadSuccess() {
    setLoading(false)
    setHasError(false)
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error)
    setLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-gray-200 bg-gray-100 shadow-sm ${className}`}>
        <div className='flex flex-col items-center justify-center p-4 text-center'>
          <div className='mb-4 flex h-full w-full flex-col items-center justify-center gap-2'>
            <iframe
              src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
              className='h-[350px] w-full border-0'
              title='Certificate Preview'
            />
          </div>
          <p className='text-muted-foreground mb-2 text-xs'>
            {t('unableToPreview')}
          </p>
          <a
            href={url}
            target='_blank'
            rel='noreferrer'
            className='inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline'
          >
            {t('openOriginal')} <ExternalLink className='h-3 w-3' />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative min-h-[300px] overflow-hidden rounded-lg ${className}`}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/80 text-gray-500'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
          <span className='text-sm font-medium'>{t('processingImage')}</span>
        </div>
      )}

      {/* React PDF Document */}
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        className='flex justify-center'
        loading={null}
        options={{
          cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`
        }}
      >
        <Page
          pageNumber={1}
          width={containerWidth}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          canvasBackground='#ffffff'
          className='shadow-sm'
          error={<div className='p-4 text-red-500'>Lỗi hiển thị trang.</div>}
        />
      </Document>
    </div>
  )
}
