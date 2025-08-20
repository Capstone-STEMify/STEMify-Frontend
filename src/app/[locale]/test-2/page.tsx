'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Straw } from 'app/[locale]/test-2/Straw'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Group } from 'three'

// ✨ import react-spring
import { a, useTransition } from '@react-spring/three'
import { Connector3D } from './Connector'
import { sceneData } from '@/utils/cts'
import assembly from './straw-test.json'

export default function App() {
  const { straws, connectors } = assembly
  const strawRefs = useRef<Record<string, React.Ref<Group>>>({})
  const connectorRefs = useRef<Record<string, React.Ref<Group>>>({})

  const getStrawRef = (key: string): React.Ref<Group> => (strawRefs.current[key] ??= createRef<Group>())
  const getConnectorRef = (key: string): React.Ref<Group> => (connectorRefs.current[key] ??= createRef<Group>())

  const [step, setStep] = useState(0)
  const maxStep = straws.length + 1
  const clampedStep = Math.min(Math.max(step, 0), maxStep)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setStep((s) => Math.min(s + 1, maxStep))
      if (e.key === 'ArrowLeft') setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maxStep])

  const visibleStraws = useMemo(() => straws.slice(0, Math.max(clampedStep - 1, 0)), [straws, clampedStep])
  const visibleConnectors = useMemo(() => {
    return clampedStep > 0 ? connectors : []
  }, [clampedStep, connectors])

  const transitions = useTransition(visibleStraws, {
    from: { s: 0.9, y: 0.2, o: 0 },
    enter: { s: 1.0, y: 0.0, o: 1 },
    leave: { s: 0.9, y: -0.2, o: 0 },
    trail: 100,
    config: (item, state, phase) => (phase === 'leave' ? { duration: 130 } : { tension: 170, friction: 20 })
  })

  const connectorTransitions = useTransition(visibleConnectors, {
    from: { s: 0.8, y: 0.4, o: 0 },
    enter: { s: 1, y: 0, o: 1 },
    leave: { s: 0.8, y: -0.2, o: 0 },
    trail: 100,
    config: (item, state, phase) => (phase === 'leave' ? { duration: 130 } : { tension: 170, friction: 20 })
  })

  {
    transitions((style, s, _, i) => {
      const refKey = `${s.id}-${i}`
      return (
        <a.group key={refKey} scale={style.s} position-y={style.y}>
          <Straw straw={s} ref={getStrawRef(refKey)} /* fade={style.o} */ />
        </a.group>
      )
    })
  }

  {
    connectorTransitions((style, c, _, i) => {
      const refKey = `${c.id}-${i}`
      return (
        <a.group key={refKey} scale={style.s} position-y={style.y}>
          <Connector3D connector={c} ref={getConnectorRef(refKey)} />
        </a.group>
      )
    })
  }

  return (
    <div className='relative h-screen w-full'>
      {/* Controls */}
      <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow'>
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={clampedStep === 0}
          className='rounded-lg border px-3 py-1 disabled:opacity-50'
          title='Previous (←)'
        >
          Previous
        </button>
        <div className='px-2 text-sm tabular-nums'>
          {clampedStep} / {maxStep}
        </div>
        <button
          onClick={() => setStep((s) => Math.min(s + 1, maxStep))}
          disabled={clampedStep === maxStep}
          className='rounded-lg border px-3 py-1 disabled:opacity-50'
          title='Next (→)'
        >
          Next
        </button>
      </div>

      <Canvas camera={{ position: [20, 10, 30], fov: sceneData.environment.camera.fov }}>
        <color attach='background' args={['#f5f5f5']} />

        {/* 💡 Ambient light nhẹ để làm sáng toàn bộ */}
        <ambientLight color={sceneData.environment.lighting.ambient || '#ffffff'} intensity={0.5} />

        {/* ☀️ Directional light mạnh và chiếu vào đúng hướng */}
        <directionalLight
          color={sceneData.environment.lighting.directional.color || '#ffffff'}
          intensity={sceneData.environment.lighting.directional.intensity || 1.5}
          position={[
            sceneData.environment.lighting.directional.position.x || 5,
            sceneData.environment.lighting.directional.position.y || 10,
            sceneData.environment.lighting.directional.position.z || 5
          ]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <OrbitControls />
        {sceneData.workspace.grid.visible && (
          <Grid
            args={[sceneData.workspace.grid.size, sceneData.workspace.grid.size, sceneData.workspace.grid.divisions]}
          />
        )}

        {/* ✅ RENDER CONNECTORS TRƯỚC */}
        {connectorTransitions((style, c, _, i) => {
          const refKey = `${c.id}-${i}`
          return (
            <a.group key={refKey} scale={style.s} position-y={style.y}>
              <Connector3D connector={c} ref={getConnectorRef(refKey)} />
            </a.group>
          )
        })}

        {/* ✅ RENDER STRAWS SAU */}
        {transitions((style, s, _, i) => {
          const refKey = `${s.id}-${i}`
          return (
            <a.group key={refKey} scale={style.s} position-y={style.y}>
              <Straw straw={s} ref={getStrawRef(refKey)} fade={style.o} />
            </a.group>
          )
        })}
      </Canvas>
    </div>
  )
}
