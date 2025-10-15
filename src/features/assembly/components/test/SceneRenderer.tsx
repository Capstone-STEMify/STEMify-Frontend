'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, TransformControls } from '@react-three/drei'
import { a, TransitionFn } from '@react-spring/three'
import * as THREE from 'three'
import { Straw } from '@/features/assembly/components/Straw'
import { Connector3D } from '@/features/assembly/components/Connector'
import { Assembly, AssemblyInstance } from '@/features/assembly/hooks/useAssemblyOptimized'
import { createRef, Dispatch, Ref, RefObject, SetStateAction, useCallback, useMemo, useRef, useState } from 'react'
import { Group } from 'three'
import { useTransition } from '@react-spring/three'
import { composeRot, EULER_ORDER } from '@/features/assembly/components/test/workspace'
import { ThirdSquareTransformHandle } from './ThirdSquareTransformHandle'
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks'
import { setIsTransforming } from '@/features/assembly/slice/assemblySlice'
import { use } from 'matter'

type SceneRendererProps = {
  stepIndex: number
  maxStep: number
  assembly: Assembly
  currentStep?: any
  visibleInstances: {
    straws: AssemblyInstance[]
    connectors: AssemblyInstance[]
  }
  runtimeComponentOverrides: Record<
    string,
    {
      rotation: {
        x: number
        y: number
        z: number
      }
      translation: {
        x: number
        y: number
        z: number
      }
    }
  >
  orbitControlsRef: RefObject<any>
  transformControlsRef: RefObject<any>
  currentActivity: any
  transformMode: 'translate' | 'rotate'
  getComponentElements: (componentId: string) => string[]
  setRuntimeComponentOverrides: Dispatch<
    SetStateAction<
      Record<
        string,
        {
          rotation: {
            x: number
            y: number
            z: number
          }
          translation: {
            x: number
            y: number
            z: number
          }
        }
      >
    >
  >
}

export function SceneRenderer({
  stepIndex,
  maxStep,
  assembly,
  visibleInstances,
  currentStep,
  orbitControlsRef,
  currentActivity,
  transformControlsRef,
  runtimeComponentOverrides,
  transformMode,
  getComponentElements,
  setRuntimeComponentOverrides
}: SceneRendererProps) {
  const mode = useAppSelector((state) => state.assembly.mode)
  const [disableComponentTransform, setDisableComponentTransform] = useState(false)
  const clampedStep = Math.min(Math.max(stepIndex, 0), Math.max(maxStep - 1, 0))
  const strawRefs = useRef<Record<string, React.Ref<Group>>>({})
  const connectorRefs = useRef<Record<string, React.Ref<Group>>>({})
  const isShiftPressed = useAppSelector((state) => state.assembly.isShiftPressed)
  const dispatch = useAppDispatch()
  const getStrawRef = (key: string): React.Ref<Group> => (strawRefs.current[key] ??= createRef<Group>())
  const getConnectorRef = (key: string): React.Ref<Group> => (connectorRefs.current[key] ??= createRef<Group>())
  const [componentAnimT, setComponentAnimT] = useState(1)

  const activeConnections = useMemo(() => {
    if (!assembly || !currentActivity) return {}

    const totalSteps = currentActivity.steps.length
    const stepsUpToNow = currentActivity.steps.slice(0, Math.min(clampedStep + 1, totalSteps))
    const allowedActionIds = new Set(stepsUpToNow.map((s: any) => s.actionId))
    const actionsForNow = (assembly.actions || []).filter((a) => allowedActionIds.has(a.id))

    const map: Record<
      string,
      { start?: { connectorId: string; port: number }; end?: { connectorId: string; port: number } }
    > = {}

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
  const getRotationAlignXToDir = useCallback((dir: THREE.Vector3) => {
    const from = new THREE.Vector3(1, 0, 0)
    const to = dir.clone().normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(from, to)
    const e = new THREE.Euler().setFromQuaternion(q, EULER_ORDER)
    return { x: e.x, y: e.y, z: e.z }
  }, [])
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

        //  BEST PRACTICE: Use XYZ rotation order (consistent with Straw.tsx)
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
        //   console.log(' [DEBUG] Component Matrix Transform:', {
        //     instanceRotation: { rx, ry, rz },
        //     degrees: { rx: rx * 180/Math.PI, ry: ry * 180/Math.PI, rz: rz * 180/Math.PI },
        //     pivot, translation, originalPos: { x: pos.x, y: pos.y, z: pos.z }
        //   })
        // }

        // Rotation matrix multiplication (XYZ order: Rx * Ry * Rz)
        //  CORRECT XYZ ORDER MATRIX
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
        //   console.log(' [DEBUG] Position Transform:', {
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
          //  COMPONENT ROTATION: Return component rotation for unified application
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
              //  BEST PRACTICE: Check for transformAsUnit constraint
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
                const qTo = new THREE.Quaternion().setFromEuler(
                  new THREE.Euler(rot.x || 0, rot.y || 0, rot.z || 0, EULER_ORDER)
                )
                const qOut = new THREE.Quaternion().slerpQuaternions(qFrom, qTo, t)
                const eOut = new THREE.Euler().setFromQuaternion(qOut, EULER_ORDER)
                finalMatrix = {
                  position: lerpPos,
                  rotation: { x: eOut.x, y: eOut.y, z: eOut.z },
                  scale: matrix.scale
                }
              }

              // 🔧 DEBUG: Log when component matrix is being applied (DISABLED for performance)
              // console.log(` [COMPONENT MATRIX APPLICATION] ${componentId}:`, {
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
      if (elementComponentId && !disableComponentTransform) {
        const component = assembly.components?.squares?.find((c) => c.id === elementComponentId)

        if (component) {
          //  STEP 1: Check if we have runtime overrides for this component (priority)
          const runtimeOverride = runtimeComponentOverrides[elementComponentId]

          if (runtimeOverride) {
            console.log(
              `[RUNTIME OVERRIDE] Applying to ${elementComponentId} for instance ${instanceId}:`,
              runtimeOverride
            )

            const pivot = component.center
            const translation = runtimeOverride.translation || { x: 0, y: 0, z: 0 }
            const rotation = runtimeOverride.rotation || { x: 0, y: 0, z: 0 }

            // Apply runtime override transformation
            const transform = applyComponentMatrixTransform(finalPos, pivot, rotation, translation)
            finalPos = transform.position
            finalRot = composeRot(baseRotation, rotation)

            console.log(` [RUNTIME OVERRIDE] Final transform for ${instanceId}:`, {
              finalPos,
              finalRot
            })
          }
          //  STEP 2: Fallback to component matrices if available
          else if (currentComponentMatrices[elementComponentId]) {
            const componentMatrix = currentComponentMatrices[elementComponentId]
            const pivot = component.center
            const translation = componentMatrix.position || { x: 0, y: 0, z: 0 }
            const rotation = componentMatrix.rotation || { x: 0, y: 0, z: 0 }

            // Apply component matrix transformation - transformAsUnit: true
            const transform = applyComponentMatrixTransform(finalPos, pivot, rotation, translation)
            finalPos = transform.position

            //  Orientation: nhân quaternion để child xoay cùng component
            finalRot = composeRot(baseRotation, rotation)
          }
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

              //  LEGACY: Use component matrix transform for consistency
              const transform = applyComponentMatrixTransform(finalPos, pivot, rotation, translation)
              finalPos = transform.position
              //  Use quaternion multiplication instead of Euler addition
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
      componentAnimT,
      transformMode
    ]
  )

  const getArmPoseForConnector = useCallback(
    (connectorId: string): Record<string, { x: number; y: number; z: number }> => {
      if (!assembly || !currentActivity || clampedStep < 0) return {}

      const finalPose: Record<string, { x: number; y: number; z: number }> = {}

      for (let i = 0; i <= clampedStep; i++) {
        const step = currentActivity.steps[i]
        if (!step) continue

        const action = assembly.actions.find((a) => a.id === step.actionId)
        if (!action || action.type !== 'transform_arm') continue

        if (Array.isArray(action.targets) && action.targets.includes(connectorId)) {
          const connectorArmTransforms = (action as any).connectorArmTransforms
          const armTransforms = connectorArmTransforms?.[connectorId] || (action as any).armTransforms

          if (armTransforms) {
            for (const armName of Object.keys(armTransforms)) {
              const t = armTransforms[armName]
              if (t) {
                finalPose[armName] = {
                  x: t.x ?? finalPose[armName]?.x ?? 0,
                  y: t.y ?? finalPose[armName]?.y ?? 0,
                  z: t.z ?? finalPose[armName]?.z ?? 0
                }
              }
            }
          }
        }
      }

      return finalPose
    },
    [assembly, currentActivity, clampedStep]
  )

  const getConnectorInstanceById = useCallback(
    (id: string) => visibleInstances.connectors.find((c) => c.id === id),
    [visibleInstances.connectors]
  )

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

  return (
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
      <ambientLight intensity={0.5} />
      <OrbitControls ref={orbitControlsRef} />
      <Grid
        args={[100, 100, 10]}
        position={[0, 0, 0]}
        cellSize={1}
        sectionSize={1 * 10}
        cellColor='#888888'
        sectionColor='#444444'
      />

      {/* Straws */}
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

      {/* Connectors */}
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
              modelUrl={instance.data?.baseGeometry.modelPath}
            />
          </a.group>
        )
      })}

      {currentStep?.actionId === 'action_adjust_additional_connector_arms' &&
        (() => {
          const comp = assembly.components?.squares?.find((c: any) => c.id === 'square_third')
          if (!comp) return null
          const currentT = runtimeComponentOverrides['square_third']?.translation || { x: 0, y: 0, z: 0 }
          const currentR = runtimeComponentOverrides['square_third']?.rotation || { x: 0, y: 0, z: 0 }
          return (
            <>
              <ThirdSquareTransformHandle
                componentCenter={comp.center}
                currentTranslation={currentT}
                currentRotation={currentR}
                transformMode={transformMode}
                transformControlsRef={transformControlsRef}
              />
              <TransformControls
                ref={transformControlsRef}
                mode={transformMode}
                showX={true}
                showY={true}
                showZ={true}
                onMouseDown={() => {
                  if (isShiftPressed) {
                    dispatch(setIsTransforming(true))
                  }
                }}
                onMouseUp={() => {
                  dispatch(setIsTransforming(false))
                }}
                onObjectChange={() => {
                  if (!isShiftPressed) return
                  const obj = transformControlsRef.current?.object
                  if (!obj) return

                  if (transformMode === 'translate') {
                    // Calculate new translation relative to component center
                    const newT = {
                      x: obj.position.x - comp.center.x,
                      y: obj.position.y - comp.center.y,
                      z: obj.position.z - comp.center.z
                    }

                    console.log(' TransformControls translation update:', {
                      objectPosition: obj.position,
                      componentCenter: comp.center,
                      newTranslation: newT
                    })

                    setRuntimeComponentOverrides((prev) => ({
                      ...prev,
                      square_third: {
                        rotation: prev.square_third?.rotation || { x: 0, y: 0, z: 0 },
                        translation: newT
                      }
                    }))
                  } else if (transformMode === 'rotate') {
                    // Calculate new rotation from object rotation
                    const newR = {
                      x: obj.rotation.x,
                      y: obj.rotation.y,
                      z: obj.rotation.z
                    }

                    console.log('TransformControls rotation update:', {
                      objectRotation: obj.rotation,
                      newRotation: newR
                    })

                    setRuntimeComponentOverrides((prev) => ({
                      ...prev,
                      square_third: {
                        rotation: newR,
                        translation: prev.square_third?.translation || { x: 0, y: 0, z: 0 }
                      }
                    }))
                  }
                }}
              />
            </>
          )
        })()}

      {/* Transform Controls */}
    </Canvas>
  )
}
