# 3D Assembly System - New Schema Implementation

## Overview

This document outlines the new standardized schema for the 3D Assembly System, designed to be scalable, maintainable, and compatible with backend requirements.

## Key Improvements

### 1. **Schema Standardization**
- Follows backend JSON Schema specification
- Consistent Vector3 objects instead of arrays
- Proper type definitions for all components
- Structured metadata and validation

### 2. **Component Architecture**
- **Straws**: Enhanced with material properties, physics, and detailed endpoints
- **Connectors**: Comprehensive port system with constraints and orientation
- **Joints**: Flexible connection system with various joint types
- **Actions**: Rich animation and interaction system
- **Activities**: Step-by-step educational workflow

### 3. **Type Safety**
- Complete TypeScript types in `assembly-new.types.ts`
- JSON Schema validation with Ajv
- Runtime validation for data integrity

## File Structure Currently

```
src/features/assembly/
├── types/
│   └── assembly-new.types.ts          # New standardized types
├── utils/
│   └── schemaValidator.ts             # JSON Schema validator with Ajv
├── hooks/
│   └── useAssembly.ts                 # Hook for assembly management
├── components/
│   └── Workspace3D-new.tsx            # Updated workspace component
├── data/
│   └── octahedron-new.json           # Refactored octahedron data
└── README-new-schema.md              # This documentation
```

## Usage Examples

### 1. **Loading Assembly Data**

```typescript
import { useAssembly } from '@/features/assembly/hooks/useAssembly'

function AssemblyPlayer() {
  const {
    assembly,
    currentActivity,
    currentStep,
    loadAssemblyFromUrl,
    nextStep,
    validateCurrentStep
  } = useAssembly({ autoValidate: true })
  
  useEffect(() => {
    loadAssemblyFromUrl('/api/assemblies/octahedron.json')
  }, [])
  
  return (
    <Workspace3DNew 
      assemblyData={assembly}
      mode="player"
      onStepComplete={(stepId) => console.log('Completed:', stepId)}
    />
  )
}
```

### 2. **Schema Validation**

```typescript
import { validateAssembly, validateStructuralIntegrity } from '@/features/assembly/utils/schemaValidator'

// Validate complete assembly
const result = validateAssembly(assemblyData)
if (!result.valid) {
  console.error('Validation errors:', result.errors)
}

// Validate structural integrity
const structuralResult = validateStructuralIntegrity(assemblyData)
if (!structuralResult.valid) {
  console.error('Structural issues:', structuralResult.message)
}
```

### 3. **Creating New Components**

```typescript
// Create a new straw
const newStraw: Straw = {
  id: 'straw_blue_1',
  name: 'Blue Straw 15cm',
  geometry: {
    length: 15.0,
    diameter: 0.6,
    wallThickness: 0.1
  },
  material: {
    type: 'plastic',
    color: '#4169E1',
    flexibility: 20,
    opacity: 1.0,
    roughness: 0.3,
    metalness: 0.0
  },
  transform: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  endpoints: {
    start: {
      id: 'straw_blue_1_start',
      localPosition: { x: -7.5, y: 0, z: 0 },
      connectionId: null,
      isAvailable: true
    },
    end: {
      id: 'straw_blue_1_end',
      localPosition: { x: 7.5, y: 0, z: 0 },
      connectionId: null,
      isAvailable: true
    }
  },
  physics: {
    mass: 0.25,
    friction: 0.4,
    elasticity: 0.2
  }
}
```

## Schema Comparison

### Old Schema Issues
- Inconsistent array vs object usage
- Missing validation
- Hard-coded octahedron-specific logic
- Limited extensibility
- No proper type definitions

### New Schema Benefits
- **Consistent Structure**: All positions use Vector3 objects
- **Validation**: JSON Schema validation with Ajv
- **Extensible**: Easy to add new component types
- **Type Safe**: Complete TypeScript definitions
- **Backend Compatible**: Follows backend JSON Schema spec
- **Scalable**: Supports multiple assemblies and activities

## Component Types

### 1. **Straw**
```typescript
interface Straw {
  id: string
  name: string
  geometry: StrawGeometry      // length, diameter, wallThickness
  material: Material           // type, color, flexibility, opacity, etc.
  transform: Transform         // position, rotation, scale as Vector3
  endpoints: StrawEndpoints    // start and end connection points
  physics: Physics            // mass, friction, elasticity
}
```

### 2. **Connector**
```typescript
interface Connector {
  id: string
  name: string
  type: 'straight' | 'elbow' | 'tee' | 'cross' | 'custom'
  geometry: ConnectorGeometry  // size, portDiameter, shape
  material: Material
  transform: Transform
  ports: ConnectorPort[]       // connection points with orientation
  constraints: ConnectorConstraints // maxConnections, allowedAngles
}
```

### 3. **Joint**
```typescript
interface Joint {
  id: string
  type: 'fixed' | 'hinged' | 'ball' | 'slider'
  componentA: JointComponent   // what connects to what
  componentB: JointComponent
  constraints?: JointConstraints // movement limitations
  strength?: number            // connection strength
  created: string             // timestamp
}
```

## Activity System

### Step-by-Step Learning
- **Activities**: Complete learning modules
- **Steps**: Individual instructions with validation
- **Actions**: Animations and interactions
- **Validation**: Automatic progress checking

### Progress Tracking
- Step completion status
- Time tracking
- Validation results
- Hint system

## Migration Guide

### From Old to New Schema

1. **Update Types**: Replace old interfaces with new ones from `assembly-new.types.ts`
2. **Convert Data**: Transform array positions to Vector3 objects
3. **Add Validation**: Implement schema validation in data loading
4. **Update Components**: Use new Workspace3D-new component
5. **Enhance Activities**: Structure lessons as activities with steps

### Breaking Changes
- Position arrays `[x, y, z]` → Vector3 objects `{x, y, z}`
- Endpoint structure changes
- Port definition updates
- New validation requirements

## Performance Considerations

- **Lazy Loading**: Components load only when needed
- **Validation Caching**: Schema validation results cached
- **Optimized Rendering**: Step-based component visibility
- **Memory Management**: Proper cleanup and disposal

## Future Enhancements

1. **Builder Mode**: Visual assembly creation tool
2. **Real-time Collaboration**: Multi-user assembly sessions
3. **Export/Import**: Various format support (glTF, OBJ, etc.)
4. **Advanced Physics**: Realistic collision and constraints
5. **VR/AR Support**: Immersive assembly experience

## Testing

Access the new implementation at:
- `/[locale]/code-lab/octahedron-new` - New schema implementation
- Compare with: `/[locale]/code-lab/strawbees2-direct` - Old implementation

## Support

For questions or issues with the new schema implementation, refer to:
- Type definitions in `assembly-new.types.ts`
- Validation utilities in `schemaValidator.ts`
- Usage examples in `useAssembly.ts`
- Component implementation in `Workspace3D-new.tsx`

## Tổ chức thư mục Tương Lai
```
src/features/assembly/
types/ (khai báo types tương thích JSON schema)
components/3d/ (Straw3D, Connector3D, PortVisualizer, ConnectionVisualizer, Assembly3D)
components/builder/ (AssemblyBuilder, StepEditor, ComponentPalette, ValidationPanel)
components/player/ (AssemblyPlayer, StepViewer, ProgressTracker)
engine/ (connectionEngine.ts, snap.ts, validation.ts, diff.ts)
services/ (assemblyService.ts, componentService.ts)
hooks/ (useAssembly, useBuilder, useValidation)
utils/ (schemaValidator.ts, geometry.ts)
data/ (mẫu data, tạm thời)
```

## Khái niệm
Schema: “mẫu khung” mô tả dữ liệu (giống form có các ô: tên, vị trí, màu...). Nhờ schema, mọi bài đều cùng một khuôn.
JSON Schema: chuẩn quốc tế để kiểm tra dữ liệu JSON có đúng “mẫu khung” không.
Ajv: thư viện giúp kiểm tra JSON có đúng schema không (như “giám khảo” chấm dữ liệu).
Vector3: một điểm/độ/giá trị 3 chiều x, y, z (ví dụ vị trí trong không gian).
Transform: “đặt đồ vào không gian” gồm 3 phần:
position: vị trí
rotation: xoay
scale: phóng to/thu nhỏ
Material: “chất liệu/ngoại hình” (màu sắc, độ trong suốt, thô mịn…).
Port (cổng): lỗ trên connector để cắm ống hút.
Orientation (hướng): hướng của cổng (để ống hút biết cắm theo hướng nào).
Constraints (ràng buộc): giới hạn (ví dụ cổng tối đa 3 ống, góc cho phép…).
Validation (kiểm tra): đảm bảo dữ liệu đúng khuôn, tránh lỗi khi vẽ.