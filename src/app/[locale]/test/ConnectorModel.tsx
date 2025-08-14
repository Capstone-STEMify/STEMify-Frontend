import { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Connector } from 'app/[locale]/test/component.type'

useGLTF.preload('/models/connector_4legs.glb')

export interface ConnectorModelProps {
  connector: Connector
}

export function ConnectorModel({ connector }: ConnectorModelProps) {
  const ref = useRef<THREE.Object3D>(null)
  const { scene } = useGLTF('/models/connector_4legs.glb')

  // Clone mô hình 1 lần duy nhất
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    if (!ref.current) return

    // Gắn snapPoints vào userData (từ ports hoặc tạm thời fix)
    const snapPoints = connector.ports.map((port) => {
      const { x, y, z } = port.localPosition
      return new THREE.Vector3(x, y, z)
    })

    ref.current.userData.snapPoints = snapPoints
    ref.current.userData.id = connector.id
  }, [connector])

  return (
    <primitive
      ref={ref}
      object={clonedScene}
      position={[connector.transform.position.x, connector.transform.position.y, connector.transform.position.z]}
      rotation={[connector.transform.rotation.x, connector.transform.rotation.y, connector.transform.rotation.z]}
      scale={[connector.transform.scale.x, connector.transform.scale.y, connector.transform.scale.z]}
    />
  )
}
