'use client'
import { useSearchCertificateQuery } from '@/features/certificate/api/certificateApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { Award } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { CertificateItem } from '../item/CertificateItem'
import { CertificateDetailModal } from '../item/CertificateDetailModal'

export default function CertificateList() {
  const t = useTranslations('certificate')
  const { user } = useAppSelector((state) => state.auth)
  const userId = user?.userId

  const [filterType, setFilterType] = useState<string>('ALL')

  // -- STATE CHO MODAL --
  const [selectedCertId, setSelectedCertId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: certificateResponse, isLoading } = useSearchCertificateQuery(
    { userId: userId!, pageNumber: 1, pageSize: 100 },
    { skip: !userId }
  )

  const filteredCertificates = useMemo(() => {
    if (!certificateResponse?.data?.items) return []
    const items = certificateResponse.data.items
    if (filterType === 'ALL') return items
    return items.filter((item) => item.certificateType.toLowerCase() === filterType.toLowerCase())
  }, [certificateResponse, filterType])

  const handleViewDetail = (id: number) => {
    setSelectedCertId(id)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-[50vh] items-center justify-center'>
        <LoadingComponent />
      </div>
    )
  }

  if (!certificateResponse?.data?.items || certificateResponse.data.items.length === 0) {
    return (
      <SEmpty
        title={t('noCertificates')}
        description={t('noCertificatesDesc')}
        icon={<Award className='h-12 w-12 text-gray-300' />}
      />
    )
  }

  return (
    <main className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-5xl space-y-8'>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{t('title')}</h1>
            <p className='text-gray-500'>{t('subtitle')}</p>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <CertificateItem key={cert.id} certificate={cert} onViewDetail={handleViewDetail} />
            ))
          ) : (
            <div className='rounded-lg border border-dashed bg-gray-50 py-10 text-center text-gray-500'>
              {t('noCertificatesForCategory')}
            </div>
          )}
        </div>
      </div>

      <CertificateDetailModal certificateId={selectedCertId} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </main>
  )
}
