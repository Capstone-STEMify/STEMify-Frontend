'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { CheckCircle, Download, Share2, Loader2 } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { useGetCertificateByIdQuery } from '@/features/certificate/api/certificateApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import SEmpty from '@/components/shared/empty/SEmpty'
import { formatDate } from '@/utils/index'
import { useTranslations } from 'next-intl'

const PdfThumbnail = dynamic(() => import('./PdfThumbnail'), {
  ssr: false,
  loading: () => <div className='h-[300px] w-full animate-pulse rounded bg-gray-100' />
})

export default function CertificateView() {
  const t = useTranslations('certificate')
  const params = useParams()
  const id = params?.certificateId as string

  const currentUser = useAppSelector((state) => state.auth.user)

  const { data: certificateResponse, isLoading } = useGetCertificateByIdQuery(Number(id), {
    skip: !id
  })

  console.log('cert data', certificateResponse)

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center bg-white'>
        <Loader2 className='h-10 w-10 animate-spin text-blue-600' />
      </div>
    )
  }

  if (!certificateResponse?.data) {
    return (
      <div className='p-10'>
        <SEmpty title={t('notFound')} description={t('notFoundDesc')} />
      </div>
    )
  }

  const cert = certificateResponse.data

  const displayDate = cert.issueDate
    ? formatDate(cert.issueDate)
    : cert.completedAt
      ? formatDate(cert.completedAt)
      : 'N/A'

  const handleDownload = () => {
    if (cert.certificateUrl) {
      window.open(cert.certificateUrl, '_blank')
    }
  }

  const handleShare = () => {
    const url = cert.certificateUrl
    navigator.clipboard.writeText(url).then(() => {
      alert(t('linkCopied'))
    })
  }

  return (
    <div className='min-h-screen bg-[#f9fafe] p-4 md:p-8'>
      <div className='mx-auto max-w-6xl rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-10'>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-16'>
          <div className='flex-1 space-y-8'>
            <div className='flex items-start gap-5'>
              <div className='relative flex-shrink-0'>
                <div className='flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600'>
                  {cert.userImageUrl || currentUser?.imageUrl ? (
                    <Image
                      src={cert.userImageUrl || currentUser?.imageUrl || ''}
                      alt={cert.userName}
                      width={80}
                      height={80}
                      className='h-full w-full rounded-full object-cover'
                    />
                  ) : (
                    cert.userName.charAt(0).toUpperCase()
                  )}
                </div>
                <CheckCircle className='absolute -right-1 -bottom-1 h-7 w-7 rounded-full border-4 border-white bg-blue-600 text-white' />
              </div>

              <div className='pt-1'>
                <p className='text-lg font-medium text-gray-600'>
                  {t('completedBy')} <span className='font-bold text-gray-900'>{cert.userName}</span>
                </p>
                <p className='mt-1 text-sm text-gray-500'>{displayDate}</p>
                <div className='mt-3'>
                  <h1 className='text-2xl leading-tight font-bold text-gray-900'>{cert.title}</h1>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-blue-50 p-4 text-sm text-blue-900'>
              <p>
                {t('verificationText', { userName: cert.userName })}
              </p>
            </div>

            {cert.lessons && cert.lessons.length > 0 && (
              <div>
                <h3 className='mb-4 text-base font-bold tracking-wide text-gray-500 uppercase'>
                  {t('completedContent')}
                </h3>
                <ul className='space-y-3'>
                  {cert.lessons.map((lesson: string, index: number) => (
                    <li key={index} className='flex items-start gap-3 text-gray-700'>
                      <div className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400' />
                      <span className='leading-relaxed'>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className='border-t border-gray-100 pt-6'>
              <p className='text-xs text-gray-400'>
                {t('verificationCode')} <span className='font-mono text-gray-600'>{cert.verificationCode}</span>
              </p>
            </div>
          </div>

          <div className='flex w-full flex-col items-center lg:w-[450px]'>
            <div className='w-full'>
              <PdfThumbnail url={cert.certificateUrl} width={450} className='shadow-lg' />
            </div>

            <div className='mt-6 flex w-full gap-3'>
              <Button
                onClick={handleShare}
                className='flex-1 bg-blue-600 font-semibold shadow-sm transition-all hover:bg-blue-700 hover:shadow'
                size='lg'
              >
                <Share2 className='mr-2 h-4 w-4' />
                {t('share')}
              </Button>

              <Button
                variant='outline'
                onClick={handleDownload}
                className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                size='lg'
              >
                <Download className='mr-2 h-4 w-4' />
                {t('download')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
