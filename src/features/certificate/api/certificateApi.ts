import { Certificate } from '@/features/certificate/types/certificate.type'
import { createCrudApi } from '@/libs/redux/baseApi'
import { SliceQueryParams } from '@/libs/redux/createQuerySlice'

export const certificateApi = createCrudApi<Certificate, SliceQueryParams>({
  reducerPath: 'certificateApi',
  tagTypes: ['Certificate'],
  baseUrl: '/certificates'
})

export const {
  useGetByIdQuery: useGetCertificateByIdQuery,
  useSearchQuery: useSearchCertificateQuery,
  useGetAllQuery: useGetAllCertificateQuery,

  // lazy
  useLazyGetByIdQuery: useLazyGetCertificateByIdQuery,
  useLazySearchQuery: useLazySearchCertificateQuery,
  useLazyGetAllQuery: useLazyGetAllCertificateQuery
} = certificateApi
