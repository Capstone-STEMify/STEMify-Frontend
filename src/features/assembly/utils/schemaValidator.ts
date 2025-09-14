import Ajv, { JSONSchemaType } from 'ajv'
import addFormats from 'ajv-formats'

// Import schema từ file backend
import labComponentsSchema from '@/schemas/lab-components-schema.json'

// Types cho validation
export interface ValidationResult {
  valid: boolean
  errors?: any[]
  message?: string
}

export interface AssemblyData {
  metadata: {
    version: string
    created: string
    lastModified?: string
    author: string
    description: string
  }
  straws: any[]
  connectors: any[]
  joints: any[]
  actions: any[]
  activities: any[]
  scene: any
}

class SchemaValidator {
  private ajv: Ajv

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      validateFormats: true
    })

    // Add format validators (date-time, etc.)
    addFormats(this.ajv)

    // Compile schema
    this.ajv.addSchema(labComponentsSchema, 'lab-components')
  }

  /**
   * Validate assembly data against the lab components schema
   */
  validateAssembly(data: any): ValidationResult {
    try {
      const validate = this.ajv.getSchema('lab-components')

      if (!validate) {
        return {
          valid: false,
          message: 'Schema not found'
        }
      }

      const valid = validate(data)

      if (!valid) {
        return {
          valid: false,
          errors: validate.errors || [],
          message: this.formatErrors(validate.errors || [])
        }
      }

      return { valid: true }
    } catch (error) {
      return {
        valid: false,
        message: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Validate specific component types
   */
  validateStraw(straw: any): ValidationResult {
    // Basic straw validation
    const requiredFields = ['id', 'geometry', 'material', 'transform', 'endpoints']
    const missingFields = requiredFields.filter((field) => !straw[field])

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }
    }

    // Validate geometry
    if (!straw.geometry.length || straw.geometry.length <= 0) {
      return {
        valid: false,
        message: 'Straw length must be greater than 0'
      }
    }

    // Validate endpoints
    if (!straw.endpoints.start || !straw.endpoints.end) {
      return {
        valid: false,
        message: 'Straw must have both start and end endpoints'
      }
    }

    return { valid: true }
  }

  validateConnector(connector: any): ValidationResult {
    const requiredFields = ['id', 'type', 'geometry', 'material', 'transform', 'ports']
    const missingFields = requiredFields.filter((field) => !connector[field])

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }
    }

    // Validate ports
    if (!Array.isArray(connector.ports) || connector.ports.length === 0) {
      return {
        valid: false,
        message: 'Connector must have at least one port'
      }
    }

    // Validate each port
    for (let i = 0; i < connector.ports.length; i++) {
      const port = connector.ports[i]
      if (!port.id || !port.localPosition || !port.orientation) {
        return {
          valid: false,
          message: `Port ${i} is missing required fields (id, localPosition, orientation)`
        }
      }
    }

    return { valid: true }
  }

  validateJoint(joint: any): ValidationResult {
    const requiredFields = ['id', 'type', 'componentA', 'componentB']
    const missingFields = requiredFields.filter((field) => !joint[field])

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }
    }

    // Validate componentA and componentB
    const components = [joint.componentA, joint.componentB]
    for (let i = 0; i < components.length; i++) {
      const comp = components[i]
      if (!comp.componentId || !comp.componentType || !comp.attachmentPointId) {
        return {
          valid: false,
          message: `Component ${i === 0 ? 'A' : 'B'} is missing required fields`
        }
      }
    }

    return { valid: true }
  }

  /**
   * Validate assembly structural integrity
   */
  validateStructuralIntegrity(data: AssemblyData): ValidationResult {
    const errors: string[] = []

    // Check that all joints reference existing components
    for (const joint of data.joints) {
      const compA = joint.componentA
      const compB = joint.componentB

      // Check if componentA exists
      if (compA.componentType === 'straw') {
        const strawExists = data.straws.some((s) => s.id === compA.componentId)
        if (!strawExists) {
          errors.push(`Joint ${joint.id} references non-existent straw: ${compA.componentId}`)
        }
      } else if (compA.componentType === 'connector') {
        const connectorExists = data.connectors.some((c) => c.id === compA.componentId)
        if (!connectorExists) {
          errors.push(`Joint ${joint.id} references non-existent connector: ${compA.componentId}`)
        }
      }

      // Check if componentB exists
      if (compB.componentType === 'straw') {
        const strawExists = data.straws.some((s) => s.id === compB.componentId)
        if (!strawExists) {
          errors.push(`Joint ${joint.id} references non-existent straw: ${compB.componentId}`)
        }
      } else if (compB.componentType === 'connector') {
        const connectorExists = data.connectors.some((c) => c.id === compB.componentId)
        if (!connectorExists) {
          errors.push(`Joint ${joint.id} references non-existent connector: ${compB.componentId}`)
        }
      }
    }

    // Check for duplicate IDs
    const allIds = [
      ...data.straws.map((s) => s.id),
      ...data.connectors.map((c) => c.id),
      ...data.joints.map((j) => j.id),
      ...data.actions.map((a) => a.id),
      ...data.activities.map((a) => a.id)
    ]

    const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index)
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`)
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
        message: errors.join('; ')
      }
    }

    return { valid: true }
  }

  /**
   * Format AJV errors into readable message
   */
  private formatErrors(errors: any[]): string {
    return errors
      .map((error) => {
        const path = error.instancePath || 'root'
        return `${path}: ${error.message}`
      })
      .join('; ')
  }

  /**
   * Get schema information
   */
  getSchemaInfo() {
    return {
      schemaId: 'lab-components',
      version: '1.0',
      supportedTypes: ['straws', 'connectors', 'joints', 'actions', 'activities', 'scene']
    }
  }
}

// Export singleton instance
export const schemaValidator = new SchemaValidator()

// Export validation functions for convenience
export const validateAssembly = (data: any): ValidationResult => schemaValidator.validateAssembly(data)

export const validateStraw = (straw: any): ValidationResult => schemaValidator.validateStraw(straw)

export const validateConnector = (connector: any): ValidationResult => schemaValidator.validateConnector(connector)

export const validateJoint = (joint: any): ValidationResult => schemaValidator.validateJoint(joint)

export const validateStructuralIntegrity = (data: AssemblyData): ValidationResult =>
  schemaValidator.validateStructuralIntegrity(data)
