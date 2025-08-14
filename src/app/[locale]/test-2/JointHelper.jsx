import * as THREE from 'three'

export default function JointHelper({ joint, straws, connectors }) {
  const getWorldPos = (compId, attachId, isStraw) => {
    const list = isStraw ? straws : connectors
    const comp = list.find((c) => c.id === compId)
    const t = comp.transform.position
    const offset =
      comp.endpoints?.start?.id === attachId
        ? comp.endpoints.start.localPosition
        : comp.endpoints?.end?.localPosition || comp.ports?.find((p) => p.id === attachId)?.localPosition

    return new THREE.Vector3(t.x + offset.x, t.y + offset.y, t.z + offset.z)
  }

  const posA = getWorldPos(
    joint.componentA.componentId,
    joint.componentA.attachmentPointId,
    joint.componentA.componentType === 'straw'
  )
  const posB = getWorldPos(
    joint.componentB.componentId,
    joint.componentB.attachmentPointId,
    joint.componentB.componentType === 'straw'
  )

  return (
    <line>
      <bufferGeometry attach='geometry' setFromPoints={[posA, posB]} />
      <lineBasicMaterial attach='material' color='lime' />
    </line>
  )
}
