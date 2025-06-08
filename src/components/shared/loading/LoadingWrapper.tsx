'use client'
import LoadingComponent from '@/components/shared/loading/LoadingComponent'
import { usePathname } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

export default function LoadingWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // loading based on pathname change
  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timeout)
  }, [pathname])
  return (
    <div>
      {loading && (
        <div className='bg-blue-custom-50/60 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl'>
          <LoadingComponent size={150} />
        </div>
      )}
      {children}
    </div>
  )
}
