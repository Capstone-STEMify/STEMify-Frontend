'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Strawbees2Direct } from '@/features/assembly/components/Strawbees2Direct'
import Workspace3D from '@/features/assembly/components/Workspace3D'
import Link from 'next/link'
export default function Strawbees2DirectPage() {
  return (
    <div className='relative h-screen w-full'>
      {/* Header */}
      <div className='absolute top-4 left-4 z-10 rounded-xl border bg-white/90 px-4 py-3 shadow'>
        <h1 className='text-2xl font-bold text-sky-600'>Strawbees2 Direct Test</h1>
        <p className='text-gray-600'>Direct implementation based on your reference code</p>
        <p className='mt-1 text-sm text-gray-500'>Using useFrame for continuous animation</p>
      </div>

      {/* Navigation */}
      <div className='absolute top-4 right-4 z-20 space-x-2'>
        <Link
          href='/code-lab'
          className='rounded-lg bg-gray-500 px-3 py-2 text-sm text-white shadow-lg transition-colors hover:bg-gray-600'
        >
          ← Code Lab
        </Link>
        <Link
          href='/code-lab/strawbees2-basic'
          className='rounded-lg bg-green-500 px-3 py-2 text-sm text-white shadow-lg transition-colors hover:bg-green-600'
        >
          Basic Test
        </Link>
        <Link
          href='/code-lab/strawbees2-test'
          className='rounded-lg bg-blue-500 px-3 py-2 text-sm text-white shadow-lg transition-colors hover:bg-blue-600'
        >
          Advanced Test
        </Link>
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
        <color attach='background' args={['#f0f0f0']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

        <Grid
          args={[20, 20, 20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor='#6f6f6f'
          sectionSize={5}
          sectionThickness={1}
          sectionColor='#9d4b4b'
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />

        {/* Direct Strawbees2 Model */}
        <Strawbees2Direct />

        {/* Additional lighting */}
        <pointLight position={[-10, 10, -10]} intensity={0.5} color='#ffffff' />
        <pointLight position={[10, -10, 10]} intensity={0.3} color='#ffffff' />
      </Canvas>

      <Workspace3D assemblyUrl='/assemblies/optimized/octahedron.json' showUI={true} />

      {/* Status Panel */}
      <div className='absolute bottom-4 left-4 z-10 rounded-xl border bg-white/90 px-4 py-3 shadow'>
        <h3 className='mb-2 font-semibold'>Direct Implementation:</h3>
        <div className='text-sm text-gray-600'>
          <div>✅ Using useFrame for continuous animation</div>
          <div>🔄 Arm1: Sin wave -30° to +30°</div>
          <div>🔄 Arm2: Sin wave -20° to +20° (opposite phase)</div>
          <div>🎯 Check console for model structure</div>
          <div>🔧 Axes helpers show pivot points</div>
        </div>
      </div>

      {/* Instructions */}
      <div className='absolute right-4 bottom-4 z-10 max-w-xs rounded-xl border bg-white/90 px-4 py-3 shadow'>
        <h3 className='mb-2 font-semibold'>Animation Details:</h3>
        <div className='space-y-1 text-sm text-gray-600'>
          <div>📐 Arm1: Continuous rotation Y-axis</div>
          <div>📐 Arm2: Continuous rotation Y-axis</div>
          <div>⏱️ 2Hz animation frequency</div>
          <div>🎨 Red/Blue spheres show arm positions</div>
          <div>🔄 Green cube shows status</div>
        </div>
      </div>
    </div>
  )
}
