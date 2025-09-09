// 'use client'
// import { Suspense } from 'react'
// import Workspace3DNew from '@/features/assembly/components/Workspace3D-new'

// export default function OctahedronNewPage() {
//   return (
//     <div className="h-screen w-full">
//       <Suspense
//         fallback={
//           <div className="flex h-screen items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
//               <p className="mt-4 text-lg">Loading 3D Assembly...</p>
//             </div>
//           </div>
//         }
//       >
//         <Workspace3DNew
//           assemblyUrl="/features/assembly/data/octahedron-new.json"
//           mode="player"
//           showUI={true}
//           onStepComplete={(stepId) => {
//             console.log('Step completed:', stepId)
//           }}
//         />
//       </Suspense>
//     </div>
//   )
// }

export default function page() {
  return <div>page</div>
}
