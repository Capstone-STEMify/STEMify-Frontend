// components/ModelViewer.tsx
'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
// Import thêm <Environment>
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/stemify.glb')
  return <primitive object={scene} scale={1.5} />
}

export default function ModelViewer() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* XÓA các đèn cũ đi nếu bạn dùng Environment */}
          {/* <ambientLight intensity={0.5} /> */}
          {/* <directionalLight position={[10, 10, 5]} intensity={1} /> */}
          
          <Model />
          
          {/* THÊM Environment vào đây! */}
          {/* "city", "dawn", "lobby", "sunset" là các preset có sẵn */}
          <Environment preset="city" /> 

          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  )
}