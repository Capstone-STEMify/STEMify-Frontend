import { forwardRef } from 'react'

export const Straw = forwardRef(function Straw(straw, ref) {
  const { geometry, material, transform } = straw

  return (
    <group
      ref={ref}
      position={[transform.position.x, transform.position.y, transform.position.z]}
      rotation={[transform.rotation.x, transform.rotation.y, transform.rotation.z]}
      scale={[transform.scale.x, transform.scale.y, transform.scale.z]}
    >
      <mesh position={[0, geometry.length / 2, 0]}>
        <cylinderGeometry args={[geometry.diameter / 2, geometry.diameter / 2, geometry.length, 64]} />
        <meshPhysicalMaterial
          color={material.color}
          transparent={material.opacity < 1}
          opacity={material.opacity}
          roughness={material.roughness}
          metalness={material.metalness}
          clearcoat={1}
        />
      </mesh>
    </group>
  )
})
