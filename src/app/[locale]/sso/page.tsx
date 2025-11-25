'use client'

import { Button } from '@/components/shadcn/button'
import { signIn } from 'next-auth/react'
import { useEffect } from 'react'

export default function SSOPage() {
  useEffect(() => {
    console.log('SSOPage loaded')
    // Lấy token từ localStorage của STEMIFY
    const token = localStorage.getItem('stemify_access_token')
    const userId = localStorage.getItem('stemify_user_id')

    // Gửi token về parent (microbit)
    window.opener.postMessage(
      {
        source: 'stemify-sso',
        token: token ?? null,
        userId: userId ?? null
      },
      '*'
    )
  }, [])
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <div className='flex flex-col items-center gap-4 rounded-xl bg-white p-8 shadow-lg'>
        <Button
          variant={'outline'}
          className='text-xl font-semibold'
          onClick={() => signIn('oidc', { callbackUrl: '/', prompt: 'login' })}
        >
          Continue with STEMIFY
        </Button>
      </div>
    </div>
  )
}
