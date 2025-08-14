'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { ConnectorModel } from 'app/[locale]/test-2/Connector'
import { Straw } from 'app/[locale]/test-2/Straw'
import JointHelper from 'app/[locale]/test-2/JointHelper'
import ActionRunner from 'app/[locale]/test-2/ActionRunner'
import ActivityPanel from 'app/[locale]/test-2/ActivityPanel'

import sceneData from '../test-2/test.json'
import { createRef, useRef } from 'react'

export default function App() {
  const { straws, connectors, joints, actions, scene, activities } = sceneData
  const strawRefs = useRef<{ [key: string]: React.RefObject<any> }>({})

  return (
    <div className='relative h-screen w-full'>
      <Canvas camera={{ position: [0, 5, 20], fov: scene.environment.camera.fov }}>
        <ambientLight color={scene.environment.lighting.ambient} />
        <directionalLight
          color={scene.environment.lighting.directional.color}
          intensity={scene.environment.lighting.directional.intensity}
          position={
            Object.values(scene.environment.lighting.directional.position).slice(0, 3) as [number, number, number]
          }
        />
        <OrbitControls />
        <Grid args={[scene.workspace.grid.size, scene.workspace.grid.size, scene.workspace.grid.divisions]} />

        {straws.map((s) => {
          strawRefs.current[s.id] = strawRefs.current[s.id] || createRef()
          return <Straw key={s.id} {...s} ref={strawRefs.current[s.id]} />
        })}
        {connectors.map((c) => (
          <ConnectorModel key={c.id} connector={c} />
        ))}
        {joints.map((j) => (
          <JointHelper key={j.id} joint={j} straws={straws} connectors={connectors} />
        ))}

        <ActionRunner actions={actions} refs={strawRefs.current} />
      </Canvas>

      <ActivityPanel activities={activities} />
    </div>
  )
}
