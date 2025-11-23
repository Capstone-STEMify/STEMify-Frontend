'use client'

import { useEffect } from 'react'

export default function SSOPage() {
  useEffect(() => {
    console.log('SSOPage loaded')
    // Lấy token từ localStorage của STEMIFY
    const token = localStorage.getItem('stemify_access_token')
    const userId = localStorage.getItem('stemify_user_id')

    // Gửi token về parent (microbit)
    window.parent.postMessage(
      {
        source: 'stemify-sso',
        token,
        userId
      },
      '*' // hoặc "https://microbit.stemify.com" để tăng bảo mật
    )
  }, [])

  return null
}
