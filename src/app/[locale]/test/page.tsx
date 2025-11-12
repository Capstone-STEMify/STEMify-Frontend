'use client'
import Link from 'next/link'

export default function MakeCodeLink() {
  const currentUser = {
    id: 'user_local_001',
    email: 'test@stemify.com',
    name: 'Tester Local'
  }

  return (
    <Link
      href={`http://localhost:3232/index.html#home?userId=${currentUser.id}`}
      target='_blank' // mở tab mới
      rel='noopener noreferrer'
      className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
    >
      🚀 Mở MakeCode (Link)
    </Link>
  )
}
