'use client'
import React from 'react'
import { Lock, Home, LogIn, Shield } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function UnauthorizedPage() {
  const handleLogin = () => {
    signIn('oidc', { callbackUrl: '/' }, { prompt: 'login' })
  }

  const goToHome = () => {
    redirect('/')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50'>
      <div className='mx-auto w-full max-w-2xl px-8'>
        {/* Main container */}
        <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg'>
          {/* Header section */}
          <div className='bg-gray-900 px-12 py-8 text-center'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500'>
              <Lock className='h-8 w-8 text-white' />
            </div>
            <h1 className='mb-2 text-4xl font-bold text-white'>403</h1>
            <div className='flex items-center justify-center gap-2 text-gray-300'>
              <Shield className='h-5 w-5' />
              <span className='text-lg'>Unauthorized Access</span>
            </div>
          </div>

          {/* Content section */}
          <div className='px-12 py-10 text-center'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-800'>Access Denied</h2>
            <p className='mx-auto mb-8 max-w-md text-lg leading-relaxed text-gray-600'>
              You do not have permission to access this page. Please contact your administrator if you believe this is
              an error.
            </p>

            {/* Action buttons */}
            <div className='flex items-center justify-center gap-6'>
              <Button onClick={goToHome} size={'lg'} className='p-4 text-base'>
                <Home className='h-5 w-5' />
                Go back to home
              </Button>
              <Button onClick={handleLogin} className='bg-blue-600 p-4 text-base text-white' size={'lg'}>
                <LogIn className='h-5 w-5' />
                Login
              </Button>
            </div>

            {/* Help section */}
            <div className='mt-10 border-t border-gray-200 pt-8'>
              <p className='text-sm text-gray-500'>Need assistance? Contact your system administrator for help.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
