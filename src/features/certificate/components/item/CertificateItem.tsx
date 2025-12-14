'use client'
import { Button } from '@/components/shadcn/button'
import { Card, CardContent } from '@/components/shadcn/card'
import { Certificate, CertificateType } from '@/features/certificate/types/certificate.type'
import { formatDate } from '@/utils/index'
import { Award, FileText, Download, ExternalLink } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/shadcn/badge'

interface CertificateItemProps {
  certificate: Certificate
}

export const CertificateItem = ({ certificate }: CertificateItemProps) => {
  const locale = useLocale()
  const router = useRouter()

  const isCurriculum = certificate.certificateType === CertificateType.CURRICULUM

  const handleViewDetail = () => {
    router.push(`/${locale}/certificate/${certificate.id}`)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (certificate.certificateUrl) {
      window.open(certificate.certificateUrl, '_blank')
    }
  }

  return (
    <Card className='group overflow-hidden transition-all hover:border-blue-300 hover:shadow-md'>
      <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-start gap-4'>
          <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg border ${isCurriculum ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'}`}>
            {isCurriculum ? (
              <Award className='h-8 w-8 text-orange-500' />
            ) : (
              <FileText className='h-8 w-8 text-blue-500' />
            )}
          </div>

          {/* Thông tin chính từ API */}
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h3 
                onClick={handleViewDetail}
                className='cursor-pointer text-lg font-semibold text-gray-900 transition-colors hover:text-blue-600'
              >
                {certificate.title}
              </h3>
              <Badge variant='outline' className={`hidden sm:inline-flex ${isCurriculum ? 'text-orange-600 border-orange-200 bg-orange-50' : 'text-blue-600 border-blue-200 bg-blue-50'}`}>
                {certificate.certificateType}
              </Badge>
            </div>
            
            <p className='text-sm text-gray-500'>
              Issued to <span className='font-medium text-gray-700'>{certificate.userName}</span>
            </p>
            
            <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500'>
              <span className='flex items-center gap-1'>
                Date: {formatDate(certificate.issueDate)}
              </span>
              <span className='flex items-center gap-1'>
                ID: <span className='font-mono text-gray-600'>{certificate.verificationCode}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex items-center gap-2 pt-2 sm:pt-0'>
          <Button variant='outline' size='sm' className='gap-2' onClick={handleDownload}>
            <Download className='h-4 w-4' />
            <span className='sr-only sm:not-sr-only'>PDF</span>
          </Button>
          <Button className='bg-blue-600 hover:bg-blue-700' size='sm' onClick={handleViewDetail}>
            View Detail
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}