'use client'
import dynamic from 'next/dynamic'

const MakeCodeEditor = dynamic(() => import('@/components/microbit/MakeCodeEmbed'), { ssr: false })

export default function Page() {
  return (
    <main className='min-h-screen'>
      <MakeCodeEditor />
    </main>
  )
}
