'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAssembly } from '@/features/assembly/hooks/useAssemblyOptimized'
import { StepInfoPanel } from './StepInfoPanel'
import { StepController } from './StepController'
import { RealtimeControlPanel } from './RealtimeControlPanel'
import { SceneRenderer } from '@/features/assembly/components/test/SceneRenderer'
import { useParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setIsShiftPressed } from '@/features/assembly/slice/assemblySlice'
import { useGetEmulatorByIdQuery } from '@/features/emulator/api/emulatorApi' // ✅ Import hook có sẵn

export default function Workspace3D({
  assemblyUrl,
  showUI = true,
  onStepComplete
}: {
  assemblyUrl?: string
  showUI?: boolean
  onStepComplete?: (stepId: string) => void
}) {
  const { id } = useParams()
  const orbitControlsRef = useRef<any>(null)
  const transformControlsRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const isTransforming = useAppSelector((state) => state.assembly.isTransforming)

  const [transformMode, setTransformMode] = useState<'translate' | 'rotate'>('translate')
  const [stepIndex, setStepIndex] = useState(0)
  const [runtimeComponentOverrides, setRuntimeComponentOverrides] = useState<
    Record<string, { rotation: { x: number; y: number; z: number }; translation: { x: number; y: number; z: number } }>
  >({})

  // ✅ Fetch emulator data từ API
  const {
    data: emulatorResponse,
    isLoading: isLoadingEmulator,
    error: errorEmulator
  } = useGetEmulatorByIdQuery({ emulationId: id as string }, { skip: !id })

  const {
    assembly,
    instances,
    currentActivity,
    currentStep,
    isLoading: isLoadingAssembly,
    error: errorAssembly,
    loadAssembly,
    nextStep,
    previousStep
  } = useAssembly()

  // ✅ Load assembly khi có data từ API
  useEffect(() => {
    if (emulatorResponse?.data?.definitionJson) {
      try {
        // definitionJson có thể là string hoặc object
        const assemblyData =
          typeof emulatorResponse.data.definitionJson === 'string'
            ? JSON.parse(emulatorResponse.data.definitionJson)
            : emulatorResponse.data.definitionJson

        // Load assembly với inline data
        loadAssembly('inline', assemblyData)
      } catch (err) {
        console.error('Failed to parse assembly data:', err)
      }
    }
  }, [emulatorResponse, loadAssembly])

  // sync step
  useEffect(() => {
    if (currentActivity && currentStep) {
      const index = currentActivity.steps.findIndex((s: any) => s.actionId === currentStep.actionId)
      setStepIndex(index)
    }
  }, [currentActivity, currentStep])

  // hotkey shift / transform mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') dispatch(setIsShiftPressed(true))
      if (currentStep?.actionId === 'action_adjust_additional_connector_arms') {
        if (e.key.toLowerCase() === 't') setTransformMode('translate')
        if (e.key.toLowerCase() === 'r') setTransformMode('rotate')
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') dispatch(setIsShiftPressed(false))
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [currentStep?.actionId])

  // disable orbit khi transform
  useEffect(() => {
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = !isTransforming
  }, [isTransforming])

  const maxStep = currentActivity?.steps.length || 0
  const clampedStep = Math.min(Math.max(stepIndex, 0), Math.max(maxStep - 1, 0))

  const getComponentElements = useCallback(
    (componentId: string): string[] => {
      if (!assembly?.components?.squares) return []
      const component = assembly.components.squares.find((c: any) => c.id === componentId)
      if (!component) return []
      return [...(component.elements.straws || []), ...(component.elements.connectors || [])]
    },
    [assembly]
  )

  const visibleInstances = useMemo(() => {
    if (!assembly || !instances || !currentActivity) {
      return { straws: [], connectors: [] }
    }

    const totalSteps = currentActivity.steps.length
    if (totalSteps === 0) return { straws: [], connectors: [] }

    const stepsUpToNow = currentActivity.steps.slice(0, Math.min(clampedStep + 1, totalSteps))
    const allowedActionIds = new Set(stepsUpToNow.map((s: any) => s.actionId))
    const actionsForNow = (assembly.actions || []).filter((a) => allowedActionIds.has(a.id))

    let showAll = false
    const visibleStrawIds = new Set<string>()
    const visibleConnectorIds = new Set<string>()

    for (const action of actionsForNow) {
      if (action.targets) {
        if (Array.isArray(action.targets)) {
          for (const id of action.targets) {
            visibleConnectorIds.add(id)
            visibleStrawIds.add(id)
          }
        } else if (action.targets === 'all') {
          showAll = true
        }
      }

      if (action.connectionGroup && assembly.connections?.[action.connectionGroup]) {
        const conns = assembly.connections[action.connectionGroup]
        for (const c of conns) {
          visibleStrawIds.add(c.strawId)
          visibleConnectorIds.add(c.connectorId)
        }
      }

      if (action.type === 'transform_component' && action.component) {
        const componentElements = getComponentElements(action.component)
        for (const elementId of componentElements) {
          if (elementId.startsWith('straw_')) {
            visibleStrawIds.add(elementId)
          } else if (elementId.startsWith('connector_')) {
            visibleConnectorIds.add(elementId)
          }
        }
      }

      if ((action.type === 'component_assembly' || action.type === 'assemble_components') && action.assemblyId) {
        const assemblyDef = assembly.assemblies?.[action.assemblyId]
        if (assemblyDef) {
          for (const componentId of assemblyDef.components) {
            const componentElements = getComponentElements(componentId)
            for (const elementId of componentElements) {
              if (elementId.startsWith('straw_')) {
                visibleStrawIds.add(elementId)
              } else if (elementId.startsWith('connector_')) {
                visibleConnectorIds.add(elementId)
              }
            }
          }
        }
      }
    }

    if (showAll) {
      return {
        straws: instances.filter((inst) => inst.category === 'straw'),
        connectors: instances.filter((inst) => inst.category === 'connector')
      }
    }

    return {
      straws: instances.filter((inst) => inst.category === 'straw' && visibleStrawIds.has(inst.id)),
      connectors: instances.filter((inst) => inst.category === 'connector' && visibleConnectorIds.has(inst.id))
    }
  }, [assembly, instances, currentActivity, clampedStep, getComponentElements])

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

  // ✅ Combine loading và error states
  const isLoading = isLoadingEmulator || isLoadingAssembly
  const error = errorEmulator || errorAssembly

  if (isLoading) return <div>Loading assembly...</div>
  if (error) return <div>Error loading assembly: {error?.toString()}</div>
  if (!assembly) return <div>No assembly loaded</div>

  return (
    <div className='relative h-[89.5vh] w-full'>
      {showUI && currentStep && (
        <StepInfoPanel
          stepIndex={stepIndex}
          stepTitle={currentStep.title}
          stepDescription={currentStep.description}
          strawTypeCount={strawTypeCount}
          connectorTypeCount={connectorTypeCount}
        />
      )}

      {showUI && (
        <StepController
          stepIndex={stepIndex}
          maxStep={maxStep}
          onPrev={() => {
            setStepIndex((s) => Math.max(s - 1, 0))
            previousStep()
          }}
          onNext={() => {
            setStepIndex((s) => Math.min(s + 1, maxStep - 1))
            nextStep()
            onStepComplete?.(currentStep?.actionId || '')
          }}
        />
      )}

      {showUI && (
        <RealtimeControlPanel
          assembly={assembly}
          currentStep={currentStep}
          transformMode={transformMode}
          runtimeComponentOverrides={runtimeComponentOverrides}
          setRuntimeComponentOverrides={setRuntimeComponentOverrides}
        />
      )}

      <SceneRenderer
        maxStep={maxStep}
        assembly={assembly}
        stepIndex={stepIndex}
        currentStep={currentStep}
        transformMode={transformMode}
        currentActivity={currentActivity}
        orbitControlsRef={orbitControlsRef}
        visibleInstances={visibleInstances}
        transformControlsRef={transformControlsRef}
        runtimeComponentOverrides={runtimeComponentOverrides}
        getComponentElements={getComponentElements}
        setRuntimeComponentOverrides={setRuntimeComponentOverrides}
      />
    </div>
  )
}
