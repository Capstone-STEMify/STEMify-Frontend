/**
 * Streaming Loader for 3D Assembly Components
 * Implements progressive loading, compression, and caching
 */

export interface StreamingChunk {
  id: string
  type: 'template' | 'instance' | 'texture' | 'model'
  priority: number
  size: number
  compressedSize?: number
  url: string
  dependencies?: string[]
  loadedData?: any
  loadedAt?: number
  lastAccessedAt?: number
}

export interface StreamingConfig {
  chunkSize: string // '1MB', '512KB', etc.
  compressionLevel: number // 1-9
  progressiveLoading: boolean
  maxConcurrentLoads: number
  cacheSize: number // MB
  preloadRadius: number // Distance to preload
  enableCompression: boolean
}

export interface LoadingProgress {
  totalChunks: number
  loadedChunks: number
  totalSize: number
  loadedSize: number
  currentChunk?: string
  estimatedTimeRemaining?: number
}

export class StreamingLoader {
  private config: StreamingConfig
  private chunks: Map<string, StreamingChunk> = new Map()
  private loadingQueue: string[] = []
  private activeLoads: Set<string> = new Set()
  private cache: Map<string, any> = new Map()
  private cacheSize = 0 // Current cache size in bytes
  private loadingProgress: LoadingProgress = {
    totalChunks: 0,
    loadedChunks: 0,
    totalSize: 0,
    loadedSize: 0
  }
  private progressCallbacks: Array<(progress: LoadingProgress) => void> = []

  constructor(config: StreamingConfig) {
    this.config = config
  }

  /**
   * Register chunks for streaming
   */
  registerChunks(chunks: StreamingChunk[]): void {
    for (const chunk of chunks) {
      this.chunks.set(chunk.id, chunk)
    }

    // Update progress tracking
    this.loadingProgress.totalChunks = this.chunks.size
    this.loadingProgress.totalSize = Array.from(this.chunks.values()).reduce((total, chunk) => total + chunk.size, 0)

    console.log(
      `Registered ${chunks.length} chunks for streaming (${this.formatBytes(this.loadingProgress.totalSize)})`
    )
  }

  /**
   * Load chunks by priority and dependencies
   */
  async loadChunk(chunkId: string): Promise<any> {
    const chunk = this.chunks.get(chunkId)
    if (!chunk) {
      throw new Error(`Chunk not found: ${chunkId}`)
    }

    // Return cached data if available
    if (chunk.loadedData) {
      chunk.lastAccessedAt = Date.now()
      return chunk.loadedData
    }

    // Check if already loading
    if (this.activeLoads.has(chunkId)) {
      return this.waitForChunkLoad(chunkId)
    }

    // Load dependencies first
    if (chunk.dependencies) {
      await Promise.all(chunk.dependencies.map((depId) => this.loadChunk(depId)))
    }

    // Start loading
    this.activeLoads.add(chunkId)
    this.loadingProgress.currentChunk = chunkId

    try {
      const startTime = Date.now()

      let data: any

      switch (chunk.type) {
        case 'template':
        case 'instance':
          data = await this.loadJSON(chunk.url)
          break
        case 'model':
          data = await this.loadModel(chunk.url)
          break
        case 'texture':
          data = await this.loadTexture(chunk.url)
          break
        default:
          throw new Error(`Unknown chunk type: ${chunk.type}`)
      }

      // Decompress if needed
      if (this.config.enableCompression && chunk.compressedSize) {
        data = await this.decompress(data)
      }

      const loadTime = Date.now() - startTime
      console.log(`Loaded chunk: ${chunkId} in ${loadTime}ms`)

      // Store in chunk and cache
      chunk.loadedData = data
      chunk.loadedAt = Date.now()
      chunk.lastAccessedAt = Date.now()

      this.addToCache(chunkId, data, chunk.size)

      // Update progress
      this.loadingProgress.loadedChunks++
      this.loadingProgress.loadedSize += chunk.size
      this.updateEstimatedTime()
      this.notifyProgress()

      return data
    } catch (error) {
      console.error(`Failed to load chunk: ${chunkId}`, error)
      throw error
    } finally {
      this.activeLoads.delete(chunkId)
      this.loadingProgress.currentChunk = undefined
    }
  }

  /**
   * Load JSON data
   */
  private async loadJSON(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`)
    }
    return response.json()
  }

  /**
   * Load 3D model (placeholder - integrate with your 3D loader)
   */
  private async loadModel(url: string): Promise<any> {
    // This would integrate with your GLTF loader
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load model: ${response.statusText}`)
    }
    return response.arrayBuffer()
  }

  /**
   * Load texture (placeholder)
   */
  private async loadTexture(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load texture: ${response.statusText}`)
    }
    return response.blob()
  }

  /**
   * Decompress data (placeholder - implement with your compression library)
   */
  private async decompress(data: any): Promise<any> {
    // Implement with libraries like pako, lz4, etc.
    console.log('Decompressing data...')
    return data // Placeholder
  }

  /**
   * Add data to cache with LRU eviction
   */
  private addToCache(key: string, data: any, size: number): void {
    // Check cache size limit
    const maxCacheSize = this.config.cacheSize * 1024 * 1024 // Convert MB to bytes

    while (this.cacheSize + size > maxCacheSize && this.cache.size > 0) {
      this.evictLRU()
    }

    this.cache.set(key, data)
    this.cacheSize += size
  }

  /**
   * Evict least recently used item from cache
   */
  private evictLRU(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, chunk] of this.chunks.entries()) {
      if (chunk.lastAccessedAt && chunk.lastAccessedAt < oldestTime) {
        oldestTime = chunk.lastAccessedAt
        oldestKey = key
      }
    }

    if (oldestKey) {
      const chunk = this.chunks.get(oldestKey)
      if (chunk) {
        this.cache.delete(oldestKey)
        this.cacheSize -= chunk.size
        chunk.loadedData = undefined
        console.log(`Evicted from cache: ${oldestKey}`)
      }
    }
  }

  /**
   * Wait for chunk to finish loading
   */
  private async waitForChunkLoad(chunkId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const chunk = this.chunks.get(chunkId)
        if (chunk?.loadedData) {
          clearInterval(checkInterval)
          resolve(chunk.loadedData)
        } else if (!this.activeLoads.has(chunkId)) {
          clearInterval(checkInterval)
          reject(new Error(`Chunk loading failed: ${chunkId}`))
        }
      }, 10)
    })
  }

  /**
   * Update estimated loading time
   */
  private updateEstimatedTime(): void {
    if (this.loadingProgress.loadedChunks === 0) return

    const elapsed = Date.now() - (this.loadingProgress as any).startTime || Date.now()
    const rate = this.loadingProgress.loadedSize / elapsed // bytes per ms
    const remaining = this.loadingProgress.totalSize - this.loadingProgress.loadedSize

    this.loadingProgress.estimatedTimeRemaining = remaining / rate
  }

  /**
   * Notify progress callbacks
   */
  private notifyProgress(): void {
    for (const callback of this.progressCallbacks) {
      callback(this.loadingProgress)
    }
  }

  /**
   * Subscribe to loading progress
   */
  onProgress(callback: (progress: LoadingProgress) => void): void {
    this.progressCallbacks.push(callback)
  }

  /**
   * Format bytes for display
   */
  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Clear cache and reset
   */
  reset(): void {
    this.cache.clear()
    this.cacheSize = 0
    this.activeLoads.clear()
    this.loadingQueue = []
    this.loadingProgress = {
      totalChunks: 0,
      loadedChunks: 0,
      totalSize: 0,
      loadedSize: 0
    }
  }
}

// Default streaming configuration
export const defaultStreamingConfig: StreamingConfig = {
  chunkSize: '1MB',
  compressionLevel: 7,
  progressiveLoading: true,
  maxConcurrentLoads: 3,
  cacheSize: 50, // MB
  preloadRadius: 50,
  enableCompression: true
}
