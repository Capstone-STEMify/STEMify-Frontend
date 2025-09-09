'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { Straw } from '@/features/assembly/components/Straw'
import { createRef, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { AxesHelper, Group } from 'three'
import * as THREE from 'three'
import { a, useTransition } from '@react-spring/three'
import { Connector3D } from '@/features/assembly/components/Connector'
import { useAssembly } from '@/features/assembly/hooks/useAssemblyOptimized'
import { sceneData } from '@/utils/cts'
import Image from 'next/image'

// ✅ Quaternion rotation composition helper
const EULER_ORDER: THREE.EulerOrder = 'XYZ'
function composeRot(base: {x:number;y:number;z:number}, comp: {x:number;y:number;z:number}) {
  const qBase = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(base.x||0, base.y||0, base.z||0, EULER_ORDER)
  )
  const qComp = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(comp.x||0, comp.y||0, comp.z||0, EULER_ORDER)
  )
  const qFinal = qComp.multiply(qBase) // Rcomp * Rbase
  const eFinal = new THREE.Euler().setFromQuaternion(qFinal, EULER_ORDER)
  return { x: eFinal.x, y: eFinal.y, z: eFinal.z }
}

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
  // Runtime overrides for realtime controls (per component)
  const [runtimeComponentOverrides, setRuntimeComponentOverrides] = useState<Record<string, { rotation: { x: number; y: number; z: number }; translation: { x: number; y: number; z: number } }>>({})
  
  // Temporary disable component transformation for debugging
  const [disableComponentTransform, setDisableComponentTransform] = useState(false)

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

  // Helper function to get component elements
  const getComponentElements = useCallback((componentId: string): string[] => {
    if (!assembly?.components?.squares) return []
    
    const component = assembly.components.squares.find((c: any) => c.id === componentId)
    if (!component) return []
    
    return [...(component.elements.straws || []), ...(component.elements.connectors || [])]
  }, [assembly])

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

      // Component-based actions
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

      // 🔧 FIX: Assembly actions (both component_assembly and legacy assemble_components)
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

  // Calculate armPose for connectors based on ALL previous steps (accumulative)
  const getArmPoseForConnector = useCallback((connectorId: string) => {
    if (!assembly || !currentActivity || clampedStep < 0) return undefined;
    
    let finalArmPose = { arm1: 0, arm2: 0 };
    
    // Accumulate arm poses from all steps up to current step
    for (let i = 0; i <= clampedStep; i++) {
      const step = currentActivity.steps[i];
      if (!step) continue;
      
      const action = assembly.actions.find(a => a.id === step.actionId);
      if (!action || action.type !== 'transform_arm') continue;
      
      // Check if this connector is targeted by the action
      if (Array.isArray(action.targets) && action.targets.includes(connectorId)) {
        // Try connectorArmTransforms first (per-connector specific)
        const connectorArmTransforms = (action as any).connectorArmTransforms;
        if (connectorArmTransforms && connectorArmTransforms[connectorId]) {
          const transforms = connectorArmTransforms[connectorId];
          // console.log(`Step ${i+1}: Connector-specific arm transforms for ${connectorId}:`, transforms);
          finalArmPose = {
            arm1: transforms.arm_1?.z || finalArmPose.arm1,
            arm2: transforms.arm_2?.z || finalArmPose.arm2
          };
        } else {
          // Fallback to global armTransforms
          const armTransforms = (action as any).armTransforms;
          if (armTransforms) {
            console.log(`Step ${i+1}: Global arm transforms for ${connectorId}:`, armTransforms);
            finalArmPose = {
              arm1: armTransforms.arm_1?.z || finalArmPose.arm1,
              arm2: armTransforms.arm_2?.z || finalArmPose.arm2
            };
          }
        }
      }
    }
    
    // Only return if there's actually a change from default
    if (finalArmPose.arm1 !== 0 || finalArmPose.arm2 !== 0) {
      // console.log(`Final arm pose for ${connectorId}:`, finalArmPose);
      return finalArmPose;
    }
    
    return undefined;
  }, [assembly, currentActivity, clampedStep]);

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

  // Aggregate per-instance rotation overrides from actions (e.g., transform_instance)
  const getRotationOverrideForInstance = useCallback((instanceId: string) => {
    if (!assembly || !currentActivity || clampedStep < 0) return undefined

    let rot = { x: 0, y: 0, z: 0 }

    for (let i = 0; i <= clampedStep; i++) {
      const step = currentActivity.steps[i]
      if (!step) continue

      const action = assembly.actions.find((a: any) => a.id === step.actionId)
      if (!action) continue

      if (action.type === 'transform_instance') {
        const t = (action as any).instanceTransforms
        if (t && t[instanceId] && t[instanceId].rotation) {
          const r = t[instanceId].rotation
          rot = {
            x: (rot.x || 0) + (r.x || 0),
            y: (rot.y || 0) + (r.y || 0),
            z: (rot.z || 0) + (r.z || 0)
          }
        }
      }
    }

    if (rot.x !== 0 || rot.y !== 0 || rot.z !== 0) return rot
    return undefined
  }, [assembly, currentActivity, clampedStep])

  // Helper function to get component for an element
  const getElementComponent = useCallback((elementId: string): string | null => {
    if (!assembly?.components?.squares) return null
    
    for (const component of assembly.components.squares) {
      if (component.elements.straws.includes(elementId) || component.elements.connectors.includes(elementId)) {
        return component.id
      }
    }
    return null
  }, [assembly])

  // Compute position and rotation overrides including component matrix inheritance
  const getTransformOverrides = useCallback((instanceId: string, basePosition: any, baseRotation: any) => {
    if (!assembly || !currentActivity || clampedStep < 0) return { position: basePosition, rotation: baseRotation }

    let finalPos = { ...basePosition }
    let finalRot = { ...baseRotation }
    let currentComponentMatrices: Record<string, { position: { x: number; y: number; z: number }; rotation: { x: number; y: number; z: number }; scale?: { x: number; y: number; z: number } }> = {}

    // 🔧 FIX: Component-assembly matrix transform with unified XYZ rotation order
    const applyComponentMatrixTransform = (pos: {x:number;y:number;z:number}, pivot: {x:number;y:number;z:number}, rotation: {x:number;y:number;z:number}, translation: {x:number;y:number;z:number}) => {
      // Translate to component center (pivot)
      let x = pos.x - pivot.x
      let y = pos.y - pivot.y  
      let z = pos.z - pivot.z
      
      // 🎯 BEST PRACTICE: Use XYZ rotation order (consistent with Straw.tsx)
      // Component transforms as unit - all elements maintain relative positions
      const rx = rotation.x || 0, ry = rotation.y || 0, rz = rotation.z || 0
      const cx = Math.cos(rx), sx = Math.sin(rx)
      const cy = Math.cos(ry), sy = Math.sin(ry) 
      const cz = Math.cos(rz), sz = Math.sin(rz)
      
      // 🔧 DEBUG: Log rotation values for debugging RZ issues (DISABLED for performance)
      // if (Math.abs(rz) > 0.1) {
      //   console.log('🔍 [DEBUG] Component Matrix Transform:', {
      //     instanceRotation: { rx, ry, rz },
      //     degrees: { rx: rx * 180/Math.PI, ry: ry * 180/Math.PI, rz: rz * 180/Math.PI },
      //     pivot, translation, originalPos: { x: pos.x, y: pos.y, z: pos.z }
      //   })
      // }
      
      // Rotation matrix multiplication (XYZ order: Rx * Ry * Rz)
      // ✅ CORRECT XYZ ORDER MATRIX
      const r11 = cy * cz
      const r12 = -cy * sz
      const r13 = sy
      const r21 = sx * sy * cz + cx * sz
      const r22 = -sx * sy * sz + cx * cz
      const r23 = -sx * cy
      const r31 = -cx * sy * cz + sx * sz
      const r32 = cx * sy * sz + sx * cz
      const r33 = cx * cy
      
      const newX = r11 * x + r12 * y + r13 * z
      const newY = r21 * x + r22 * y + r23 * z
      const newZ = r31 * x + r32 * y + r33 * z
      
      // 🔧 DEBUG: Log transformed position (DISABLED for performance)
      // if (Math.abs(rz) > 0.1) {
      //   console.log('🔍 [DEBUG] Position Transform:', {
      //     before: { x, y, z },
      //     after: { x: newX, y: newY, z: newZ },
      //     final: { 
      //       x: newX + pivot.x + translation.x,
      //       y: newY + pivot.y + translation.y,
      //       z: newZ + pivot.z + translation.z
      //     }
      //   })
      // }
      
      // Translate back from pivot and apply translation
      return {
        position: {
          x: newX + pivot.x + translation.x,
          y: newY + pivot.y + translation.y,
          z: newZ + pivot.z + translation.z
        },
        // 🎯 COMPONENT ROTATION: Return component rotation for unified application
        componentRotation: rotation
      }
    }

    // Process all actions up to current step to build component matrices
    for (let i = 0; i <= clampedStep; i++) {
      const step = currentActivity.steps[i]
      if (!step) continue
      const action = assembly.actions.find((a: any) => a.id === step.actionId)
      if (!action) continue

      // 🔧 FIX: Handle both component_assembly (new) and assemble_components (legacy)
      if (action.type === 'component_assembly' || action.type === 'assemble_components') {
        const componentTransforms = (action as any).componentTransforms || {}
        const isCurrentAction = currentStep?.actionId === action.id
        
        for (const [componentId, transform] of Object.entries(componentTransforms)) {
          const transformData = transform as any
          if (transformData.type === 'matrix_transform') {
            // 🎯 BEST PRACTICE: Check for transformAsUnit constraint
            const transformAsUnit = transformData.transformAsUnit === true
            const pivot = transformData.pivot || "component_center"
            
            // Use runtime override if this is the current action
            const runtimeOverride = isCurrentAction ? runtimeComponentOverrides[componentId] : undefined
            
            let matrix = transformData.matrix
            if (runtimeOverride) {
              matrix = {
                position: runtimeOverride.translation || transformData.matrix.position,
                rotation: runtimeOverride.rotation || transformData.matrix.rotation,
                scale: transformData.matrix.scale
              }
            }
            
            // 🔧 DEBUG: Log when component matrix is being applied (DISABLED for performance)
            // console.log(`🔍 [COMPONENT MATRIX APPLICATION] ${componentId}:`, {
            //   isCurrentAction,
            //   hasRuntimeOverride: !!runtimeOverride,
            //   originalMatrix: transformData.matrix,
            //   finalMatrix: matrix,
            //   stepId: currentStep?.actionId
            // })
            
            // Store enhanced matrix with component assembly metadata
            currentComponentMatrices[componentId] = {
              ...matrix,
              _transformAsUnit: transformAsUnit,
              _pivot: pivot,
              _constraints: transformData.constraints || {}
            }
          }
        }
      }
    }

    // 🔧 FIX: Apply component matrix transformation with transformAsUnit approach
    const elementComponentId = getElementComponent(instanceId)
    if (elementComponentId && currentComponentMatrices[elementComponentId] && !disableComponentTransform) {
      const componentMatrix = currentComponentMatrices[elementComponentId]
      const component = assembly.components?.squares?.find(c => c.id === elementComponentId)
      
      if (component) {
        // 🎯 BEST PRACTICE: Use component center as pivot (component_center pivot)
        const pivot = component.center
        const translation = componentMatrix.position || { x: 0, y: 0, z: 0 }
        const rotation = componentMatrix.rotation || { x: 0, y: 0, z: 0 }
        
        // 🔧 DEBUG: Log component transformation details (DISABLED for performance)
        // if (Math.abs(rotation.z || 0) > 0.1) {
        //   console.log(`🔍 [DEBUG] Component Transform for ${instanceId}:`, {
        //     componentId: elementComponentId,
        //     componentCenter: pivot,
        //     currentRotation: rotation,
        //     degrees: { 
        //       rx: (rotation.x || 0) * 180/Math.PI, 
        //       ry: (rotation.y || 0) * 180/Math.PI, 
        //       rz: (rotation.z || 0) * 180/Math.PI 
        //     },
        //     translation,
        //     basePosition: basePosition,
        //     baseRotation: baseRotation
        //   })
        // }
        
        // Apply component matrix transformation - transformAsUnit: true
        const transform = applyComponentMatrixTransform(finalPos, pivot, rotation, translation)
        finalPos = transform.position
        
        // ✅ Orientation: nhân quaternion để child xoay cùng component
        finalRot = composeRot(baseRotation, rotation)
        
        // 🔧 DEBUG: Log final transform result (DISABLED for performance)
        // if (Math.abs(rotation.z || 0) > 0.1) {
        //   console.log(`🔍 [DEBUG] Final Transform for ${instanceId}:`, {
        //     finalPosition: finalPos,
        //     finalRotation: finalRot,
        //     finalRotationDegrees: { 
        //       rx: (finalRot.x || 0) * 180/Math.PI, 
        //       ry: (finalRot.y || 0) * 180/Math.PI, 
        //       rz: (finalRot.z || 0) * 180/Math.PI 
        //     }
        //   })
        // }
      }
    }

    // 🔧 LEGACY COMPATIBILITY: Apply individual transforms only if not in component assembly
    if (!elementComponentId || !currentComponentMatrices[elementComponentId]) {
      for (let i = 0; i <= clampedStep; i++) {
        const step = currentActivity.steps[i]
        if (!step) continue
        const action = assembly.actions.find((a: any) => a.id === step.actionId)
        if (!action) continue

        if (action.type === 'transform_instance') {
          const t = (action as any).instanceTransforms
          if (t && t[instanceId]) {
            const r = t[instanceId].rotation
            if (r) {
              finalRot = {
                x: (finalRot.x || 0) + (r.x || 0),
                y: (finalRot.y || 0) + (r.y || 0),
                z: (finalRot.z || 0) + (r.z || 0)
              }
            }
          }
        }

        if (action.type === 'transform_group') {
          const tgt: string[] = (action as any).targets || []
          if (tgt.includes(instanceId)) {
            const pivot = (action as any).pivot || { x: 0, y: 0, z: 0 }
            const rotation = (action as any).rotation || { x: 0, y: 0, z: 0 }
            const translation = { x: 0, y: 0, z: 0 }
            
            // 🎯 LEGACY: Use component matrix transform for consistency
            const transform = applyComponentMatrixTransform(finalPos, pivot, rotation, translation)
            finalPos = transform.position
            // ✅ Use quaternion multiplication instead of Euler addition
            finalRot = composeRot(finalRot, rotation)
          }
        }
      }
    }

    return { position: finalPos, rotation: finalRot }
  }, [assembly, currentActivity, clampedStep, getComponentElements, getElementComponent, currentStep?.actionId, runtimeComponentOverrides])

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

      {/* Realtime Control Panel for Assembly (Step 7) */}
      {showUI && currentStep?.actionId === 'action_assemble_diamond' && (
        <div className='absolute bottom-4 left-4 z-10 w-[360px] rounded-xl border bg-white/95 p-3 shadow'>
          <div className='mb-2 font-semibold text-gray-700'>Realtime Controls — Diamond Assembly</div>
          <div className='mb-1 text-xs text-gray-500'>🎯 Component Assembly: TransformAsUnit = true - All elements move together</div>
          <div className='grid grid-cols-3 gap-2 text-xs'>
            <div className='col-span-3 font-medium text-gray-600'>Rotation (rad)</div>
            {(['x','y','z'] as const).map(axis => (
              <div key={`rot-${axis}`} className='flex flex-col gap-1'>
                <label className='text-[11px] text-gray-500'>R{axis.toUpperCase()}</label>
                <input
                  type='number'
                  step='0.01745'
                  className='w-full rounded border px-2 py-1'
                  value={runtimeComponentOverrides['square_second']?.rotation?.[axis] ?? (axis === 'x' ? -0.7854 : 0)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value || '0')
                    setRuntimeComponentOverrides(prev => ({
                      ...prev,
                      square_second: {
                        rotation: { 
                          x: axis === 'x' ? (isNaN(v) ? -0.7854 : v) : (prev.square_second?.rotation?.x ?? -0.7854), 
                          y: axis === 'y' ? (isNaN(v) ? 0 : v) : (prev.square_second?.rotation?.y ?? 0), 
                          z: axis === 'z' ? (isNaN(v) ? 0 : v) : (prev.square_second?.rotation?.z ?? 0) 
                        },
                        translation: prev.square_second?.translation ?? { x: -12, y: 8, z: 0 }
                      }
                    }))
                  }}
                />
              </div>
            ))}

            <div className='col-span-3 mt-2 font-medium text-gray-600'>Translation</div>
            {(['x','y','z'] as const).map(axis => (
              <div key={`trs-${axis}`} className='flex flex-col gap-1'>
                <label className='text-[11px] text-gray-500'>T{axis.toUpperCase()}</label>
                <input
                  type='number'
                  step='0.5'
                  className='w-full rounded border px-2 py-1'
                  value={runtimeComponentOverrides['square_second']?.translation?.[axis] ?? (axis === 'x' ? -12 : axis === 'y' ? 8 : 0)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value || '0')
                    setRuntimeComponentOverrides(prev => ({
                      ...prev,
                      square_second: {
                        rotation: prev.square_second?.rotation ?? { x: -0.7854, y: 0, z: 0 },
                        translation: { x: prev.square_second?.translation?.x ?? -12, y: prev.square_second?.translation?.y ?? 8, z: prev.square_second?.translation?.z ?? 0, [axis]: isNaN(v) ? 0 : v }
                      }
                    }))
                  }}
                />
              </div>
            ))}
          </div>
          <div className='mt-3 flex gap-2'>
            <button
              className='rounded border px-2 py-1 text-xs'
              onClick={() => setRuntimeComponentOverrides(prev => ({
                ...prev,
                square_second: { rotation: { x: -0.7854, y: 0, z: 0 }, translation: { x: -12, y: 8, z: 0 } }
              }))}
            >
              Reset
            </button>
            <button
              className='rounded border px-2 py-1 text-xs'
              onClick={() => setRuntimeComponentOverrides({})}
            >
              Clear
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-blue-50'
              onClick={() => {
                console.log('🔍 [DEBUG] Current Runtime State:', {
                  runtimeOverrides: runtimeComponentOverrides,
                  currentStep: currentStep?.actionId,
                  stepIndex: clampedStep,
                  timestamp: new Date().toISOString()
                })
              }}
            >
              Debug
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-green-50'
              onClick={() => setRuntimeComponentOverrides(prev => ({
                ...prev,
                square_second: { 
                  rotation: { x: -0.7854, y: 0, z: 0 }, 
                  translation: prev.square_second?.translation ?? { x: -12, y: 8, z: 0 } 
                }
              }))}
            >
              RZ→0
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-cyan-50'
              onClick={() => {
                // Test square_base rotation
                setRuntimeComponentOverrides(prev => ({
                  ...prev,
                  square_base: { 
                    rotation: { x: 0, y: 0.5, z: 0 }, 
                    translation: { x: 0, y: 0, z: 0 } 
                  }
                }))
                console.log('🔍 [TEST] Applied RY=0.5 to square_base component')
              }}
            >
              Test Base
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-yellow-50'
              onClick={() => {
                // Test quaternion composition
                const base = { x: 1.5708, y: 0, z: 2.3562 }
                const comp = { x: 0, y: 0.5, z: 0 }
                const result = composeRot(base, comp)
                console.log('🔍 [QUATERNION TEST]:', {
                  baseRotation: base,
                  componentRotation: comp,
                  quaternionResult: result,
                  eulerAddition: {
                    x: base.x + comp.x,
                    y: base.y + comp.y,
                    z: base.z + comp.z
                  }
                })
              }}
            >
              Quat Test
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-purple-50'
              onClick={() => {
                // Quick debug for one specific element
                const sampleElement = visibleInstances.connectors.find(c => c.id === 'connector_3leg_5')
                if (sampleElement) {
                  const basePos = sampleElement.transform.position
                  const baseRot = sampleElement.transform.rotation
                  const result = getTransformOverrides('connector_3leg_5', basePos, baseRot)
                  console.log('🔍 [SINGLE ELEMENT DEBUG] connector_3leg_5:', {
                    base: { position: basePos, rotation: baseRot },
                    result: result,
                    runtimeOverrides: runtimeComponentOverrides
                  })
                }
              }}
            >
              Debug1
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-orange-50'
              onClick={() => {
                // Manual matrix test
                const testPos = { x: 20, y: 0, z: 0 }  // connector_3leg_5 position
                const pivot = { x: 27.8, y: 0, z: 7.8 }  // square_second center
                const rotation = runtimeComponentOverrides['square_second']?.rotation || { x: -0.7854, y: 0, z: 0 }
                const translation = runtimeComponentOverrides['square_second']?.translation || { x: -12, y: 8, z: 0 }
                
                // Manual calculation
                let x = testPos.x - pivot.x  // -7.8
                let y = testPos.y - pivot.y  // 0
                let z = testPos.z - pivot.z  // -7.8
                
                const rx = rotation.x, ry = rotation.y, rz = rotation.z
                const cx = Math.cos(rx), sx = Math.sin(rx)
                const cy = Math.cos(ry), sy = Math.sin(ry)
                const cz = Math.cos(rz), sz = Math.sin(rz)
                
                // XYZ rotation matrix
                const r11 = cy * cz, r12 = -cy * sz, r13 = sy
                const r21 = sx * sy * cz + cx * sz, r22 = -sx * sy * sz + cx * cz, r23 = -sx * cy
                const r31 = -cx * sy * cz + sx * sz, r32 = cx * sy * sz + sx * cz, r33 = cx * cy
                
                const newX = r11 * x + r12 * y + r13 * z
                const newY = r21 * x + r22 * y + r23 * z
                const newZ = r31 * x + r32 * y + r33 * z
                
                const final = {
                  x: newX + pivot.x + translation.x,
                  y: newY + pivot.y + translation.y,
                  z: newZ + pivot.z + translation.z
                }
                
                console.log('🔍 [MANUAL MATRIX TEST]:', {
                  original: testPos, pivot, rotation, translation,
                  relative: { x, y, z },
                  rotated: { x: newX, y: newY, z: newZ },
                  final,
                  rotationDegrees: { rx: rx*180/Math.PI, ry: ry*180/Math.PI, rz: rz*180/Math.PI }
                })
              }}
            >
              Matrix
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-red-50'
              onClick={() => {
                // Check initial state WITHOUT component transform
                console.log('🔍 [INITIAL STATE CHECK]:', {
                  componentCenter: assembly?.components?.squares?.find(c => c.id === 'square_second')?.center,
                  runtimeOverrides: runtimeComponentOverrides,
                  allSquareSecondElements: assembly?.components?.squares?.find(c => c.id === 'square_second')?.elements,
                  sampleOriginalPositions: {
                    connector_3leg_5: visibleInstances.connectors.find(c => c.id === 'connector_3leg_5')?.transform.position,
                    straw_green_5: visibleInstances.straws.find(s => s.id === 'straw_green_5')?.transform.position,
                  },
                  currentStep: currentStep?.actionId,
                  defaultMatrix: {
                    position: { x: -12, y: 8, z: 0 },
                    rotation: { x: -0.7854, y: 0, z: 0 }
                  }
                })
              }}
            >
              Initial
            </button>
            <button
              className={`rounded border px-2 py-1 text-xs ${disableComponentTransform ? 'bg-yellow-200' : 'bg-gray-50'}`}
              onClick={() => setDisableComponentTransform(!disableComponentTransform)}
            >
              {disableComponentTransform ? 'Enable Transform' : 'Disable Transform'}
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-pink-50'
              onClick={() => {
                // Debug rotation values for connectors - test BOTH square_base and square_second
                console.log('🔍 [COMPONENT ROTATION DEBUG]:', {
                  square_base_overrides: runtimeComponentOverrides['square_base'],
                  square_second_overrides: runtimeComponentOverrides['square_second'],
                  currentStep: currentStep?.actionId
                })
                
                // Test square_second connectors (should have rotation)
                const squareSecondConnectors = visibleInstances.connectors.filter(c => 
                  ['connector_3leg_5', 'connector_3leg_6', 'connector_3leg_7', 'connector_3leg_8'].includes(c.id)
                )
                
                console.log('🔍 [SQUARE_SECOND CONNECTORS]:')
                squareSecondConnectors.forEach(connector => {
                  const base = connector.transform
                  const tr = getTransformOverrides(connector.id, base.position, base.rotation)
                  const elementComponentId = getElementComponent(connector.id)
                  const isInComponentAssembly = elementComponentId && !disableComponentTransform
                  
                  console.log(`  ${connector.id}:`, {
                    basePosition: base.position,
                    baseRotation: base.rotation,
                    finalPosition: tr.position,
                    componentRotation: tr.rotation,
                    isInComponentAssembly,
                    elementComponentId,
                    runtimeRY: runtimeComponentOverrides['square_second']?.rotation?.y,
                    finalRotation: isInComponentAssembly ? tr.rotation : tr.rotation
                  })
                })
                
                // Test square_base connectors (should NOT have rotation)
                const squareBaseConnectors = visibleInstances.connectors.filter(c => 
                  ['connector_3leg_1', 'connector_3leg_2', 'connector_3leg_3', 'connector_3leg_4'].includes(c.id)
                )
                
                console.log('🔍 [SQUARE_BASE CONNECTORS]:')
                squareBaseConnectors.forEach(connector => {
                  const base = connector.transform
                  const tr = getTransformOverrides(connector.id, base.position, base.rotation)
                  const elementComponentId = getElementComponent(connector.id)
                  const isInComponentAssembly = elementComponentId && !disableComponentTransform
                  
                  console.log(`  ${connector.id}:`, {
                    basePosition: base.position,
                    baseRotation: base.rotation,
                    finalPosition: tr.position,
                    componentRotation: tr.rotation,
                    isInComponentAssembly,
                    elementComponentId,
                    runtimeRY: runtimeComponentOverrides['square_second']?.rotation?.y,
                    finalRotation: isInComponentAssembly ? tr.rotation : tr.rotation
                  })
                })
              }}
            >
              ConnRot
            </button>
            <button
              className='rounded border px-2 py-1 text-xs bg-indigo-50'
              onClick={() => {
                // Debug position and rotation values for straws - test BOTH square_base and square_second
                console.log('🔍 [STRAW DEBUG]:', {
                  square_base_overrides: runtimeComponentOverrides['square_base'],
                  square_second_overrides: runtimeComponentOverrides['square_second'],
                  currentStep: currentStep?.actionId
                })
                
                // Test square_second straws (should have rotation)
                const squareSecondStraws = visibleInstances.straws.filter(s => 
                  ['straw_green_5', 'straw_green_6', 'straw_green_7', 'straw_green_8'].includes(s.id)
                )
                
                console.log('🔍 [SQUARE_SECOND STRAWS]:')
                squareSecondStraws.forEach(straw => {
                  const base = straw.transform
                  const tr = getTransformOverrides(straw.id, base.position, base.rotation)
                  const elementComponentId = getElementComponent(straw.id)
                  const isInComponentAssembly = elementComponentId && !disableComponentTransform
                  const o = getRotationOverrideForInstance(straw.id)
                  
                  console.log(`  ${straw.id}:`, {
                    basePosition: base.position,
                    baseRotation: base.rotation,
                    finalPosition: tr.position,
                    finalRotation: tr.rotation,
                    isInComponentAssembly,
                    elementComponentId,
                    runtimeRY: runtimeComponentOverrides['square_second']?.rotation?.y,
                    individualOverride: o,
                    finalStrawRotation: isInComponentAssembly ? tr.rotation : (o ? { x: tr.rotation.x + (o.x||0), y: tr.rotation.y + (o.y||0), z: tr.rotation.z + (o.z||0)} : tr.rotation)
                  })
                })
                
                // Test square_base straws (should NOT have rotation)
                const squareBaseStraws = visibleInstances.straws.filter(s => 
                  ['straw_green_1', 'straw_green_2', 'straw_green_3', 'straw_green_4'].includes(s.id)
                )
                
                console.log('🔍 [SQUARE_BASE STRAWS]:')
                squareBaseStraws.forEach(straw => {
                  const base = straw.transform
                  const tr = getTransformOverrides(straw.id, base.position, base.rotation)
                  const elementComponentId = getElementComponent(straw.id)
                  const isInComponentAssembly = elementComponentId && !disableComponentTransform
                  const o = getRotationOverrideForInstance(straw.id)
                  
                  console.log(`  ${straw.id}:`, {
                    basePosition: base.position,
                    baseRotation: base.rotation,
                    finalPosition: tr.position,
                    finalRotation: tr.rotation,
                    isInComponentAssembly,
                    elementComponentId,
                    runtimeRY: runtimeComponentOverrides['square_second']?.rotation?.y,
                    individualOverride: o,
                    finalStrawRotation: isInComponentAssembly ? tr.rotation : (o ? { x: tr.rotation.x + (o.x||0), y: tr.rotation.y + (o.y||0), z: tr.rotation.z + (o.z||0)} : tr.rotation)
                  })
                })
              }}
            >
              StrawRot
            </button>
          </div>
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
        <primitive object={new AxesHelper(10)} />
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
        {sceneData.workspace.grid.visible && (
          <Grid
            args={[sceneData.workspace.grid.size, sceneData.workspace.grid.size, sceneData.workspace.grid.divisions]}
          />
        )}

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
                  transform: (() => {
                    const base = {
                      position: instance.transform.position,
                      rotation: instance.transform.rotation,
                      scale: instance.transform.scale || { x: 1, y: 1, z: 1 }
                    }
                    const tr = getTransformOverrides(instance.id, base.position, base.rotation)
                    
                    // 🔧 FIX: For component assembly, connectors should only rotate with component, not individually
                    const elementComponentId = getElementComponent(instance.id)
                    const isInComponentAssembly = elementComponentId && !disableComponentTransform
                    
                    return {
                      position: tr.position,
                      rotation: isInComponentAssembly ? tr.rotation : tr.rotation, // Use component rotation only
                      scale: base.scale
                    }
                  })(),
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
                armPose={getArmPoseForConnector(instance.id)}
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
                  transform: (() => {
                    const base = {
                      position: instance.transform.position,
                      rotation: instance.transform.rotation,
                      scale: instance.transform.scale || { x: 1, y: 1, z: 1 }
                    }
                    const o = getRotationOverrideForInstance(instance.id)
                    const tr = getTransformOverrides(instance.id, base.position, base.rotation)
                    
                    // 🔧 FIX: For component assembly, use only component rotation, not additive
                    const elementComponentId = getElementComponent(instance.id)
                    const isInComponentAssembly = elementComponentId && !disableComponentTransform
                    
                    return {
                      position: tr.position,
                      rotation: isInComponentAssembly ? tr.rotation : (o ? { x: tr.rotation.x + (o.x||0), y: tr.rotation.y + (o.y||0), z: tr.rotation.z + (o.z||0)} : tr.rotation),
                      scale: base.scale
                    }
                  })(),
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
