import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ActionRunner({ actions, refs }) {
  const state = useRef({
    currentIndex: 0,
    isRunning: false
  })

  const runAction = (action) => {
    if (!action) return
    const targetRef = refs[action.targetId]?.current
    if (!targetRef) return

    if (action.type === 'move') {
      const keyframes = action.animation.keyframes
      const start = keyframes[0].transform.position
      const end = keyframes[1].transform.position
      const duration = action.parameters.duration || 1
      let elapsed = 0

      const animate = () => {
        elapsed += 1 / 60
        const t = Math.min(elapsed / duration, 1)
        const easedT = t * t * (3 - 2 * t)

        targetRef.position.lerpVectors(
          new THREE.Vector3(start.x, start.y, start.z),
          new THREE.Vector3(end.x, end.y, end.z),
          easedT
        )

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          runNextAction(action)
        }
      }

      animate()
    }

    if (action.type === 'connect') {
      // giả lập "snap" – đặt straw vào đúng port
      const joint = actions.find((a) => a.id === action.targetId || a.targetId === action.targetId)
      const jointObj = joint?.targetId
      const jointData = actions.find((a) => a.id === jointObj)

      // Đơn giản hóa: gọi runNextAction ngay
      runNextAction(action)
    }

    if (action.type === 'highlight') {
      const keyframes = action.animation.keyframes
      let elapsed = 0
      const loop = action.parameters.loop
      const duration = action.parameters.duration || 1
      let currentKF = 0

      const animate = () => {
        elapsed += 1 / 60
        const t = elapsed / duration
        const frameA = keyframes[currentKF % keyframes.length]
        const frameB = keyframes[(currentKF + 1) % keyframes.length]

        if (targetRef?.material && targetRef.material.color) {
          const colorA = new THREE.Color(frameA.material.color)
          const colorB = new THREE.Color(frameB.material.color)
          const lerpedColor = colorA.lerp(colorB, t)
          targetRef.material.color = lerpedColor
        }

        if (t >= 1) {
          currentKF++
          elapsed = 0
          if (!loop && currentKF >= keyframes.length - 1) {
            runNextAction(action)
            return
          }
        }

        requestAnimationFrame(animate)
      }

      animate()
    }

    if (action.type === 'shake') {
      // action_4: làm đối tượng rung nhẹ để kiểm tra độ chắc
      let elapsed = 0
      const duration = action.parameters.duration || 1
      const original = targetRef.position.clone()

      const animate = () => {
        elapsed += 1 / 60
        const t = elapsed / duration

        targetRef.position.x = original.x + (Math.random() - 0.5) * 0.2
        targetRef.position.y = original.y + (Math.random() - 0.5) * 0.2

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          targetRef.position.copy(original)
          runNextAction(action)
        }
      }

      animate()
    }
  }

  const runNextAction = (currentAction) => {
    const nextId = currentAction.triggers?.[0]?.nextActionId
    if (!nextId) return
    const next = actions.find((a) => a.id === nextId)
    runAction(next)
  }

  const handleStart = () => {
    if (state.current.isRunning) return
    state.current.isRunning = true
    const first = actions.find((a) => a.order === 1)
    runAction(first)
  }

  useEffect(() => {
    window.addEventListener('click', handleStart)
    return () => window.removeEventListener('click', handleStart)
  }, [actions, refs])

  return null
}
