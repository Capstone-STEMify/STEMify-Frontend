'use client'
import { useSearchCertificateQuery } from '@/features/certificate/api/certificateApi'
import { CertificateType } from '@/features/certificate/types/certificate.type'
import { useAppSelector } from '@/hooks/redux-hooks'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import SEmpty from '@/components/shared/empty/SEmpty'
import { Award, Filter } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { CertificateItem } from '../item/CertificateItem'

export default function CertificateList() {
  const t = useTranslations('MyLearning')
  const { token, user } = useAppSelector((state) => state.auth)
  const { selectedOrgUserId } = useAppSelector((state) => state.selectedOrganization)
  console.log('Selected Org User ID:', selectedOrgUserId)

  const [filterType, setFilterType] = useState<string>('ALL')

  const { data: certificateResponse, isLoading } = useSearchCertificateQuery(
    { userId: selectedOrgUserId!, pageNumber: 1, pageSize: 100 },
    { skip: !selectedOrgUserId }
  )

  const filteredCertificates = useMemo(() => {
    if (!certificateResponse?.data?.items) return []

    const items = certificateResponse.data.items

    if (filterType === 'ALL') return items

    return items.filter((item) => item.certificateType.toLowerCase() === filterType.toLowerCase())
  }, [certificateResponse, filterType])

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
        title='No Certificates Yet'
        description='Complete courses or specializations to earn your first certificate.'
        icon={<Award className='h-12 w-12 text-gray-300' />}
      />
    )
  }

  return (
    <main className='min-h-screen p-4 sm:p-6 lg:p-8'>
      <div className='mx-auto max-w-5xl space-y-8'>
        {/* Header Section */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Chứng chỉ</h1>
            <p className='text-gray-500'>Quản lý và xem các chứng chỉ bạn đã đạt được</p>
          </div>

          <Tabs defaultValue='ALL' onValueChange={setFilterType} className='w-full sm:w-auto'>
            <TabsList className='grid w-full grid-cols-3 sm:w-auto'>
              <TabsTrigger value='ALL'>Tất cả</TabsTrigger>
              <TabsTrigger value={CertificateType.COURSE}>Khóa học</TabsTrigger>
              <TabsTrigger value={CertificateType.CURRICULUM}>Khung chương trình</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex flex-col gap-4'>
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => <CertificateItem key={cert.id} certificate={cert} />)
          ) : (
            <div className='rounded-lg border border-dashed bg-gray-50 py-10 text-center text-gray-500'>
              Không tìm thấy chứng chỉ cho danh mục này.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
