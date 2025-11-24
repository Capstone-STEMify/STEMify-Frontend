'use client'
import Link from 'next/link'

export default function MakeCodeLink() {
  const currentUser = {
    id: 'user_local_001',
    email: 'test@stemify.com',
    name: 'Tester Local'
  }

  return (
    <iframe
      src='http://localhost:3232/index.html#?embed=0'
      style={{ width: '100%', height: '800px', border: 'none' }}
    ></iframe>
  )
}
