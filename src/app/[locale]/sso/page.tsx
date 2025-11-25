'use client'

import { useAppSelector } from '@/hooks/redux-hooks'
import { useEffect } from 'react'

export default function SSOPage() {
  const { token, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    console.log('SSOPage loaded')
    // Lấy token từ localStorage của STEMIFY
    // const token = localStorage.getItem('stemify_access_token')
    // const userId = localStorage.getItem('stemify_user_id')

    // Gửi token về parent (microbit)
    window.parent.postMessage(
      {
        source: 'stemify-sso',
        token: token ?? null,
        userId: user?.userId ?? null
      },
      '*' // hoặc "https://microbit.stemify.com" để tăng bảo mật
    )
  }, [token, user?.userId])

  return null
}
