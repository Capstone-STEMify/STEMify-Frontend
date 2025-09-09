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
function composeRot(base: { x: number; y: number; z: number }, comp: { x: number; y: number; z: number }) {
  const qBase = new THREE.Quaternion().setFromEuler(new THREE.Euler(base.x || 0, base.y || 0, base.z || 0, EULER_ORDER))
  const qComp = new THREE.Quaternion().setFromEuler(new THREE.Euler(comp.x || 0, comp.y || 0, comp.z || 0, EULER_ORDER))
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

  const { assembly, instances, currentActivity, currentStep, isLoading, error, loadAssembly, nextStep, previousStep } =
    useAssembly()

  const [stepIndex, setStepIndex] = useState(0)
  // Runtime overrides for realtime controls (per component)
  const [runtimeComponentOverrides, setRuntimeComponentOverrides] = useState<
    Record<string, { rotation: { x: number; y: number; z: number }; translation: { x: number; y: number; z: number } }>
  >({})

  // Temporary disable component transformation for debugging
  const [disableComponentTransform, setDisableComponentTransform] = useState(false)
  // Component animation progress for current action (0..1)
  const [componentAnimT, setComponentAnimT] = useState(1)

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

  // Animate component movement for any component_assembly action (generic, JSON-driven)
  useEffect(() => {
    if (!assembly || !currentStep) {
      setComponentAnimT(1)
      return
    }

    const action = (assembly.actions || []).find((a: any) => a.id === currentStep.actionId)
    if (action && action.type === 'component_assembly') {
      const durationMs = Math.max(100, Math.floor(((action.duration as number) || 2) * 1000))
      let rafId = 0
      const start = performance.now()
      setComponentAnimT(0)

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        setComponentAnimT(t)
        if (t < 1) rafId = requestAnimationFrame(tick)
      }

      rafId = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafId)
    } else {
      // For other steps, apply instantly
      setComponentAnimT(1)
    }
  }, [assembly, currentStep])

  const maxStep = currentActivity?.steps.length || 0
  const clampedStep = Math.min(Math.max(stepIndex, 0), Math.max(maxStep - 1, 0))

  // Helper function to get component elements
  const getComponentElements = useCallback(
    (componentId: string): string[] => {
      if (!assembly?.components?.squares) return []

      const component = assembly.components.squares.find((c: any) => c.id === componentId)
      if (!component) return []

      return [...(component.elements.straws || []), ...(component.elements.connectors || [])]
    },
    [assembly]
  )

  // Get visible instances based on current step using actions/connection groups
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
        straws: instances.filter((inst) => inst.category === 'straw'),
        connectors: instances.filter((inst) => inst.category === 'connector')
      }
    }

    return {
      straws: instances.filter((inst) => inst.category === 'straw' && visibleStrawIds.has(inst.id)),
      connectors: instances.filter((inst) => inst.category === 'connector' && visibleConnectorIds.has(inst.id))
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

  // Build active connections up to current step: strawId -> { start: {connectorId, port}, end: {...} }
  const activeConnections = useMemo(() => {
    if (!assembly || !currentActivity) return {}

    const totalSteps = currentActivity.steps.length
    const stepsUpToNow = currentActivity.steps.slice(0, Math.min(clampedStep + 1, totalSteps))
    const allowedActionIds = new Set(stepsUpToNow.map((s: any) => s.actionId))
    const actionsForNow = (assembly.actions || []).filter((a) => allowedActionIds.has(a.id))

    const map: Record<string, { start?: { connectorId: string; port: number }; end?: { connectorId: string; port: number } }> = {}

    for (const action of actionsForNow) {
      if (action.connectionGroup && assembly.connections?.[action.connectionGroup]) {
        const conns = assembly.connections[action.connectionGroup]
        for (const c of conns) {
          const entry = (map[c.strawId] ||= {})
          if (c.endpoint === 'start') entry.start = { connectorId: c.connectorId, port: c.port }
          if (c.endpoint === 'end') entry.end = { connectorId: c.connectorId, port: c.port }
        }
      }
    }

    return map
  }, [assembly, currentActivity, clampedStep])

  // Helper: get connector instance by id
  const getConnectorInstanceById = useCallback(
    (id: string) => visibleInstances.connectors.find((c) => c.id === id),
    [visibleInstances.connectors]
  )

  // Helper: compute world position of a connector port by index using final transform overrides
  const getConnectorPortWorldPosition = useCallback(
    (connectorId: string, portIndex: number): { x: number; y: number; z: number } | null => {
      const inst = getConnectorInstanceById(connectorId)
      if (!inst) return null

      const base = {
        position: inst.transform.position,
        rotation: inst.transform.rotation
      }
      const tr = getTransformOverrides(connectorId, base.position, base.rotation)
      const port = inst.data.portTemplate?.[portIndex]
      if (!port) return null
      const lp = port.localPosition || { x: 0, y: 0, z: 0 }
      // Apply rotation then translation
      const e = new THREE.Euler(tr.rotation.x || 0, tr.rotation.y || 0, tr.rotation.z || 0, EULER_ORDER)
      const q = new THREE.Quaternion().setFromEuler(e)
      const v = new THREE.Vector3(lp.x, lp.y, lp.z).applyQuaternion(q)
      return { x: v.x + tr.position.x, y: v.y + tr.position.y, z: v.z + tr.position.z }
    },
    [getConnectorInstanceById]
  )

  // Helper: compute rotation to align local X axis to direction vector
  const getRotationAlignXToDir = useCallback((dir: THREE.Vector3) => {
    const from = new THREE.Vector3(1, 0, 0)
    const to = dir.clone().normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(from, to)
    const e = new THREE.Euler().setFromQuaternion(q, EULER_ORDER)
    return { x: e.x, y: e.y, z: e.z }
  }, [])

  // Calculate armPose for connectors based on ALL previous steps (accumulative)
  const getArmPoseForConnector = useCallback(
    (connectorId: string) => {
      if (!assembly || !currentActivity || clampedStep < 0) return undefined

      let finalArmPose = { arm1: 0, arm2: 0 }

      // Accumulate arm poses from all steps up to current step
      for (let i = 0; i <= clampedStep; i++) {
        const step = currentActivity.steps[i]
        if (!step) continue

        const action = assembly.actions.find((a) => a.id === step.actionId)
        if (!action || action.type !== 'transform_arm') continue

        // Check if this connector is targeted by the action
        if (Array.isArray(action.targets) && action.targets.includes(connectorId)) {
          // Try connectorArmTransforms first (per-connector specific)
          const connectorArmTransforms = (action as any).connectorArmTransforms
          if (connectorArmTransforms && connectorArmTransforms[connectorId]) {
            const transforms = connectorArmTransforms[connectorId]
            // console.log(`Step ${i+1}: Connector-specific arm transforms for ${connectorId}:`, transforms);
            finalArmPose = {
              arm1: transforms.arm_1?.z || finalArmPose.arm1,
              arm2: transforms.arm_2?.z || finalArmPose.arm2
            }
          } else {
            // Fallback to global armTransforms
            const armTransforms = (action as any).armTransforms
            if (armTransforms) {
              console.log(`Step ${i + 1}: Global arm transforms for ${connectorId}:`, armTransforms)
              finalArmPose = {
                arm1: armTransforms.arm_1?.z || finalArmPose.arm1,
                arm2: armTransforms.arm_2?.z || finalArmPose.arm2
              }
            }
          }
        }
      }

      // Only return if there's actually a change from default
      if (finalArmPose.arm1 !== 0 || finalArmPose.arm2 !== 0) {
        // console.log(`Final arm pose for ${connectorId}:`, finalArmPose);
        return finalArmPose
      }

      return undefined
    },
    [assembly, currentActivity, clampedStep]
  )

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

  // Generic instant appear based on action property
  const instantAppear = useMemo(() => {
    if (!assembly || !currentStep) return false
    const action = assembly.actions?.find((a: any) => a.id === currentStep.actionId)
    return action?.instantAppear === true
  }, [assembly, currentStep])

  const transitions = useTransition(visibleInstances.straws, {
    keys: (inst) => inst.id,
    from: instantAppear ? { s: 1.0, y: 0.0, o: 1 } : { s: 0.9, y: 0.2, o: 0 },
    enter: instantAppear ? { s: 1.0, y: 0.0, o: 1 } : { s: 1.0, y: 0.0, o: 1 },
    leave: null,
    trail: instantAppear ? 0 : 100,
    config: instantAppear ? { tension: 1, friction: 0 } : { tension: 170, friction: 20 }
  })

  const connectorTransitions = useTransition(visibleInstances.connectors, {
    keys: (inst) => inst.id,
    from: instantAppear ? { s: 1, y: 0, o: 1 } : { s: 0.8, y: 0.4, o: 0 },
    enter: instantAppear ? { s: 1, y: 0, o: 1 } : { s: 1, y: 0, o: 1 },
    leave: null,
    trail: instantAppear ? 0 : 100,
    config: instantAppear ? { tension: 1, friction: 0 } : { tension: 170, friction: 20 }
  })

  // Aggregate per-instance rotation overrides from actions (e.g., transform_instance)
  const getRotationOverrideForInstance = useCallback(
    (instanceId: string) => {
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
    },
    [assembly, currentActivity, clampedStep]
  )

  // Helper function to get component for an element
  const getElementComponent = useCallback(
    (elementId: string): string | null => {
      if (!assembly?.components?.squares) return null

      for (const component of assembly.components.squares) {
        if (component.elements.straws.includes(elementId) || component.elements.connectors.includes(elementId)) {
          return component.id
        }
      }
      return null
    },
    [assembly]
  )

  // Compute position and rotation overrides including component matrix inheritance
  const getTransformOverrides = useCallback(
    (instanceId: string, basePosition: any, baseRotation: any) => {
      if (!assembly || !currentActivity || clampedStep < 0) return { position: basePosition, rotation: baseRotation }

      let finalPos = { ...basePosition }
      let finalRot = { ...baseRotation }
      const currentComponentMatrices: Record<
        string,
        {
          position: { x: number; y: number; z: number }
          rotation: { x: number; y: number; z: number }
          scale?: { x: number; y: number; z: number }
        }
      > = {}

      // 🔧 FIX: Component-assembly matrix transform with unified XYZ rotation order
      const applyComponentMatrixTransform = (
        pos: { x: number; y: number; z: number },
        pivot: { x: number; y: number; z: number },
        rotation: { x: number; y: number; z: number },
        translation: { x: number; y: number; z: number }
      ) => {
        // Translate to component center (pivot)
        const x = pos.x - pivot.x
        const y = pos.y - pivot.y
        const z = pos.z - pivot.z

        // 🎯 BEST PRACTICE: Use XYZ rotation order (consistent with Straw.tsx)
        // Component transforms as unit - all elements maintain relative positions
        const rx = rotation.x || 0,
          ry = rotation.y || 0,
          rz = rotation.z || 0
        const cx = Math.cos(rx),
          sx = Math.sin(rx)
        const cy = Math.cos(ry),
          sy = Math.sin(ry)
        const cz = Math.cos(rz),
          sz = Math.sin(rz)

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
              const pivot = transformData.pivot || 'component_center'

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

              // If this is the current positioning action, interpolate matrix using componentAnimT
              let finalMatrix = matrix
              if (isCurrentAction && action.type === 'component_assembly') {
                const t = componentAnimT
                const pos = matrix.position || { x: 0, y: 0, z: 0 }
                const rot = matrix.rotation || { x: 0, y: 0, z: 0 }
                // Lerp position from 0 to target
                const lerpPos = { x: pos.x * t, y: pos.y * t, z: pos.z * t }
                // Slerp rotation from identity to target (XYZ order)
                const qFrom = new THREE.Quaternion() // identity
                const qTo = new THREE.Quaternion().setFromEuler(new THREE.Euler(rot.x || 0, rot.y || 0, rot.z || 0, EULER_ORDER))
                const qOut = new THREE.Quaternion().slerpQuaternions(qFrom, qTo, t)
                const eOut = new THREE.Euler().setFromQuaternion(qOut, EULER_ORDER)
                finalMatrix = {
                  position: lerpPos,
                  rotation: { x: eOut.x, y: eOut.y, z: eOut.z },
                  scale: matrix.scale
                }
              }

              // 🔧 DEBUG: Log when component matrix is being applied (DISABLED for performance)
              // console.log(`🔍 [COMPONENT MATRIX APPLICATION] ${componentId}:`, {
              //   isCurrentAction,
              //   hasRuntimeOverride: !!runtimeOverride,
              //   originalMatrix: transformData.matrix,
              //   finalMatrix,
              //   stepId: currentStep?.actionId
              // })

              // Store enhanced matrix with component assembly metadata
              currentComponentMatrices[componentId] = {
                ...finalMatrix,
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
        const component = assembly.components?.squares?.find((c) => c.id === elementComponentId)

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
    },
    [
      assembly,
      currentActivity,
      clampedStep,
      getComponentElements,
      getElementComponent,
      currentStep?.actionId,
      runtimeComponentOverrides,
      componentAnimT
    ]
  )

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900'></div>
          <p className='mt-4 text-lg'>Loading assembly...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center text-red-600'>
          <h2 className='mb-2 text-xl font-bold'>Error Loading Assembly</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!assembly) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>No assembly loaded</p>
      </div>
    )
  }

  return (
    <div className='relative h-screen w-full'>
      {/* Step Description Panel */}
      {showUI && clampedStep >= 0 && currentStep && (
        <div className='absolute top-4 left-4 z-10 w-100 rounded-xl border bg-white/90 px-4 py-3 text-sm shadow'>
          <div className='mb-2 text-lg font-semibold text-sky-600'>Step {clampedStep + 1}</div>
          <div className='text-lg text-gray-700'>{currentStep.title}</div>
          {currentStep.description && <div className='mt-1 text-sm text-gray-600'>{currentStep.description}</div>}

          <div className='mt-4'>
            <div className='mb-1 font-semibold text-gray-600'>Straws:</div>
            <ul className='space-y-1'>
              {Object.entries(strawTypeCount).map(([templateId, count]) => {
                return (
                  <li key={templateId} className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded-full bg-green-400' title={templateId} />
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
                    <div className='h-4 w-4 rounded-sm bg-red-400' title={templateId} />
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

      {/* Realtime Control Panel for Component Assembly */}
      {showUI && (() => {
        const action = assembly?.actions?.find((a: any) => a.id === currentStep?.actionId)
        return action?.type === 'component_assembly' && action?.showRealtimeControls === true
      })() && (
        <div className='absolute bottom-4 left-4 z-10 w-[360px] rounded-xl border bg-white/95 p-3 shadow'>
          {(() => {
            const action = assembly?.actions?.find((a: any) => a.id === currentStep?.actionId)
            const componentTransforms = action?.componentTransforms || {}
            const firstComponentId = Object.keys(componentTransforms)[0]
            const firstTransform = componentTransforms[firstComponentId]?.matrix
            
            if (!firstComponentId || !firstTransform) return null
            
            return (
              <>
                <div className='mb-2 font-semibold text-gray-700'>Realtime Controls — {action?.name || 'Component Assembly'}</div>
                <div className='mb-1 text-xs text-gray-500'>
                  🎯 Component Assembly: TransformAsUnit = true - All elements move together
                </div>
                <div className='grid grid-cols-3 gap-2 text-xs'>
                  <div className='col-span-3 font-medium text-gray-600'>Rotation (rad)</div>
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={`rot-${axis}`} className='flex flex-col gap-1'>
                      <label className='text-[11px] text-gray-500'>R{axis.toUpperCase()}</label>
                      <input
                        type='number'
                        step='0.01745'
                        className='w-full rounded border px-2 py-1'
                        value={runtimeComponentOverrides[firstComponentId]?.rotation?.[axis] ?? (firstTransform.rotation?.[axis] || 0)}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value || '0')
                          setRuntimeComponentOverrides((prev) => ({
                            ...prev,
                            [firstComponentId]: {
                              rotation: {
                                x: axis === 'x' ? (isNaN(v) ? (firstTransform.rotation?.x || 0) : v) : (prev[firstComponentId]?.rotation?.x ?? (firstTransform.rotation?.x || 0)),
                                y: axis === 'y' ? (isNaN(v) ? (firstTransform.rotation?.y || 0) : v) : (prev[firstComponentId]?.rotation?.y ?? (firstTransform.rotation?.y || 0)),
                                z: axis === 'z' ? (isNaN(v) ? (firstTransform.rotation?.z || 0) : v) : (prev[firstComponentId]?.rotation?.z ?? (firstTransform.rotation?.z || 0))
                              },
                              translation: prev[firstComponentId]?.translation ?? firstTransform.position
                            }
                          }))
                        }}
                      />
                    </div>
                  ))}
                </div>
                  <div className='col-span-3 mt-2 font-medium text-gray-600'>Translation</div>
                  {(['x', 'y', 'z'] as const).map((axis) => (
                    <div key={`trs-${axis}`} className='flex flex-col gap-1'>
                      <label className='text-[11px] text-gray-500'>T{axis.toUpperCase()}</label>
                      <input
                        type='number'
                        step='0.5'
                        className='w-full rounded border px-2 py-1'
                        value={runtimeComponentOverrides[firstComponentId]?.translation?.[axis] ?? (firstTransform.position?.[axis] || 0)}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value || '0')
                          setRuntimeComponentOverrides((prev) => ({
                            ...prev,
                            [firstComponentId]: {
                              rotation: prev[firstComponentId]?.rotation ?? firstTransform.rotation,
                              translation: {
                                x: prev[firstComponentId]?.translation?.x ?? (firstTransform.position?.x || 0),
                                y: prev[firstComponentId]?.translation?.y ?? (firstTransform.position?.y || 0),
                                z: prev[firstComponentId]?.translation?.z ?? (firstTransform.position?.z || 0),
                                [axis]: isNaN(v) ? (firstTransform.position?.[axis] || 0) : v
                              }
                            }
                          }))
                        }}
                      />
                    </div>
                  ))}
                  <div className='mt-3 flex gap-2'>
                    <button
                      className='rounded border px-2 py-1 text-xs'
                      onClick={() =>
                        setRuntimeComponentOverrides((prev) => ({
                          ...prev,
                          [firstComponentId]: { 
                            rotation: firstTransform.rotation || { x: 0, y: 0, z: 0 }, 
                            translation: firstTransform.position || { x: 0, y: 0, z: 0 } 
                          }
                        }))
                      }
                    >
                      Reset
                    </button>
                    <button 
                      className='rounded border px-2 py-1 text-xs' 
                      onClick={() => setRuntimeComponentOverrides({})}
                    >
                      Clear
                    </button>
                  </div>
                </>
              )
            })()}
        </div>
      )}

      {/* Canvas */}
      <Canvas
        camera={{
          position: [
            assembly.scene.environment.camera.position.x,
            assembly.scene.environment.camera.position.y,
            assembly.scene.environment.camera.position.z
          ],
          fov: assembly.scene.environment.camera.fov
        }}
      >
        <primitive object={new AxesHelper(10)} />
        <color attach='background' args={[assembly.scene.environment.background]} />
        <ambientLight color={assembly.scene.environment.lighting.ambient} intensity={0.5} />
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
                  ports:
                    instance.data.portTemplate?.map((port: any, index: number) => ({
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

                    // Port-based snapping: if both endpoints are connected, align straw between ports
                    const conn = activeConnections[instance.id]
                    if (conn?.start && conn?.end) {
                      const pA = getConnectorPortWorldPosition(conn.start.connectorId, conn.start.port)
                      const pB = getConnectorPortWorldPosition(conn.end.connectorId, conn.end.port)
                      if (pA && pB) {
                        const a = new THREE.Vector3(pA.x, pA.y, pA.z)
                        const b = new THREE.Vector3(pB.x, pB.y, pB.z)
                        const mid = a.clone().add(b).multiplyScalar(0.5)
                        const dir = b.clone().sub(a)
                        const rot = getRotationAlignXToDir(dir)

                        return {
                          position: { x: mid.x, y: mid.y, z: mid.z },
                          rotation: rot,
                          scale: base.scale
                        }
                      }
                    }

                    // 🔧 FIX: For component assembly, use only component rotation, not additive
                    const elementComponentId = getElementComponent(instance.id)
                    const isInComponentAssembly = elementComponentId && !disableComponentTransform

                    return {
                      position: tr.position,
                      rotation: isInComponentAssembly
                        ? tr.rotation
                        : o
                          ? {
                              x: tr.rotation.x + (o.x || 0),
                              y: tr.rotation.y + (o.y || 0),
                              z: tr.rotation.z + (o.z || 0)
                            }
                          : tr.rotation,
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
