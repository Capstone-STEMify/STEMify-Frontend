'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shadcn/dialog'
import { Button } from '@/components/shadcn/button'
import { useGetCertificateByIdQuery } from '@/features/certificate/api/certificateApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import { formatDate } from '@/utils/index'
import { CheckCircle, Download, Share2, Calendar, Loader2, FileText } from 'lucide-react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

const PdfThumbnail = dynamic(() => import('./PdfThumbnail'), {
  ssr: false,
  loading: () => <div className='h-[300px] w-full animate-pulse rounded-lg bg-gray-100' />
})

interface CertificateDetailModalProps {
  certificateId: number | string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CertificateDetailModal({ certificateId, open, onOpenChange }: CertificateDetailModalProps) {
  const t = useTranslations('certificate')
  const currentUser = useAppSelector((state) => state.auth.user)

  const { data: certificateResponse, isLoading } = useGetCertificateByIdQuery(Number(certificateId), {
    skip: !certificateId || !open
  })

  const cert = certificateResponse?.data

  const displayDate = cert?.issueDate
    ? formatDate(cert.issueDate)
    : cert?.completedAt
      ? formatDate(cert.completedAt)
      : 'N/A'

  const handleDownload = () => {
    if (cert?.certificateUrl) {
      window.open(cert.certificateUrl, '_blank')
    }
  }

  const handleShare = () => {
    const shareUrl = cert?.certificateUrl ?? ''
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => toast.success(t('linkCopied')))
      .catch(() => console.error('Failed to copy'))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='h-[80vh] w-full max-w-[1400px] gap-0 overflow-y-auto bg-[#f8f9fc] p-0'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Certificate Detail</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className='flex h-full min-h-[400px] w-full items-center justify-center bg-white'>
            <div className='flex flex-col items-center gap-3'>
              <Loader2 className='h-10 w-10 animate-spin text-blue-600' />
              <p className='text-gray-500'>{t('loadingInfo')}</p>
            </div>
          </div>
        ) : !cert ? (
          <div className='flex h-full min-h-[400px] items-center justify-center p-8 text-gray-500'>
            {t('certificateNotFound')}
          </div>
        ) : (
          <div className='flex flex-col lg:flex-row'>
            <div className='w-full bg-white p-6 md:p-10 lg:w-[420px] lg:border-r lg:border-gray-200'>
              {/* Header Info */}
              <div className='flex items-start gap-5'>
                <div className='relative flex-shrink-0'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-600 ring-2 ring-gray-100'>
                    {cert.userImageUrl || currentUser?.imageUrl ? (
                      <Image
                        src={cert.userImageUrl || currentUser?.imageUrl || ''}
                        alt={cert.userName}
                        width={64}
                        height={64}
                        className='h-full w-full rounded-full object-cover'
                      />
                    ) : (
                      cert.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <CheckCircle className='absolute -right-1 -bottom-1 h-6 w-6 rounded-full border-2 border-white bg-green-500 text-white' />
                </div>

                <div className='pt-1'>
                  <p className='text-sm font-medium tracking-wide text-gray-500 uppercase'>{t('completedBy')}</p>
                  <h2 className='text-xl font-bold text-gray-900'>{cert.userName}</h2>
                  <div className='mt-1 flex items-center gap-2 text-sm text-gray-500'>
                    <Calendar className='h-3.5 w-3.5' />
                    <span>{displayDate}</span>
                  </div>
                </div>
              </div>

              <div className='mt-8'>
                <h1 className='text-2xl leading-tight font-bold text-gray-900'>{cert.title}</h1>
                <p className='mt-3 text-sm leading-relaxed text-gray-600'>
                  {t('verificationTextModal', { userName: cert.userName })}
                </p>
              </div>

              {/* Lessons List */}
              {cert.lessons && cert.lessons.length > 0 && (
                <div className='mt-8'>
                  <h3 className='mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase'>{t('courseContent')}</h3>
                  <div className='rounded-lg border border-gray-100 bg-gray-50 p-4'>
                    <ul className='space-y-3'>
                      {cert.lessons.map((lesson: string, index: number) => (
                        <li key={index} className='flex items-start gap-3'>
                          <div className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500' />
                          <span className='text-sm font-medium text-gray-700'>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className='mt-8 flex items-center gap-2 border-t border-gray-100 pt-6 text-xs text-gray-400'>
                <span className='font-semibold uppercase'>{t('verificationCodeLabel')}</span>
                <span className='rounded bg-gray-100 px-2 py-1 font-mono text-gray-600'>{cert.verificationCode}</span>
              </div>

                <p className='mt-4 text-[10px] text-gray-400'>
                  {t('certificateValidity')}
                </p>
            </div>

            <div className='flex flex-1 flex-col bg-gray-50 p-6'>
              <div className='sticky top-6 w-full'>
                <div className='mb-6 w-full overflow-hidden rounded-lg bg-white shadow-lg'>
                  {cert.certificateUrl ? (
                    <PdfThumbnail url={cert.certificateUrl} width={800} />
                  ) : (
                    <div className='flex h-[250px] items-center justify-center bg-gray-100 text-gray-400'>
                      <FileText className='mr-2 h-10 w-10' /> {t('noPreview')}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-3'>
                  <Button onClick={handleShare} className='w-full bg-blue-600 font-medium hover:bg-blue-700'>
                    <Share2 className='mr-2 h-4 w-4' />
                    {t('shareCertificate')}
                  </Button>

                  <Button
                    variant='outline'
                    onClick={handleDownload}
                    className='w-full border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
                  >
                    <Download className='mr-2 h-4 w-4' />
                    {t('downloadPdf')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}