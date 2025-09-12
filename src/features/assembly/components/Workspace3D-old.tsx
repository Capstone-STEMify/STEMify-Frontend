// 'use client'
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls, Grid } from '@react-three/drei'
// import { Straw } from '@/features/assembly/components/Straw'
// import { createRef, useEffect, useMemo, useRef, useState } from 'react'
// import { Group } from 'three'
// import { a, useTransition } from '@react-spring/three'
// import { Connector3D } from '@/features/assembly/components/Connector'
// import { sceneData } from '@/utils/cts'
// import assembly from '@/features/assembly/data/octahedron.json'
// import strawType from '@/features/assembly/data/straw-type.json'
// import connectorType from '@/features/assembly/data/connector-type.json'
// import Image from 'next/image'

// export default function Workspace3D() {
//   const { steps } = assembly
//   const strawRefs = useRef<Record<string, React.Ref<Group>>>({})
//   const connectorRefs = useRef<Record<string, React.Ref<Group>>>({})

//   const getStrawRef = (key: string): React.Ref<Group> => (strawRefs.current[key] ??= createRef<Group>())
//   const getConnectorRef = (key: string): React.Ref<Group> => (connectorRefs.current[key] ??= createRef<Group>())

//   const [step, setStep] = useState(0)
//   const maxStep = steps.length
//   const clampedStep = Math.min(Math.max(step, 0), maxStep)
//   const currentStep = steps[clampedStep - 1]

//   const strawTypeCount = useMemo(() => {
//     const counts: Record<string, number> = {}
//     currentStep?.straws?.forEach((s) => {
//       counts[s.id] = (counts[s.id] || 0) + 1
//     })
//     return counts
//   }, [currentStep])

//   const connectorTypeCount = useMemo(() => {
//     const counts: Record<string, number> = {}
//     currentStep?.connectors?.forEach((c) => {
//       counts[c.id] = (counts[c.id] || 0) + 1
//     })
//     return counts
//   }, [currentStep])

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, maxStep))
//       if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0))
//     }
//     window.addEventListener('keydown', onKey)
//     return () => window.removeEventListener('keydown', onKey)
//   }, [maxStep])

//   const visibleStraws = useMemo(() => {
//     if (clampedStep === 0) return []
//     return steps.slice(0, clampedStep).flatMap((s) => s.straws || [])
//   }, [clampedStep])

//   const visibleConnectors = useMemo(() => {
//     if (clampedStep === 0) return []
//     return steps.slice(0, clampedStep).flatMap((s) => s.connectors || [])
//   }, [clampedStep])

//   const transitions = useTransition(visibleStraws, {
//     from: { s: 0.9, y: 0.2, o: 0 },
//     enter: { s: 1.0, y: 0.0, o: 1 },
//     leave: null,
//     trail: 100,
//     config: { tension: 170, friction: 20 }
//   })

//   const connectorTransitions = useTransition(visibleConnectors, {
//     from: { s: 0.8, y: 0.4, o: 0 },
//     enter: { s: 1, y: 0, o: 1 },
//     leave: null,
//     trail: 100,
//     config: { tension: 170, friction: 20 }
//   })

//   return (
//     <div className='relative h-screen w-full'>
//       {/* Step Description Panel */}
//       {clampedStep > 0 && (
//         <div className='absolute top-4 left-4 z-10 w-100 rounded-xl border bg-white/90 px-4 py-3 text-sm shadow'>
//           <div className='text-sky-custom-600 mb-2 text-lg font-semibold'>Step {clampedStep}</div>
//           <div className='text-lg text-gray-700'>{steps[clampedStep - 1]?.description}</div>

//           <div className='mt-4'>
//             <div className='mb-1 font-semibold text-gray-600'>Straws:</div>
//             <ul className='space-y-1'>
//               {Object.entries(strawTypeCount).map(([typeId, count]) => {
//                 const type = strawType.find((t) => t.id === typeId)
//                 return (
//                   <li key={typeId} className='flex items-center gap-2'>
//                     <Image
//                       src={type?.imageUrl || ''}
//                       alt={type?.name || ''}
//                       className='object-contain'
//                       width={100}
//                       height={100}
//                     />
//                     <span>
//                       {type?.name || typeId}: x{count}
//                     </span>
//                   </li>
//                 )
//               })}
//             </ul>
//           </div>

//           <div className='mt-3'>
//             <div className='mb-1 font-semibold text-gray-600'>Connectors:</div>
//             <ul className='space-y-1'>
//               {Object.entries(connectorTypeCount).map(([typeId, count]) => {
//                 const type = connectorType.find((t) => t.id === typeId)
//                 return (
//                   <li key={typeId} className='flex items-center gap-2'>
//                     <Image
//                       src={type?.imageUrl || ''}
//                       alt={type?.name || ''}
//                       className='object-contain'
//                       width={100}
//                       height={100}
//                     />
//                     <span>
//                       {type?.name || typeId}: x{count}
//                     </span>
//                   </li>
//                 )
//               })}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Step Controller */}
//       <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow'>
//         <button
//           onClick={() => setStep((s) => Math.max(s - 1, 0))}
//           disabled={clampedStep === 0}
//           className='rounded-lg border px-3 py-1 disabled:opacity-50'
//           title='Previous (←)'
//         >
//           Previous
//         </button>
//         <div className='px-2 text-sm tabular-nums'>
//           {clampedStep} / {maxStep}
//         </div>
//         <button
//           onClick={() => setStep((s) => Math.min(s + 1, maxStep))}
//           disabled={clampedStep === maxStep}
//           className='rounded-lg border px-3 py-1 disabled:opacity-50'
//           title='Next (→)'
//         >
//           Next
//         </button>
//       </div>

//       {/* Canvas */}
//       <Canvas camera={{ position: [20, 10, 30], fov: sceneData.environment.camera.fov }}>
//         <color attach='background' args={['#f5f5f5']} />
//         <ambientLight color={sceneData.environment.lighting.ambient || '#ffffff'} intensity={0.5} />
//         <directionalLight
//           color={sceneData.environment.lighting.directional.color || '#ffffff'}
//           intensity={sceneData.environment.lighting.directional.intensity || 1.5}
//           position={[
//             sceneData.environment.lighting.directional.position.x || 5,
//             sceneData.environment.lighting.directional.position.y || 10,
//             sceneData.environment.lighting.directional.position.z || 5
//           ]}
//           castShadow
//           shadow-mapSize-width={1024}
//           shadow-mapSize-height={1024}
//         />
//         <OrbitControls />
//         {sceneData.workspace.grid.visible && (
//           <Grid
//             args={[sceneData.workspace.grid.size, sceneData.workspace.grid.size, sceneData.workspace.grid.divisions]}
//           />
//         )}

//         {connectorTransitions((style, c, _, i) => {
//           const refKey = `${c.id}-${i}`
//           return (
//             <a.group key={refKey} scale={style.s} position-y={style.y}>
//               <Connector3D connector={c} ref={getConnectorRef(refKey)} />
//             </a.group>
//           )
//         })}

//         {transitions((style, s, _, i) => {
//           const refKey = `${s.id}-${i}`
//           return (
//             <a.group key={refKey} scale={style.s} position-y={style.y}>
//               <Straw straw={s} ref={getStrawRef(refKey)} fade={style.o} />
//             </a.group>
//           )
//         })}
//       </Canvas>
//     </div>
//   )
// }

import React from 'react'

export default function Workspace3D() {
  return (
    <div>Workspace3D</div>
  )
}