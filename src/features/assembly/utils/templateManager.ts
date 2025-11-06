/**
 * Template Manager for Component Library System
 * Handles loading, caching, and instantiation of component templates
 */

import { StreamingLoader, StreamingChunk, defaultStreamingConfig } from './streamingLoader'
import { schemaValidator } from './schemaValidator'

export interface ComponentTemplate {
  id: string
  name: string
  version: string
  category: 'straw' | 'connector' | 'material'
  data: any
  loadedAt: number
  dependencies?: string[]
  size: number
}

export interface TemplateInstance {
  id: string
  templateId: string
  transform: {
    position: { x: number; y: number; z: number }
    rotation: { x: number; y: number; z: number }
    scale?: { x: number; y: number; z: number }
  }
  overrides?: any // Template property overrides
}

export interface TemplateLibrary {
  materials: Array<{ id: string; source: string }>
  components: Array<{ id: string; source: string }>
}

export class TemplateManager {
  private streamingLoader: StreamingLoader
  private templates: Map<string, ComponentTemplate> = new Map()
  private dependencyGraph: Map<string, Set<string>> = new Map()
  private loadingPromises: Map<string, Promise<ComponentTemplate>> = new Map()

  constructor() {
    this.streamingLoader = new StreamingLoader(defaultStreamingConfig)
  }

  /**
   * Initialize template library from assembly definition
   */
  async initializeLibrary(library: TemplateLibrary): Promise<void> {
    console.log('Initializing component template library...')

    const chunks: StreamingChunk[] = []

    // Register material templates
    for (const material of library.materials) {
      chunks.push({
        id: material.id,
        type: 'template',
        priority: 1,
        size: 1024, // Estimated size
        url: material.source
      })
    }

    // Register component templates
    for (const component of library.components) {
      chunks.push({
        id: component.id,
        type: 'template',
        priority: 2,
        size: 2048, // Estimated size
        url: component.source
      })
    }

    // Register chunks with streaming loader
    this.streamingLoader.registerChunks(chunks)

    console.log(`Template library initialized with ${chunks.length} templates`)
  }

  /**
   * Load a template by ID
   */
  async loadTemplate(templateId: string): Promise<ComponentTemplate> {
    // Return cached template if available
    const cached = this.templates.get(templateId)
    if (cached) {
      return cached
    }

    // Return loading promise if already loading
    const loadingPromise = this.loadingPromises.get(templateId)
    if (loadingPromise) {
      return loadingPromise
    }

    // Start loading
    const promise = this.performTemplateLoad(templateId)
    this.loadingPromises.set(templateId, promise)

    try {
      const template = await promise
      this.templates.set(templateId, template)
      return template
    } finally {
      this.loadingPromises.delete(templateId)
    }
  }

  /**
   * Perform the actual template loading
   */
  private async performTemplateLoad(templateId: string): Promise<ComponentTemplate> {
    console.log(`Loading template: ${templateId}`)

    // Load template data via streaming loader
    const data = await this.streamingLoader.loadChunk(templateId)

    // Validate template schema
    const validationResult = schemaValidator.validateAssembly(data)
    if (!validationResult.valid) {
      console.warn(`Template validation failed for ${templateId}: ${validationResult.message}`)
      // Continue loading for now, just log warning
    }

    // Load dependencies
    if (data.dependencies) {
      await this.loadDependencies(templateId, data.dependencies)
    }

    // Create template object
    const template: ComponentTemplate = {
      id: templateId,
      name: data.name || templateId,
      version: data.version || '1.0',
      category: data.category || 'straw',
      data,
      loadedAt: Date.now(),
      dependencies: data.dependencies,
      size: JSON.stringify(data).length
    }

    return template
  }

  /**
   * Load template dependencies
   */
  private async loadDependencies(templateId: string, dependencies: string[]): Promise<void> {
    this.dependencyGraph.set(templateId, new Set(dependencies))

    // Load all dependencies in parallel
    await Promise.all(dependencies.map((depId) => this.loadTemplate(depId)))
  }

  /**
   * Create instance from template
   */
  createInstance(instance: TemplateInstance): any {
    const template = this.templates.get(instance.templateId)
    if (!template) {
      throw new Error(`Template not found: ${instance.templateId}`)
    }

    // Clone template data
    const instanceData = JSON.parse(JSON.stringify(template.data))

    // Apply transform
    instanceData.transform = instance.transform

    // Apply overrides
    if (instance.overrides) {
      this.applyOverrides(instanceData, instance.overrides)
    }

    // Resolve material references
    if (instanceData.materialRef) {
      const materialTemplate = this.templates.get(instanceData.materialRef)
      if (materialTemplate) {
        instanceData.material = materialTemplate.data.properties
      }
    }

    return {
      id: instance.id,
      ...instanceData
    }
  }

  /**
   * Apply property overrides to instance data
   */
  private applyOverrides(data: any, overrides: any): void {
    for (const [key, value] of Object.entries(overrides)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        if (!data[key]) data[key] = {}
        this.applyOverrides(data[key], value)
      } else {
        data[key] = value
      }
    }
  }

  /**
   * Create multiple instances from template
   */
  createInstances(templateId: string, instances: TemplateInstance[]): any[] {
    return instances.map((instance) => this.createInstance(instance))
  }

  /**
   * Preload templates for given instances
   */
  async preloadTemplates(instances: TemplateInstance[]): Promise<void> {
    const templateIds = [...new Set(instances.map((inst) => inst.templateId))]

    await Promise.all(templateIds.map((templateId) => this.loadTemplate(templateId)))
  }

  /**
   * Get template info without loading
   */
  getTemplateInfo(templateId: string): Partial<ComponentTemplate> | null {
    const template = this.templates.get(templateId)
    if (template) {
      return {
        id: template.id,
        name: template.name,
        version: template.version,
        category: template.category,
        loadedAt: template.loadedAt,
        size: template.size
      }
    }
    return null
  }

  /**
   * Check if template is loaded
   */
  isTemplateLoaded(templateId: string): boolean {
    return this.templates.has(templateId)
  }

  /**
   * Get template library statistics
   */
  getStats(): {
    totalTemplates: number
    loadedTemplates: number
    totalSize: number
    byCategory: Record<string, number>
    dependencyCount: number
  } {
    const stats = {
      totalTemplates: this.templates.size,
      loadedTemplates: this.templates.size,
      totalSize: 0,
      byCategory: {} as Record<string, number>,
      dependencyCount: this.dependencyGraph.size
    }

    for (const template of this.templates.values()) {
      stats.totalSize += template.size
      stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1
    }

    return stats
  }

  /**
   * Clear all templates
   */
  clear(): void {
    this.templates.clear()
    this.dependencyGraph.clear()
    this.loadingPromises.clear()
    console.log('Template manager cleared')
  }
}

// Singleton instance
export const templateManager = new TemplateManager()
