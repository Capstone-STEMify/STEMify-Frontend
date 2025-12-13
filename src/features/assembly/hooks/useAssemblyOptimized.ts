/**
 * Assembly Hook with Template System Integration
 * Handles loading, streaming, and performance monitoring
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { templateManager } from '../utils/templateManager'
import { LODManager, defaultLODConfig } from '../utils/lodManager'
import { PerformanceProfiler, defaultPerformanceConfig, PerformanceAlert } from '../utils/performanceProfiler'
import { supabase } from '@/libs/supabase/client'

export interface Assembly {
  metadata: {
    version: string
    description: string
    compressionRatio?: string
  }
  templates: {
    materials: Array<{ id: string; source: string; data?: any }>
    components: Array<{ id: string; source: string }>
  }
  components?: {
    squares?: Array<{
      id: string
      name: string
      center: { x: number; y: number; z: number }
      elements: {
        straws: string[]
        connectors: string[]
      }
      connections: string
      bounds?: {
        min: { x: number; y: number; z: number }
        max: { x: number; y: number; z: number }
      }
      state: string
      componentMatrix: {
        position: { x: number; y: number; z: number }
        rotation: { x: number; y: number; z: number }
        scale: { x: number; y: number; z: number }
      }
    }>
  }
  assemblies?: Record<
    string,
    {
      id: string
      name: string
      description: string
      components: string[]
      subAssemblies?: string[]
      assemblyMatrix: {
        position: { x: number; y: number; z: number }
        rotation: { x: number; y: number; z: number }
        scale: { x: number; y: number; z: number }
      }
      state: string
    }
  >
  instances: {
    straws: Array<{
      templateId: string
      instances: Array<{
        id: string
        transform: {
          position: { x: number; y: number; z: number }
          rotation: { x: number; y: number; z: number }
          scale?: { x: number; y: number; z: number }
        }
      }>
    }>
    connectors: Array<{
      templateId: string
      instances: Array<{
        id: string
        transform: {
          position: { x: number; y: number; z: number }
          rotation: { x: number; y: number; z: number }
          scale?: { x: number; y: number; z: number }
        }
      }>
    }>
  }
  connections: Record<
    string,
    Array<{
      strawId: string
      endpoint: 'start' | 'end'
      connectorId: string
      port: number
    }>
  >
  actions: Array<{
    id: string
    name: string
    type: string
    targets?: string[] | string
    connectionGroup?: string
    duration: number
    [key: string]: any
  }>
  activities: Array<{
    id: string
    name: string
    difficulty: string
    estimatedTime: number
    steps: Array<{
      actionId: string
      title: string
    }>
  }>
  scene: {
    environment: any
    lod?: {
      enabled: boolean
      distances: number[]
      autoAdjust: boolean
    }
    streaming?: {
      enabled: boolean
      chunkSize: string
      preloadRadius: number
    }
    performance?: {
      targetFPS: number
      maxDrawCalls: number
      enableOcclusion: boolean
    }
  }
}

export interface AssemblyInstance {
  id: string
  templateId: string
  category: 'straw' | 'connector'
  data: any
  transform: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }
  arms?: Record<string, { x?: number; y?: number; z?: number }>
  lodLevel?: 'high' | 'medium' | 'low'
  isVisible: boolean
  distanceToCamera: number
}

export interface UseAssemblyOptions {
  enableLOD?: boolean
  enableStreaming?: boolean
  enableProfiling?: boolean
  autoOptimize?: boolean
  preloadDistance?: number
}

export interface UseAssemblyReturn {
  // Data
  assembly: Assembly | null
  instances: AssemblyInstance[]
  currentActivity: any
  currentStep: any

  // Performance
  lodManager: LODManager | null
  profiler: PerformanceProfiler | null
  performanceStats: any

  // State
  isLoading: boolean
  loadingProgress: number
  error: string | null
  isOptimized: boolean

  // Actions
  loadAssembly: (source: string, inlineData?: Assembly) => Promise<void>
  updateCameraPosition: (position: { x: number; y: number; z: number }) => void
  setCurrentActivity: (activityId: string) => void
  nextStep: () => void
  previousStep: () => void

  // Performance actions
  recordFrame: (frameTime: number, drawCalls: number, triangles: number) => void
  enableLOD: (enabled: boolean) => void
  getPerformanceReport: () => any

  // Optimization
  optimizeForPerformance: () => void
  resetOptimizations: () => void
}

export function useAssembly(options: UseAssemblyOptions = {}): UseAssemblyReturn {
  const {
    enableLOD = true,
    enableStreaming = true,
    enableProfiling = true,
    autoOptimize = true,
    preloadDistance = 50
  } = options

  // State
  const [assembly, setAssembly] = useState<Assembly | null>(null)
  const [instances, setInstances] = useState<AssemblyInstance[]>([])
  const [currentActivity, setCurrentActivity] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isOptimized, setIsOptimized] = useState(false)
  const [cameraPosition, setCameraPosition] = useState({ x: 25, y: 15, z: 25 })

  // Performance systems
  const [lodManager] = useState(() => (enableLOD ? new LODManager(defaultLODConfig) : null))
  const [profiler] = useState(() => (enableProfiling ? new PerformanceProfiler(defaultPerformanceConfig) : null))
  const [performanceStats, setPerformanceStats] = useState<any>(null)

  // Performance alerts handler
  useEffect(() => {
    if (!profiler) return

    const handleAlert = (alert: PerformanceAlert) => {
      console.warn(`Performance Alert: ${alert.message}`)

      if (autoOptimize && alert.type === 'critical') {
        optimizeForPerformance()
      }
    }

    profiler.onAlert(handleAlert)

    // Update stats periodically
    const statsInterval = setInterval(() => {
      setPerformanceStats(profiler.getCurrentStats())
    }, 1000)

    return () => {
      clearInterval(statsInterval)
    }
  }, [profiler, autoOptimize])

  /**
   * Load assembly from URL
   */
  // const loadAssembly = useCallback(async (url: string) => {
  //   setIsLoading(true)
  //   setError(null)
  //   setLoadingProgress(0)

  //   try {
  //     console.log(`Loading assembly: ${url}`)

  //     // Load assembly definition
  //     const response = await fetch(url)
  //     if (!response.ok) {
  //       throw new Error(`Failed to load assembly: ${response.statusText}`)
  //     }

  //     const assemblyData: Assembly = await response.json()
  //     setLoadingProgress(20)

  //     // Preload all materials (fetch JSON and attach to template)
  //     await Promise.all(
  //       (assemblyData.templates.materials || []).map(async (m) => {
  //         try {
  //           const res = await fetch(m.source)
  //           if (res.ok) {
  //             const data = await res.json()
  //             m.data = data
  //           } else {
  //             console.warn(`Failed to load material file: ${m.source}`)
  //           }
  //         } catch (err) {
  //           console.warn(`Error loading material: ${m.source}`, err)
  //         }
  //       })
  //     )
  //     setLoadingProgress(30)

  //     // Initialize template library (for components, straws, connectors)
  //     await templateManager.initializeLibrary(assemblyData.templates)
  //     setLoadingProgress(40)

  //     // Preload critical templates
  //     const criticalTemplates = [
  //       ...assemblyData.instances.straws.map((s) => s.templateId),
  //       ...assemblyData.instances.connectors.map((c) => c.templateId)
  //     ]
  //     await Promise.all(criticalTemplates.map((id) => templateManager.loadTemplate(id)))
  //     setLoadingProgress(70)

  //     // Helper resolve material
  //     const resolveMaterial = (materialRef?: string) => {
  //       if (!materialRef) return null
  //       const mat = assemblyData.templates.materials.find((m) => m.id === materialRef)
  //       return mat?.data || null
  //     }

  //     // Create instances
  //     const allInstances: AssemblyInstance[] = []

  //     // Straws
  //     for (const strawGroup of assemblyData.instances.straws) {
  //       for (const instance of strawGroup.instances) {
  //         const instanceData = templateManager.createInstance({
  //           id: instance.id,
  //           templateId: strawGroup.templateId,
  //           transform: instance.transform
  //         })
  //         console.log('Instance created:', instanceData)

  //         const material = instanceData.material || resolveMaterial(instanceData.materialRef)
  //         console.log('Yellow straw material:', material)
  //         allInstances.push({
  //           id: instance.id,
  //           templateId: strawGroup.templateId,
  //           category: 'straw',
  //           data: { ...instanceData, material },
  //           transform: instance.transform,
  //           isVisible: true,
  //           distanceToCamera: 0
  //         })
  //       }
  //     }

  //     // Connectors
  //     for (const connectorGroup of assemblyData.instances.connectors) {
  //       for (const instance of connectorGroup.instances) {
  //         const instanceData = templateManager.createInstance({
  //           id: instance.id,
  //           templateId: connectorGroup.templateId,
  //           transform: instance.transform
  //         })

  //         const material = instanceData.material || resolveMaterial(instanceData.materialRef)

  //         allInstances.push({
  //           id: instance.id,
  //           templateId: connectorGroup.templateId,
  //           category: 'connector',
  //           data: { ...instanceData, material },
  //           transform: instance.transform,
  //           isVisible: true,
  //           distanceToCamera: 0
  //         })
  //       }
  //     }

  //     setInstances(allInstances)
  //     setLoadingProgress(90)

  //     // Set assembly and activity
  //     setAssembly(assemblyData)
  //     if (assemblyData.activities.length > 0) {
  //       setCurrentActivity(assemblyData.activities[0])
  //       if (assemblyData.activities[0].steps.length > 0) {
  //         setCurrentStep(assemblyData.activities[0].steps[0])
  //       }
  //     }

  //     setLoadingProgress(100)
  //     setIsOptimized(true)

  //     console.log(`Assembly loaded: ${allInstances.length} instances created`)
  //     console.log(`Compression ratio: ${assemblyData.metadata.compressionRatio || 'N/A'}`)
  //   } catch (err) {
  //     console.error('Failed to load assembly:', err)
  //     setError(err instanceof Error ? err.message : 'Unknown error')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }, [])
  const loadAssembly = useCallback(async (source: string, inlineData?: Assembly) => {
    setIsLoading(true)
    setError(null)
    setLoadingProgress(0)

    try {
      console.log(`Loading assembly: ${source}`)

      let assemblyData: Assembly | null = null

      if (inlineData) {
        assemblyData = inlineData
      }
      // Fallback: fetch từ file public
      else {
        const response = await fetch(source)
        if (!response.ok) throw new Error(`Failed to load assembly: ${response.statusText}`)
        assemblyData = await response.json()
      }

      // 👉 Đảm bảo assemblyData tồn tại
      if (!assemblyData) throw new Error('Empty assembly data')

      // ... phần xử lý materials, templates, instances giữ nguyên
      setLoadingProgress(20)

      await Promise.all(
        (assemblyData.templates.materials || []).map(async (m) => {
          try {
            const res = await fetch(m.source)
            if (res.ok) {
              const data = await res.json()
              m.data = data
            }
          } catch (err) {
            console.warn(`Error loading material: ${m.source}`, err)
          }
        })
      )

      setLoadingProgress(30)
      await templateManager.initializeLibrary(assemblyData.templates)
      setLoadingProgress(40)

      const criticalTemplates = [
        ...assemblyData.instances.straws.map((s) => s.templateId),
        ...assemblyData.instances.connectors.map((c) => c.templateId)
      ]
      await Promise.all(criticalTemplates.map((id) => templateManager.loadTemplate(id)))
      setLoadingProgress(70)

      const resolveMaterial = (materialRef?: string) => {
        if (!materialRef) return null
        const mat = assemblyData!.templates.materials.find((m) => m.id === materialRef)
        return mat?.data || null
      }

      const allInstances: AssemblyInstance[] = []

      // Straws
      for (const strawGroup of assemblyData.instances.straws) {
        for (const instance of strawGroup.instances) {
          const instanceData = templateManager.createInstance({
            id: instance.id,
            templateId: strawGroup.templateId,
            transform: instance.transform
          })

          const material = instanceData.material || resolveMaterial(instanceData.materialRef)
          allInstances.push({
            id: instance.id,
            templateId: strawGroup.templateId,
            category: 'straw',
            data: { ...instanceData, material },
            transform: instance.transform,
            isVisible: true,
            distanceToCamera: 0
          })
        }
      }

      // Connectors
      for (const connectorGroup of assemblyData.instances.connectors) {
        for (const instance of connectorGroup.instances) {
          const instanceData = templateManager.createInstance({
            id: instance.id,
            templateId: connectorGroup.templateId,
            transform: instance.transform
          })

          const material = instanceData.material || resolveMaterial(instanceData.materialRef)

          allInstances.push({
            id: instance.id,
            templateId: connectorGroup.templateId,
            category: 'connector',
            data: { ...instanceData, material },
            transform: instance.transform,
            isVisible: true,
            distanceToCamera: 0
          })
        }
      }

      setInstances(allInstances)
      setLoadingProgress(90)
      setAssembly(assemblyData)

      // TODO: đang hard code activity thứ 2 (index 1) để test
      // Fix later
      if (assemblyData.activities.length > 0) {
        setCurrentActivity(assemblyData.activities[0])
        if (assemblyData.activities[0].steps.length > 0) {
          setCurrentStep(assemblyData.activities[0].steps[0])
        }
      }

      setLoadingProgress(100)
      setIsOptimized(true)
    } catch (err) {
      console.error('Failed to load assembly:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Update camera position and trigger LOD updates
   */
  const updateCameraPosition = useCallback(
    (position: { x: number; y: number; z: number }) => {
      setCameraPosition(position)

      if (lodManager && instances.length > 0) {
        // Update LOD levels
        const components = instances.map((inst) => ({
          id: inst.id,
          position: inst.transform.position,
          template: templateManager.isTemplateLoaded(inst.templateId)
            ? templateManager.getTemplateInfo(inst.templateId)
            : null
        }))

        const fps = performanceStats?.currentFPS || 60
        const updatedLODs = lodManager.updateLODs(position, components, fps)

        // Update instance LOD levels
        setInstances((prevInstances) =>
          prevInstances.map((inst) => ({
            ...inst,
            lodLevel: updatedLODs.get(inst.id)?.name,
            distanceToCamera: calculateDistance(position, inst.transform.position)
          }))
        )
      }
    },
    [lodManager, instances, performanceStats]
  )

  /**
   * Record frame performance metrics
   */
  const recordFrame = useCallback(
    (frameTime: number, drawCalls: number, triangles: number) => {
      if (profiler) {
        profiler.recordFrame(frameTime, drawCalls, triangles)
      }
    },
    [profiler]
  )

  /**
   * Enable/disable LOD system
   */
  const enableLODSystem = useCallback(
    (enabled: boolean) => {
      if (lodManager) {
        lodManager.updateConfig({ enabled })
      }
    },
    [lodManager]
  )

  /**
   * Get performance report
   */
  const getPerformanceReport = useCallback(() => {
    if (!profiler) return null

    return {
      stats: profiler.getCurrentStats(),
      exported: profiler.exportData(),
      lodStats: lodManager?.getLODStats(),
      templateStats: templateManager.getStats()
    }
  }, [profiler, lodManager])

  /**
   * Optimize for performance automatically
   */
  const optimizeForPerformance = useCallback(() => {
    console.log('🔧 Auto-optimizing for performance...')

    if (lodManager) {
      // Make LOD more aggressive
      lodManager.updateConfig({
        levels: [
          { name: 'high', distance: 30, geometryComplexity: 'detailed' },
          { name: 'medium', distance: 60, geometryComplexity: 'standard' },
          { name: 'low', distance: 120, geometryComplexity: 'basic' }
        ]
      })
    }

    // Hide distant objects
    setInstances((prevInstances) =>
      prevInstances.map((inst) => ({
        ...inst,
        isVisible: inst.distanceToCamera < 150
      }))
    )

    setIsOptimized(true)
  }, [lodManager])

  /**
   * Reset optimizations
   */
  const resetOptimizations = useCallback(() => {
    console.log('Resetting optimizations...')

    if (lodManager) {
      lodManager.updateConfig(defaultLODConfig)
    }

    setInstances((prevInstances) =>
      prevInstances.map((inst) => ({
        ...inst,
        isVisible: true,
        lodLevel: 'high'
      }))
    )

    setIsOptimized(false)
  }, [lodManager])

  /**
   * Set current activity
   */
  const setCurrentActivityById = useCallback(
    (activityId: string) => {
      if (!assembly) return

      const activity = assembly.activities.find((a) => a.id === activityId)
      if (activity) {
        setCurrentActivity(activity)
        if (activity.steps.length > 0) {
          setCurrentStep(activity.steps[0])
        }
      }
    },
    [assembly]
  )

  /**
   * Navigate steps
   */
  const nextStep = useCallback(() => {
    if (!currentActivity || !currentStep) return

    console.log('Current Step:', currentStep)
    console.log('Current Activity:', currentActivity)
    const currentIndex = currentActivity.steps.findIndex((s: any) => s.actionId === currentStep.actionId)
    if (currentIndex < currentActivity.steps.length - 1) {
      console.log('Next Step Index:', currentIndex + 1)
      setCurrentStep(currentActivity.steps[currentIndex + 1])
    }
  }, [currentActivity, currentStep])

  const previousStep = useCallback(() => {
    if (!currentActivity || !currentStep) return

    const currentIndex = currentActivity.steps.findIndex((s: any) => s.actionId === currentStep.actionId)
    if (currentIndex > 0) {
      setCurrentStep(currentActivity.steps[currentIndex - 1])
    }
  }, [currentActivity, currentStep])

  /**
   * Calculate distance between two 3D points
   */
  const calculateDistance = (
    pos1: { x: number; y: number; z: number },
    pos2: { x: number; y: number; z: number }
  ): number => {
    const dx = pos1.x - pos2.x
    const dy = pos1.y - pos2.y
    const dz = pos1.z - pos2.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  return {
    // Data
    assembly,
    instances,
    currentActivity,
    currentStep,

    // Performance
    lodManager,
    profiler,
    performanceStats,

    // State
    isLoading,
    loadingProgress,
    error,
    isOptimized,

    // Actions
    loadAssembly,
    updateCameraPosition,
    setCurrentActivity: setCurrentActivityById,
    nextStep,
    previousStep,

    // Performance actions
    recordFrame,
    enableLOD: enableLODSystem,
    getPerformanceReport,

    // Optimization
    optimizeForPerformance,
    resetOptimizations
  }
}
