import { useRef, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function ConnectorModel(props: any) {
  const ref = useRef<any>(null)
  const { scene } = useGLTF('/models/connector_4legs.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])
  useEffect(() => {
    if (ref.current) {
      const snapPoints = [
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(0, -0.2, 0),
        new THREE.Vector3(0.2, 0, 0),
        new THREE.Vector3(-0.2, 0, 0)
      ]
      ref.current.userData.snapPoints = snapPoints
    }
  }, [])

  return <primitive ref={ref} object={clonedScene} {...props} />
}
