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
  const userId = user?.userId
  
  const [filterType, setFilterType] = useState<string>('ALL')

  const { data: certificateResponse, isLoading } = useSearchCertificateQuery(
    { userId: userId, pageNumber: 1, pageSize: 100 },
    { skip: !userId }
  )

  const filteredCertificates = useMemo(() => {
    if (!certificateResponse?.data?.items) return []
    
    const items = certificateResponse.data.items

    if (filterType === 'ALL') return items
    
    return items.filter(item => 
      item.certificateType.toLowerCase() === filterType.toLowerCase()
    )
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
            <h1 className='text-2xl font-bold text-gray-900'>My Certificates</h1>
            <p className='text-gray-500'>Manage and view your earned credentials</p>
          </div>
          
          <Tabs defaultValue="ALL" onValueChange={setFilterType} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="ALL">All</TabsTrigger>
              <TabsTrigger value={CertificateType.COURSE}>Courses</TabsTrigger>
              <TabsTrigger value={CertificateType.CURRICULUM}>Specializations</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className='flex flex-col gap-4'>
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <CertificateItem key={cert.id} certificate={cert} />
            ))
          ) : (
            <div className='py-10 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed'>
              No certificates found for this category.
            </div>
          )}
        </div>
        
      </div>
    </main>
  )
}