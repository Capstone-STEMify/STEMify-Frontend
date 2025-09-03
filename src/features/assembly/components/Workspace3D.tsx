'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Straw } from '@/features/assembly/components/Straw'
import { createRef, useEffect, useMemo, useRef, useState } from 'react'
import { Group } from 'three'
import { a, useTransition } from '@react-spring/three'
import { Connector3D } from '@/features/assembly/components/Connector'
import { useAssembly } from '@/features/assembly/hooks/useAssemblyOptimized'
import Image from 'next/image'

interface Props {
  assemblyUrl?: string
  mode?: 'player' | 'builder'
  showUI?: boolean
  onStepComplete?: (stepId: string) => void
}

export default function Workspace3D({ 
  assemblyUrl = '/assemblies/optimized/octahedron.json',
  mode = 'player',
  showUI = true,
  onStepComplete 
}: Props) {
  const strawRefs = useRef<Record<string, React.Ref<Group>>>({})
  const connectorRefs = useRef<Record<string, React.Ref<Group>>>({})

  const getStrawRef = (key: string): React.Ref<Group> => (strawRefs.current[key] ??= createRef<Group>())
  const getConnectorRef = (key: string): React.Ref<Group> => (connectorRefs.current[key] ??= createRef<Group>())

  const {
    assembly,
    instances,
    currentActivity,
    currentStep,
    isLoading,
    error,
    loadAssembly,
    nextStep,
    previousStep
  } = useAssembly()

  const [stepIndex, setStepIndex] = useState(0)

  // Load assembly on mount
  useEffect(() => {
    loadAssembly(assemblyUrl)
  }, [assemblyUrl, loadAssembly])

  // Sync stepIndex with currentStep
  useEffect(() => {
    if (currentActivity && currentStep) {
      const index = currentActivity.steps.findIndex((s: any) => s.actionId === currentStep.actionId)
      setStepIndex(index)
    }
  }, [currentActivity, currentStep])

  const maxStep = currentActivity?.steps.length || 0
  const clampedStep = Math.min(Math.max(stepIndex, 0), Math.max(maxStep - 1, 0))

  // Get visible instances based on current step using actions/connection groups
  const visibleInstances = useMemo(() => {
    if (!assembly || !instances || !currentActivity) {
      return { straws: [], connectors: [] }
    }

    const totalSteps = currentActivity.steps.length
    if (totalSteps === 0) return { straws: [], connectors: [] }

    const stepsUpToNow = currentActivity.steps.slice(0, Math.min(clampedStep + 1, totalSteps))
    const allowedActionIds = new Set(stepsUpToNow.map((s: any) => s.actionId))

    const actionsForNow = (assembly.actions || []).filter(a => allowedActionIds.has(a.id))

    let showAll = false
    const visibleStrawIds = new Set<string>()
    const visibleConnectorIds = new Set<string>()

    for (const action of actionsForNow) {
      // Targets can be an array of ids or 'all'
      if (action.targets) {
        if (Array.isArray(action.targets)) {
          for (const id of action.targets) {
            visibleConnectorIds.add(id)
          }
        } else if (action.targets === 'all') {
          showAll = true
        }
      }

      // Connection groups map to straw/connector pairs
      if (action.connectionGroup && assembly.connections?.[action.connectionGroup]) {
        const conns = assembly.connections[action.connectionGroup]
        for (const c of conns) {
          visibleStrawIds.add(c.strawId)
          visibleConnectorIds.add(c.connectorId)
        }
      }
    }

    if (showAll) {
      return {
        straws: instances.filter(inst => inst.category === 'straw'),
        connectors: instances.filter(inst => inst.category === 'connector')
      }
    }

    return {
      straws: instances.filter(inst => inst.category === 'straw' && visibleStrawIds.has(inst.id)),
      connectors: instances.filter(inst => inst.category === 'connector' && visibleConnectorIds.has(inst.id))
    }
  }, [assembly, instances, currentActivity, clampedStep])

  const strawTypeCount = useMemo(() => {
    const counts: Record<string, number> = {}
    visibleInstances.straws.forEach((inst) => {
      const templateId = inst.templateId
      counts[templateId] = (counts[templateId] || 0) + 1
    })
    return counts
  }, [visibleInstances.straws])

  const connectorTypeCount = useMemo(() => {
    const counts: Record<string, number> = {}
    visibleInstances.connectors.forEach((inst) => {
      const templateId = inst.templateId
      counts[templateId] = (counts[templateId] || 0) + 1
    })
    return counts
  }, [visibleInstances.connectors])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setStepIndex((s) => Math.min(s + 1, maxStep - 1))
        nextStep()
      }
      if (e.key === 'ArrowLeft') {
        setStepIndex((s) => Math.max(s - 1, 0))
        previousStep()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maxStep, nextStep, previousStep])

  const transitions = useTransition(visibleInstances.straws, {
    keys: (inst) => inst.id,
    from: { s: 0.9, y: 0.2, o: 0 },
    enter: { s: 1.0, y: 0.0, o: 1 },
    leave: null,
    trail: 100,
    config: { tension: 170, friction: 20 }
  })

  const connectorTransitions = useTransition(visibleInstances.connectors, {
    keys: (inst) => inst.id,
    from: { s: 0.8, y: 0.4, o: 0 },
    enter: { s: 1, y: 0, o: 1 },
    leave: null,
    trail: 100,
    config: { tension: 170, friction: 20 }
  })

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg">Loading assembly...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold mb-2">Error Loading Assembly</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!assembly) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">No assembly loaded</p>
      </div>
    )
  }

  return (
    <div className='relative h-screen w-full'>
      {/* Step Description Panel */}
      {showUI && clampedStep >= 0 && currentStep && (
        <div className='absolute top-4 left-4 z-10 w-100 rounded-xl border bg-white/90 px-4 py-3 text-sm shadow'>
          <div className='text-sky-600 mb-2 text-lg font-semibold'>Step {clampedStep + 1}</div>
          <div className='text-lg text-gray-700'>{currentStep.title}</div>
          {currentStep.description && (
            <div className='text-sm text-gray-600 mt-1'>{currentStep.description}</div>
          )}

          <div className='mt-4'>
            <div className='mb-1 font-semibold text-gray-600'>Straws:</div>
            <ul className='space-y-1'>
              {Object.entries(strawTypeCount).map(([templateId, count]) => {
                return (
                  <li key={templateId} className='flex items-center gap-2'>
                    <div 
                      className="w-4 h-4 rounded-full bg-green-400"
                      title={templateId}
                    />
                    <span>
                      {templateId}: x{count}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className='mt-3'>
            <div className='mb-1 font-semibold text-gray-600'>Connectors:</div>
            <ul className='space-y-1'>
              {Object.entries(connectorTypeCount).map(([templateId, count]) => {
                return (
                  <li key={templateId} className='flex items-center gap-2'>
                    <div 
                      className="w-4 h-4 rounded-sm bg-red-400"
                      title={templateId}
                    />
                    <span>
                      {templateId}: x{count}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Step Controller */}
      {showUI && (
        <div className='absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow'>
          <button
            onClick={() => {
              setStepIndex((s) => Math.max(s - 1, 0))
              previousStep()
            }}
            disabled={clampedStep === 0}
            className='rounded-lg border px-3 py-1 disabled:opacity-50'
            title='Previous (←)'
          >
            Previous
          </button>
          <div className='px-2 text-sm tabular-nums'>
            {Math.min(clampedStep + 1, maxStep)} / {maxStep}
          </div>
          <button
            onClick={() => {
              setStepIndex((s) => Math.min(s + 1, maxStep - 1))
              nextStep()
              onStepComplete?.(currentStep?.actionId || '')
            }}
            disabled={clampedStep >= maxStep - 1}
            className='rounded-lg border px-3 py-1 disabled:opacity-50'
            title='Next (→)'
          >
            Next
          </button>
        </div>
      )}

      {/* Canvas */}
      <Canvas camera={{ 
        position: [
          assembly.scene.environment.camera.position.x,
          assembly.scene.environment.camera.position.y,
          assembly.scene.environment.camera.position.z
        ], 
        fov: assembly.scene.environment.camera.fov 
      }}>
        <color attach='background' args={[assembly.scene.environment.background]} />
        <ambientLight 
          color={assembly.scene.environment.lighting.ambient} 
          intensity={0.5} 
        />
        <directionalLight
          color={assembly.scene.environment.lighting.directional.color}
          intensity={assembly.scene.environment.lighting.directional.intensity}
          position={[
            assembly.scene.environment.lighting.directional.position.x,
            assembly.scene.environment.lighting.directional.position.y,
            assembly.scene.environment.lighting.directional.position.z
          ]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <OrbitControls 
          target={[
            assembly.scene.environment.camera.target.x,
            assembly.scene.environment.camera.target.y,
            assembly.scene.environment.camera.target.z
          ]}
        />
        <Grid
          args={[50, 50]}
          cellSize={2}
          cellThickness={0.5}
          cellColor='#6f6f6f'
          sectionSize={10}
          sectionThickness={1}
          sectionColor='#9d4b4b'
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />

        {connectorTransitions((style, instance, _, i) => {
          const refKey = `${instance.id}-${i}`
          return (
            <a.group key={refKey} scale={style.s} position-y={style.y}>
              <Connector3D 
                connector={{
                  id: instance.id,
                  name: instance.data.name || instance.templateId,
                  type: instance.data.type || 'custom',
                  geometry: instance.data.baseGeometry || instance.data.geometry,
                  material: instance.data.material,
                  transform: {
                    position: instance.transform.position,
                    rotation: instance.transform.rotation,
                    scale: instance.transform.scale || { x: 1, y: 1, z: 1 }
                  },
                  ports: instance.data.portTemplate?.map((port: any, index: number) => ({
                    id: `${instance.id}_port_${index}`,
                    localPosition: port.localPosition,
                    orientation: port.orientation,
                    connectionId: null,
                    isAvailable: true,
                    portIndex: index
                  })) || [],
                  constraints: instance.data.constraints || { maxConnections: 3, allowedAngles: [] }
                }}
                ref={getConnectorRef(refKey)} 
                animate={false}
                showDebug={mode === 'builder'}
              />
            </a.group>
          )
        })}

        {transitions((style, instance, _, i) => {
          const refKey = `${instance.id}-${i}`
          return (
            <a.group key={refKey} scale={style.s} position-y={style.y}>
              <Straw 
                straw={{
                  id: instance.id,
                  name: instance.data.name || instance.templateId,
                  geometry: instance.data.baseGeometry || instance.data.geometry,
                  material: instance.data.material,
                  transform: {
                    position: instance.transform.position,
                    rotation: instance.transform.rotation,
                    scale: instance.transform.scale || { x: 1, y: 1, z: 1 }
                  },
                  endpoints: {
                    start: {
                      id: `${instance.id}_start`,
                      localPosition: instance.data.endpointTemplate?.start?.localPosition || { x: -5.6, y: 0, z: 0 },
                      connectionId: null,
                      isAvailable: true
                    },
                    end: {
                      id: `${instance.id}_end`,
                      localPosition: instance.data.endpointTemplate?.end?.localPosition || { x: 5.6, y: 0, z: 0 },
                      connectionId: null,
                      isAvailable: true
                    }
                  },
                  physics: instance.data.physics || { mass: 0.3, friction: 0.4, elasticity: 0.2 }
                }}
                ref={getStrawRef(refKey)} 
                fade={style.o} 
              />
            </a.group>
          )
        })}
      </Canvas>
    </div>
  )
}
