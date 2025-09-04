/**
 * LOD (Level of Detail) Manager
 * Dynamically adjusts component complexity based on camera distance and performance
 */

export interface LODLevel {
  name: 'high' | 'medium' | 'low'
  distance: number
  geometryComplexity: 'detailed' | 'standard' | 'basic'
  polyCount?: number
  textureResolution?: number
  enableAnimations?: boolean
  shaderComplexity?: 'pbr_full' | 'pbr_simplified' | 'basic'
}

export interface LODConfiguration {
  enabled: boolean
  levels: LODLevel[]
  hysteresis: number // Prevent LOD flickering
  autoAdjust: boolean // Auto-adjust based on performance
  targetFPS: number
}

export interface ComponentLOD {
  componentId: string
  currentLevel: LODLevel
  lastUpdateTime: number
  distanceToCamera: number
}

export class LODManager {
  private config: LODConfiguration
  private componentLODs: Map<string, ComponentLOD> = new Map()
  private performanceHistory: number[] = []
  private lastPerformanceCheck = 0
  private isAdjusting = false

  constructor(config: LODConfiguration) {
    this.config = config
  }

  /**
   * Update LOD levels for all components based on camera position
   */
  updateLODs(
    cameraPosition: { x: number; y: number; z: number },
    components: Array<{
      id: string
      position: { x: number; y: number; z: number }
      template: any
    }>,
    currentFPS?: number
  ): Map<string, LODLevel> {
    const updatedLODs = new Map<string, LODLevel>()

    // Auto-adjust LOD levels based on performance if enabled
    if (this.config.autoAdjust && currentFPS) {
      this.adjustLODBasedOnPerformance(currentFPS)
    }

    for (const component of components) {
      const distance = this.calculateDistance(cameraPosition, component.position)
      const newLevel = this.determineLODLevel(distance, component.template)
      const currentLOD = this.componentLODs.get(component.id)

      // Apply hysteresis to prevent flickering
      if (this.shouldUpdateLOD(currentLOD, newLevel, distance)) {
        const componentLOD: ComponentLOD = {
          componentId: component.id,
          currentLevel: newLevel,
          lastUpdateTime: Date.now(),
          distanceToCamera: distance
        }

        this.componentLODs.set(component.id, componentLOD)
        updatedLODs.set(component.id, newLevel)

        // Log significant LOD changes for debugging
        if (currentLOD && currentLOD.currentLevel.name !== newLevel.name) {
          console.log(`LOD Change: ${component.id} ${currentLOD.currentLevel.name} → ${newLevel.name} (dist: ${distance.toFixed(1)})`)
        }
      }
    }

    return updatedLODs
  }

  /**
   * Calculate 3D distance between camera and component
   */
  private calculateDistance(
    camera: { x: number; y: number; z: number },
    component: { x: number; y: number; z: number }
  ): number {
    const dx = camera.x - component.x
    const dy = camera.y - component.y  
    const dz = camera.z - component.z
    return Math.sqrt(dx * dx + dy * dy + dz * dz)
  }

  /**
   * Determine appropriate LOD level based on distance and template
   */
  private determineLODLevel(distance: number, template: any): LODLevel {
    if (!template || !template.lod) {
      return this.config.levels[1] // Default to medium
    }

    // Start with template's LOD configuration
    const templateLODs = template.lod
    
    // Find appropriate level based on distance
    if (distance <= this.config.levels[0].distance) {
      return {
        name: 'high',
        distance: this.config.levels[0].distance,
        ...templateLODs.high
      }
    } else if (distance <= this.config.levels[1].distance) {
      return {
        name: 'medium', 
        distance: this.config.levels[1].distance,
        ...templateLODs.medium
      }
    } else {
      return {
        name: 'low',
        distance: this.config.levels[2].distance,
        ...templateLODs.low
      }
    }
  }

  /**
   * Check if LOD should be updated (with hysteresis)
   */
  private shouldUpdateLOD(
    current: ComponentLOD | undefined,
    newLevel: LODLevel,
    distance: number
  ): boolean {
    if (!current) return true

    const timeSinceUpdate = Date.now() - current.lastUpdateTime
    if (timeSinceUpdate < 100) return false // Throttle updates

    // Apply hysteresis - different thresholds for upgrade vs downgrade
    const hysteresisBuffer = this.config.hysteresis || 5.0
    
    if (current.currentLevel.name === 'high' && newLevel.name === 'medium') {
      return distance > (this.config.levels[0].distance + hysteresisBuffer)
    }
    
    if (current.currentLevel.name === 'medium' && newLevel.name === 'high') {
      return distance < (this.config.levels[0].distance - hysteresisBuffer)
    }
    
    if (current.currentLevel.name === 'medium' && newLevel.name === 'low') {
      return distance > (this.config.levels[1].distance + hysteresisBuffer)
    }
    
    if (current.currentLevel.name === 'low' && newLevel.name === 'medium') {
      return distance < (this.config.levels[1].distance - hysteresisBuffer)
    }

    return current.currentLevel.name !== newLevel.name
  }

  /**
   * Auto-adjust LOD thresholds based on performance
   */
  private adjustLODBasedOnPerformance(currentFPS: number): void {
    if (this.isAdjusting) return

    this.performanceHistory.push(currentFPS)
    if (this.performanceHistory.length > 60) { // Keep 1 second of history
      this.performanceHistory.shift()
    }

    const now = Date.now()
    if (now - this.lastPerformanceCheck < 1000) return // Check every second

    this.lastPerformanceCheck = now
    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length

    // Performance is below target - reduce quality
    if (avgFPS < this.config.targetFPS * 0.8) {
      this.isAdjusting = true
      console.warn(`Performance drop detected (${avgFPS.toFixed(1)} FPS). Reducing LOD quality.`)
      
      // Increase LOD distances (more aggressive culling)
      this.config.levels.forEach(level => {
        level.distance *= 0.8
      })

      setTimeout(() => { this.isAdjusting = false }, 2000)
    }
    
    // Performance is well above target - increase quality
    else if (avgFPS > this.config.targetFPS * 1.2) {
      this.isAdjusting = true
      console.log(`Performance headroom detected (${avgFPS.toFixed(1)} FPS). Increasing LOD quality.`)
      
      // Decrease LOD distances (less aggressive culling)
      this.config.levels.forEach(level => {
        level.distance *= 1.1
      })

      setTimeout(() => { this.isAdjusting = false }, 2000)
    }
  }

  /**
   * Get current LOD statistics for debugging
   */
  getLODStats(): {
    total: number
    byLevel: Record<string, number>
    averageDistance: number
  } {
    const stats = {
      total: this.componentLODs.size,
      byLevel: { high: 0, medium: 0, low: 0 },
      averageDistance: 0
    }

    let totalDistance = 0
    for (const lod of this.componentLODs.values()) {
      stats.byLevel[lod.currentLevel.name]++
      totalDistance += lod.distanceToCamera
    }

    stats.averageDistance = totalDistance / this.componentLODs.size || 0

    return stats
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LODConfiguration>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Reset LOD system
   */
  reset(): void {
    this.componentLODs.clear()
    this.performanceHistory = []
    this.isAdjusting = false
  }
}

// Default LOD configuration
export const defaultLODConfig: LODConfiguration = {
  enabled: true,
  levels: [
    { name: 'high', distance: 50, geometryComplexity: 'detailed' },
    { name: 'medium', distance: 100, geometryComplexity: 'standard' },
    { name: 'low', distance: 200, geometryComplexity: 'basic' }
  ],
  hysteresis: 5.0,
  autoAdjust: true,
  targetFPS: 60
}
