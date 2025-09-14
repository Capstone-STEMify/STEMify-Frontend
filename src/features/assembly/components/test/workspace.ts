import * as THREE from 'three'
export const EULER_ORDER: THREE.EulerOrder = 'XYZ'
export function composeRot(base: { x: number; y: number; z: number }, comp: { x: number; y: number; z: number }) {
  const qBase = new THREE.Quaternion().setFromEuler(new THREE.Euler(base.x || 0, base.y || 0, base.z || 0, EULER_ORDER))
  const qComp = new THREE.Quaternion().setFromEuler(new THREE.Euler(comp.x || 0, comp.y || 0, comp.z || 0, EULER_ORDER))
  const qFinal = qComp.multiply(qBase) // Rcomp * Rbase
  const eFinal = new THREE.Euler().setFromQuaternion(qFinal, EULER_ORDER)
  return { x: eFinal.x, y: eFinal.y, z: eFinal.z }
}
