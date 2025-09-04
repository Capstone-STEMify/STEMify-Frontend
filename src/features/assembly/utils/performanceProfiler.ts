/**
 * Performance Profiler for 3D Assembly System
 * Real-time monitoring and optimization recommendations
 */

export interface PerformanceMetrics {
  fps: number
  frameTime: number // ms
  drawCalls: number
  triangles: number
  memoryUsage: {
    used: number // MB
    total: number // MB
    textures: number // MB
    geometries: number // MB
  }
  loadingTime: {
    templates: number // ms
    models: number // ms
    textures: number // ms
  }
  renderTime: {
    shadows: number // ms
    lighting: number // ms
    postProcessing: number // ms
  }
  timestamp: number
}

export interface PerformanceAlert {
  id: string
  type: 'warning' | 'critical' | 'info'
  category: 'performance' | 'memory' | 'loading' | 'rendering'
  message: string
  suggestion: string
  metric: string
  value: number
  threshold: number
  timestamp: number
}

export interface PerformanceConfig {
  enableMetrics: boolean
  trackMemory: boolean
  trackRenderTime: boolean
  maxFrameTime: number // 16.67ms for 60fps
  maxMemoryUsage: number // MB
  maxDrawCalls: number
  alertThresholds: {
    fpsLow: number
    memoryHigh: number
    drawCallsHigh: number
    frameTimeHigh: number
  }
  historySize: number // Number of frames to keep
  reportingInterval: number // ms
}

export class PerformanceProfiler {
  private config: PerformanceConfig
  private metricsHistory: PerformanceMetrics[] = []
  private alerts: PerformanceAlert[] = []
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = []
  private reportCallbacks: Array<(report: PerformanceReport) => void> = []
  private startTime = Date.now()
  private frameCount = 0
  private lastReportTime = 0

  // Performance counters
  private frameTimeAccumulator = 0
  private drawCallAccumulator = 0
  private triangleAccumulator = 0

  constructor(config: PerformanceConfig) {
    this.config = config
    this.initializeProfiler()
  }

  /**
   * Initialize profiler and start monitoring
   */
  private initializeProfiler(): void {
    if (!this.config.enableMetrics) return

    // Monitor memory usage periodically
    if (this.config.trackMemory) {
      setInterval(() => {
        this.collectMemoryMetrics()
      }, 1000)
    }

    // Report performance periodically
    setInterval(() => {
      this.generateReport()
    }, this.config.reportingInterval)

    console.log('Performance Profiler initialized')
  }

  /**
   * Record frame metrics (call this every frame)
   */
  recordFrame(frameTime: number, drawCalls: number, triangles: number): void {
    if (!this.config.enableMetrics) return

    this.frameCount++
    this.frameTimeAccumulator += frameTime
    this.drawCallAccumulator += drawCalls
    this.triangleAccumulator += triangles

    // Calculate FPS
    const fps = 1000 / frameTime

    // Create metrics object
    const metrics: PerformanceMetrics = {
      fps,
      frameTime,
      drawCalls,
      triangles,
      memoryUsage: this.getMemoryUsage(),
      loadingTime: { templates: 0, models: 0, textures: 0 },
      renderTime: { shadows: 0, lighting: 0, postProcessing: 0 },
      timestamp: Date.now()
    }

    // Add to history
    this.metricsHistory.push(metrics)
    if (this.metricsHistory.length > this.config.historySize) {
      this.metricsHistory.shift()
    }

    // Check for performance issues
    this.checkPerformanceAlerts(metrics)
  }

  /**
   * Record loading time
   */
  recordLoadingTime(category: 'templates' | 'models' | 'textures', time: number): void {
    if (!this.config.enableMetrics) return

    const latest = this.metricsHistory[this.metricsHistory.length - 1]
    if (latest) {
      latest.loadingTime[category] = time
    }
  }

  /**
   * Record render phase time
   */
  recordRenderTime(phase: 'shadows' | 'lighting' | 'postProcessing', time: number): void {
    if (!this.config.trackRenderTime) return

    const latest = this.metricsHistory[this.metricsHistory.length - 1]
    if (latest) {
      latest.renderTime[phase] = time
    }
  }

  /**
   * Start timing a performance operation
   */
  startTiming(label: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const elapsed = performance.now() - startTime
      console.log(`⏱️ ${label}: ${elapsed.toFixed(2)}ms`)
      return elapsed
    }
  }

  /**
   * Collect memory usage metrics
   */
  private collectMemoryMetrics(): void {
    const memory = this.getMemoryUsage()
    
    // Check memory thresholds
    if (memory.used > this.config.maxMemoryUsage) {
      this.addAlert({
        type: 'critical',
        category: 'memory',
        message: `High memory usage: ${memory.used.toFixed(1)}MB`,
        suggestion: 'Consider reducing LOD quality or clearing unused assets',
        metric: 'memoryUsage',
        value: memory.used,
        threshold: this.config.maxMemoryUsage
      })
    }
  }

  /**
   * Get current memory usage (simplified - would integrate with browser APIs)
   */
  private getMemoryUsage(): PerformanceMetrics['memoryUsage'] {
    // In real implementation, integrate with:
    // - performance.memory (Chrome)
    // - THREE.js memory info
    // - WebGL context info
    
    return {
      used: 0, // Would be calculated from actual usage
      total: 0,
      textures: 0,
      geometries: 0
    }
  }

  /**
   * Check for performance alerts
   */
  private checkPerformanceAlerts(metrics: PerformanceMetrics): void {
    const { alertThresholds } = this.config

    // FPS too low
    if (metrics.fps < alertThresholds.fpsLow) {
      this.addAlert({
        type: 'warning',
        category: 'performance',
        message: `Low FPS: ${metrics.fps.toFixed(1)}`,
        suggestion: 'Consider reducing LOD quality or limiting draw calls',
        metric: 'fps',
        value: metrics.fps,
        threshold: alertThresholds.fpsLow
      })
    }

    // Frame time too high
    if (metrics.frameTime > alertThresholds.frameTimeHigh) {
      this.addAlert({
        type: 'warning',
        category: 'performance',
        message: `High frame time: ${metrics.frameTime.toFixed(2)}ms`,
        suggestion: 'Optimize rendering pipeline or reduce scene complexity',
        metric: 'frameTime',
        value: metrics.frameTime,
        threshold: alertThresholds.frameTimeHigh
      })
    }

    // Too many draw calls
    if (metrics.drawCalls > alertThresholds.drawCallsHigh) {
      this.addAlert({
        type: 'warning',
        category: 'rendering',
        message: `High draw calls: ${metrics.drawCalls}`,
        suggestion: 'Use instancing or batch similar objects',
        metric: 'drawCalls',
        value: metrics.drawCalls,
        threshold: alertThresholds.drawCallsHigh
      })
    }
  }

  /**
   * Add performance alert
   */
  private addAlert(alertData: Omit<PerformanceAlert, 'id' | 'timestamp'>): void {
    const alert: PerformanceAlert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    this.alerts.push(alert)
    
    // Keep only recent alerts
    if (this.alerts.length > 100) {
      this.alerts.shift()
    }

    // Notify callbacks
    for (const callback of this.alertCallbacks) {
      callback(alert)
    }

    console.warn(`Performance Alert: ${alert.message}`, alert)
  }

  /**
   * Generate performance report
   */
  private generateReport(): void {
    const now = Date.now()
    if (now - this.lastReportTime < this.config.reportingInterval) return

    const recent = this.metricsHistory.slice(-60) // Last 60 frames
    if (recent.length === 0) return

    const report: PerformanceReport = {
      timeRange: {
        start: recent[0].timestamp,
        end: recent[recent.length - 1].timestamp,
        duration: recent[recent.length - 1].timestamp - recent[0].timestamp
      },
      averages: {
        fps: recent.reduce((sum, m) => sum + m.fps, 0) / recent.length,
        frameTime: recent.reduce((sum, m) => sum + m.frameTime, 0) / recent.length,
        drawCalls: recent.reduce((sum, m) => sum + m.drawCalls, 0) / recent.length,
        triangles: recent.reduce((sum, m) => sum + m.triangles, 0) / recent.length
      },
      peaks: {
        maxFrameTime: Math.max(...recent.map(m => m.frameTime)),
        maxDrawCalls: Math.max(...recent.map(m => m.drawCalls)),
        maxTriangles: Math.max(...recent.map(m => m.triangles)),
        minFPS: Math.min(...recent.map(m => m.fps))
      },
      trends: this.calculateTrends(recent),
      recommendations: this.generateRecommendations(recent),
      alerts: this.alerts.filter(a => a.timestamp > this.lastReportTime)
    }

    // Notify callbacks
    for (const callback of this.reportCallbacks) {
      callback(report)
    }

    this.lastReportTime = now
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(metrics: PerformanceMetrics[]): PerformanceReport['trends'] {
    if (metrics.length < 2) {
      return { fps: 'stable', frameTime: 'stable', memoryUsage: 'stable' }
    }

    const first = metrics.slice(0, metrics.length / 2)
    const second = metrics.slice(metrics.length / 2)

    const firstAvgFPS = first.reduce((sum, m) => sum + m.fps, 0) / first.length
    const secondAvgFPS = second.reduce((sum, m) => sum + m.fps, 0) / second.length

    const fpsTrend = secondAvgFPS > firstAvgFPS * 1.05 ? 'improving' :
                    secondAvgFPS < firstAvgFPS * 0.95 ? 'degrading' : 'stable'

    return {
      fps: fpsTrend,
      frameTime: fpsTrend === 'improving' ? 'improving' : 
                 fpsTrend === 'degrading' ? 'degrading' : 'stable',
      memoryUsage: 'stable' // Would calculate from actual memory data
    }
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(metrics: PerformanceMetrics[]): string[] {
    const recommendations: string[] = []
    const latest = metrics[metrics.length - 1]

    if (latest.fps < 30) {
      recommendations.push('Enable more aggressive LOD culling')
      recommendations.push('Reduce shadow resolution')
      recommendations.push('Disable post-processing effects')
    }

    if (latest.drawCalls > 100) {
      recommendations.push('Implement instanced rendering for repeated components')
      recommendations.push('Combine similar materials')
    }

    if (latest.triangles > 100000) {
      recommendations.push('Use lower poly models at distance')
      recommendations.push('Implement occlusion culling')
    }

    return recommendations
  }

  /**
   * Subscribe to performance alerts
   */
  onAlert(callback: (alert: PerformanceAlert) => void): void {
    this.alertCallbacks.push(callback)
  }

  /**
   * Subscribe to performance reports
   */
  onReport(callback: (report: PerformanceReport) => void): void {
    this.reportCallbacks.push(callback)
  }

  /**
   * Get current performance stats
   */
  getCurrentStats(): PerformanceStats {
    const recent = this.metricsHistory.slice(-30)
    
    return {
      currentFPS: recent.length > 0 ? recent[recent.length - 1].fps : 0,
      averageFPS: recent.reduce((sum, m) => sum + m.fps, 0) / recent.length || 0,
      frameTime: recent.length > 0 ? recent[recent.length - 1].frameTime : 0,
      drawCalls: recent.length > 0 ? recent[recent.length - 1].drawCalls : 0,
      memoryUsage: recent.length > 0 ? recent[recent.length - 1].memoryUsage.used : 0,
      alertCount: this.alerts.filter(a => Date.now() - a.timestamp < 60000).length
    }
  }

  /**
   * Export performance data for analysis
   */
  exportData(): {
    metrics: PerformanceMetrics[]
    alerts: PerformanceAlert[]
    config: PerformanceConfig
  } {
    return {
      metrics: this.metricsHistory,
      alerts: this.alerts,
      config: this.config
    }
  }

  /**
   * Reset profiler
   */
  reset(): void {
    this.metricsHistory = []
    this.alerts = []
    this.frameCount = 0
    this.frameTimeAccumulator = 0
    this.drawCallAccumulator = 0
    this.triangleAccumulator = 0
    this.startTime = Date.now()
  }
}

export interface PerformanceReport {
  timeRange: {
    start: number
    end: number
    duration: number
  }
  averages: {
    fps: number
    frameTime: number
    drawCalls: number
    triangles: number
  }
  peaks: {
    maxFrameTime: number
    maxDrawCalls: number
    maxTriangles: number
    minFPS: number
  }
  trends: {
    fps: 'improving' | 'degrading' | 'stable'
    frameTime: 'improving' | 'degrading' | 'stable'
    memoryUsage: 'improving' | 'degrading' | 'stable'
  }
  recommendations: string[]
  alerts: PerformanceAlert[]
}

export interface PerformanceStats {
  currentFPS: number
  averageFPS: number
  frameTime: number
  drawCalls: number
  memoryUsage: number
  alertCount: number
}

// Default configuration
export const defaultPerformanceConfig: PerformanceConfig = {
  enableMetrics: true,
  trackMemory: true,
  trackRenderTime: true,
  maxFrameTime: 16.67, // 60fps
  maxMemoryUsage: 512, // MB
  maxDrawCalls: 100,
  alertThresholds: {
    fpsLow: 30,
    memoryHigh: 400,
    drawCallsHigh: 150,
    frameTimeHigh: 20
  },
  historySize: 300, // 5 seconds at 60fps
  reportingInterval: 5000 // 5 seconds
}
