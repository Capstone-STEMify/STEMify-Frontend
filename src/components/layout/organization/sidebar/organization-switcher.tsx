'use client'

import * as React from 'react'
import { ChevronsUpDown, GraduationCap, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/shadcn/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/shadcn/sidebar'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import {
  setAccessCourseIds,
  setAccessEmulatorIds,
  setSelectedOrganizationId
} from '@/features/subscription/slice/selectedOrganizationSlice'
import { useGetOrganizationsWithAccessByUserIdQuery } from '@/features/organization/api/organizationApi'
import { useSession } from 'next-auth/react'
import { useStatusTranslation } from '@/utils/index'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

export function OrganizationSwitcher() {
  const t = useTranslations('organization.detail')
  const { data: session, status } = useSession()
  const statusTranslates = useStatusTranslation()
  const locale = useLocale()

  const { isMobile } = useSidebar()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user = useAppSelector((state) => state.auth.user)
  const selectedOrganizationId = useAppSelector((state) => state.selectedOrganization.selectedOrganizationId)

  const userId = user?.userId
  const { data: organizationData, isLoading } = useGetOrganizationsWithAccessByUserIdQuery(
    { userId: userId! },
    { skip: !userId }
  )

  const organizations = organizationData?.data?.organizations ?? []

  // Nếu chưa chọn org nào => mặc định chọn org đầu tiên
  React.useEffect(() => {
    if (status === 'authenticated' && organizations.length && !selectedOrganizationId) {
      const first = organizations[0]
      dispatch(setSelectedOrganizationId(first.id))
      const subscriptions = first.subscriptions || []
      // Trích courseIds và emulatorModelIds từ tất cả subscriptions
      const allCourseIds = subscriptions.flatMap((sub) => sub.courseIds || [])
      const allEmulatorIds = subscriptions.flatMap((sub) => sub.emulatorModelIds || [])

      // Lọc unique (nếu cần)
      const uniqueCourseIds = Array.from(new Set(allCourseIds))
      const uniqueEmulatorIds = Array.from(new Set(allEmulatorIds))
      console.log('Setting access IDs for organization:', uniqueEmulatorIds)

      dispatch(setAccessCourseIds(uniqueCourseIds))
      dispatch(setAccessEmulatorIds(uniqueEmulatorIds))
    }
  }, [organizations, selectedOrganizationId, dispatch])

  if (isLoading || !organizations.length) return null

  // Organization đang được chọn
  const selectedOrg = organizations.find((org) => org.id === selectedOrganizationId) ?? organizations[0]
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-200 text-blue-600'>
                {selectedOrg.imageUrl ? (
                  <img src={selectedOrg.imageUrl} alt={selectedOrg.name} className='h-full w-full object-cover' />
                ) : (
                  <GraduationCap className='size-4' />
                )}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>{selectedOrg.name}</span>
                <span className='text-muted-foreground text-xs'>{statusTranslates('active')}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-muted-foreground text-xs'>Tổ chức</DropdownMenuLabel>

            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => {
                  dispatch(setSelectedOrganizationId(org.id))
                  router.push(`/${locale}/organization/dashboard`)
                }}
                className={`gap-2 p-2 ${org.id === selectedOrganizationId ? 'bg-slate-100' : ''}`}
              >
                <div className='flex size-6 items-center justify-center rounded-md border'>
                  {org.imageUrl ? (
                    <img src={org.imageUrl} alt={org.name} className='h-full w-full object-cover' />
                  ) : (
                    <GraduationCap className='size-3.5 shrink-0 text-blue-600' />
                  )}
                </div>
                <div className='flex flex-col'>
                  <span className='font-medium'>{org.name}</span>
                  <p className='text-muted-foreground text-xs'>
                    {org.subscriptions.length} {t('package')} {statusTranslates('active')}
                  </p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
