'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: any
  materials: any
}

interface ModelData {
  url: string
  scale: number
}

interface ModelViewerProps {
  model: ModelData
}

function Model({ url, scale }: ModelData) {
  const { scene } = useGLTF(url) as GLTFResult
  const modelRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={modelRef} rotation={[0, Math.PI, 0]}>
      <primitive object={scene.clone()} scale={scale} />
    </group>
  )
}

export default function ModelViewer({ model }: ModelViewerProps) {
  useGLTF.preload(model.url)

  return (
    <Canvas key={model.url} camera={{ position: [0, 1, 8], fov: 50 }}>
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Model url={model.url} scale={model.scale} />
        <OrbitControls enableZoom={false}/>
      </Suspense>
    </Canvas>
  )
}