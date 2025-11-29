'use client'

import { useSearchOrganizationsQuery } from '@/features/organization/api/organizationApi'
import { useAppSelector } from '@/hooks/redux-hooks'
import React from 'react'

export default function SystemOrganizationList() {
  const planSliceParams = useAppSelector((state) => state.organization)
  const { data, isLoading } = useSearchOrganizationsQuery(planSliceParams)
  return <div>SystemOrganizationList</div>
}
