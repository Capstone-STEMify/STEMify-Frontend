'use client'

import Workspace3D from '@/features/assembly/components/Workspace3D'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative">
      {/* Navigation to Strawbees2 direct test */}
      <div className="absolute top-4 right-4 z-20">
        {/* <Link 
          href="/code-lab/strawbees2-direct"
          className="block bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-center"
        >
          Test Strawbees2 Model
        </Link> */}
      </div>
      
      <Workspace3D />
    </div>
  )
}
