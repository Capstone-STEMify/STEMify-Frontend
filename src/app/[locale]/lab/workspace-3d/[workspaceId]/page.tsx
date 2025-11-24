'use client'

import { Suspense } from 'react'
import Creator3DHeader from '@/features/creator-3d/components/creator3d/Creator3DHeader'
import Creator3D from '@/features/creator-3d/components/creator3d/Creator3D'
import { useGetEmulatorByIdQuery } from '@/features/emulator/api/emulatorApi'
import { useParams } from 'next/navigation'

export default function Create3DPage() {
  const { workspaceId } = useParams()
  const { data: emulatorData, isLoading: isLoadingEmulator } = useGetEmulatorByIdQuery(
    {
      emulationId: workspaceId as string
    },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      skip: false
    }
  )

  if (isLoadingEmulator || !emulatorData) return <div>Loading...</div>

  return (
    <div className='flex h-screen w-screen flex-col overflow-hidden bg-gray-50'>
      <Creator3DHeader />
      {/* Main Content */}
      <div className='flex flex-1 overflow-hidden'>
        <Suspense
          fallback={
            <div className='flex flex-1 items-center justify-center'>
              <div className='text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]' />
                <p className='mt-2 text-sm text-gray-600'>Loading 3D Creator...</p>
              </div>
            </div>
          }
        >
          <Creator3D emulatorData={emulatorData} />
        </Suspense>
      </div>
    </div>
  )
}
