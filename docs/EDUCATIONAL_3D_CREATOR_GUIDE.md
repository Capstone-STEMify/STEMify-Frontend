# 3D Assembly Creator Guide

## Learning Objectives
- Understand how to build a complete 3D content creation tool for educational purposes
- Learn drag & drop implementation with Three.js and React
- Master scene state management and object transformation systems
- Implement JSON schema export for educational assembly sequences

## System Overview

The 3D Assembly Creator is a comprehensive tool that allows teachers to create interactive 3D assembly lessons by dragging components, positioning them with gizmos, and exporting structured JSON schemas compatible with the existing Workspace3D.tsx viewer.

## Architecture Components

### 1. Main Page Structure (`src/app/[locale]/create-3d/page.tsx`)

```typescript
export default function Create3DPage() {
  return (
    <div className="h-screen w-full bg-gray-50">
      {/* Header with title and save buttons */}
      {/* Main content with Creator3D component */}
    </div>
  )
}
```

**Key Features:**
- Full-screen layout optimized for 3D editing
- Header with project metadata and action buttons
- Responsive design that works on various screen sizes

### 2. Component Hierarchy

```
Creator3D (Main Container)
├── ComponentPalette (Left sidebar)
├── CreatorWorkspace (3D Canvas)
│   ├── SceneContent (Three.js objects)
│   ├── TransformControls (Gizmo system)
│   └── CreatorToolbar (View controls)
└── ObjectInspector (Right panel)
```

### 3. State Management (`useCreatorScene` Hook)

```typescript
interface CreatorScene {
  objects: SceneObject[]           // All scene objects
  selectedObjectId: string | null // Currently selected object
  camera: CameraSettings          // Camera position/settings
  environment: EnvironmentSettings // Lighting/background
}

interface CreatorState {
  scene: CreatorScene
  isDragging: boolean
  dragSource: ComponentTemplate | null
  transformMode: 'translate' | 'rotate' | 'scale'
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  showAxes: boolean
}
```

**State Management Philosophy:**
- **Centralized State**: All scene data managed in one place
- **Immutable Updates**: State changes through pure functions
- **Optimistic UI**: Immediate visual feedback for user actions
- **Undo/Redo Ready**: State structure supports future undo functionality

## Component Deep Dive

### ComponentPalette - Drag Source System

```typescript
const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    id: '3leg_red',
    type: 'connector_3leg',
    name: '3-Leg Connector',
    description: 'Red 3-way connector for joining straws',
    icon: '/images/components/connector_3_leg.png',
    defaultProps: { scale: { x: 1, y: 1, z: 1 } }
  },
  {
    id: 'green_11_2', 
    type: 'straw_green',
    name: 'Green Straw',
    description: 'Green straw segment for building structures',
    icon: '/images/components/straw_green.png',
    defaultProps: { scale: { x: 1, y: 1, z: 1 } }
  }
]
```

**Drag & Drop Implementation:**
- **HTML5 Drag API**: Native browser drag & drop with custom drag images
- **Visual Feedback**: Component cards change appearance during drag
- **Dual Interaction**: Drag to canvas or double-click to add at origin
- **Template System**: Reusable component definitions with metadata

### CreatorWorkspace - 3D Canvas Integration

```typescript
function CreatorWorkspace() {
  const [isDragOver, setIsDragOver] = useState(false)
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!dragSource) return
    
    // Calculate 3D position from 2D drop coordinates
    const position = { x: 0, y: 0, z: 0 }
    onObjectAdd(dragSource.type, position)
  }, [dragSource, onObjectAdd])
}
```

**3D Integration Features:**
- **Drop Zone Overlay**: Visual feedback during drag operations
- **Raycast Positioning**: Future enhancement for precise 3D placement
- **Grid Snapping**: Automatic alignment to configurable grid
- **Transform Gizmos**: Interactive 3D manipulation handles

### SceneObject Management

```typescript
interface SceneObject {
  id: string                    // Unique identifier
  type: ComponentType          // 'connector_3leg' | 'straw_green'
  name: string                 // User-editable display name
  position: Vector3           // World position
  rotation: Vector3           // Euler rotation (radians)
  scale: Vector3              // Non-uniform scaling
  templateId: string          // Reference to component template
  created: number             // Timestamp for ordering
  selected?: boolean          // Selection state
}
```

**Object Lifecycle:**
1. **Creation**: Generate unique ID, set default properties
2. **Selection**: Visual highlight, transform gizmo attachment
3. **Transformation**: Real-time position/rotation updates
4. **Persistence**: Maintain state through scene changes
5. **Export**: Convert to assembly JSON format

### Transform Controls Integration

```typescript
<TransformControls
  ref={transformControlsRef}
  mode={transformMode}  // 'translate' | 'rotate' | 'scale'
  onObjectChange={handleTransformChange}
  showX={true}
  showY={true}
  showZ={true}
/>
```

**Gizmo System Features:**
- **Mode Switching**: Toggle between translate, rotate, scale
- **Real-time Updates**: Immediate visual feedback during transformation
- **Grid Snapping**: Optional alignment to scene grid
- **Multi-axis Control**: Individual axis manipulation with visual guides

### ObjectInspector - Property Editor

```typescript
const updatePosition = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
  const numValue = parseFloat(value)
  if (!isNaN(numValue)) {
    onObjectUpdate(selectedObject.id, {
      position: { ...selectedObject.position, [axis]: numValue }
    })
  }
}, [selectedObject, onObjectUpdate])
```

**Inspector Features:**
- **Real-time Sync**: Bidirectional updates between gizmo and input fields
- **Validation**: Numeric input validation with error handling
- **Unit Conversion**: Degree/radian conversion for rotations
- **Object Metadata**: Display creation time, type, template info

## Export System - JSON Schema Generation

### Assembly Format Compatibility

The creator exports JSON schemas compatible with the existing octahedron.json format:

```typescript
const exportAssembly = (): AssemblyExport => {
  return {
    metadata: {
      version: '2.0',
      created: new Date().toISOString(),
      author: metadata.author,
      title: metadata.title
    },
    templates: {
      materials: [/* Material references */],
      components: [/* Component templates */]
    },
    instances: {
      straws: [/* Straw instance data */],
      connectors: [/* Connector instance data */]
    },
    actions: [/* Basic visibility actions */],
    activities: [/* Generated activity steps */],
    scene: {
      environment: {/* Lighting and camera settings */}
    }
  }
}
```

**Export Process:**
1. **Object Grouping**: Separate straws and connectors
2. **Template Mapping**: Reference shared component templates
3. **Transform Conversion**: World coordinates to template-relative
4. **Action Generation**: Create basic show/hide sequences
5. **Metadata Injection**: Add creator information and timestamps

### Integration with Workspace3D

The exported JSON can be directly loaded by the existing Workspace3D.tsx:

```typescript
// In Workspace3D component
const { assembly, instances } = useAssembly()

useEffect(() => {
  loadAssembly('/path/to/exported-assembly.json')
}, [])
```

**Compatibility Features:**
- **Template Reuse**: Same component definitions as octahedron.json
- **Instance Format**: Compatible transform and property structure
- **Action System**: Basic actions for educational sequencing
- **Scene Environment**: Matching lighting and camera setup

## Advanced Features

### Grid and Snapping System

```typescript
const applyGridSnap = (position: Vector3, gridSize: number): Vector3 => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
    z: Math.round(position.z / gridSize) * gridSize
  }
}
```

### Selection Management

```typescript
const handleObjectClick = useCallback((objectId: string) => {
  // Update selection state
  onObjectSelect(objectId)
  
  // Attach transform controls
  if (transformControlsRef.current) {
    const targetObject = objectRefs.current[objectId]
    transformControlsRef.current.attach(targetObject)
  }
}, [onObjectSelect])
```

### Visual Feedback Systems

- **Selection Highlighting**: Green wireframe around selected objects
- **Drag Overlays**: Drop zone indicators with component preview
- **Transform Gizmos**: Color-coded axis handles with hover states
- **Grid Visualization**: Configurable grid with section highlighting

## Performance Considerations

### Rendering Optimization

```typescript
// Minimize re-renders with selective updates
const memoizedSceneObjects = useMemo(() => {
  return objects.map(obj => ({
    ...obj,
    // Only trigger re-render for actual changes
    _renderKey: `${obj.id}-${obj.position.x}-${obj.position.y}-${obj.position.z}`
  }))
}, [objects])
```

### Memory Management

- **Object Pool**: Reuse Three.js geometries and materials
- **Cleanup Handlers**: Proper disposal of WebGL resources
- **Reference Management**: Avoid memory leaks in object refs
- **Selective Updates**: Only re-render changed objects

## Future Enhancements

### Step Creation System (Pending)

```typescript
interface AssemblyStep {
  id: string
  name: string
  description: string
  actionType: 'show' | 'connect' | 'transform' | 'highlight'
  targetObjects: string[]
  duration: number
  animation?: AnimationParams
}
```

**Planned Features:**
- **Timeline Editor**: Visual step sequencing interface
- **Animation Keyframes**: Custom object animations between steps
- **Connection System**: Define how straws connect to connectors
- **Validation Rules**: Ensure assembly steps are physically possible

### Advanced Export Options

- **Multi-format Export**: STL, OBJ, glTF for 3D printing
- **Step-by-step GIF**: Animated assembly instructions
- **PDF Generation**: Printable assembly guides
- **AR/VR Support**: Export for immersive viewing

## Key Takeaways

- **Modular Architecture**: Clean separation of concerns enables easy feature addition
- **State-driven UI**: Centralized state management simplifies complex interactions
- **Template System**: Reusable component definitions reduce data duplication
- **Export Compatibility**: JSON schema matches existing viewer requirements
- **Performance First**: Optimized rendering and memory management for smooth editing
- **User Experience**: Intuitive drag & drop with immediate visual feedback
- **Educational Focus**: Designed specifically for classroom assembly instruction

## Code Example - Complete Usage Flow

```typescript
// 1. Teacher drags connector from palette
<ComponentPalette onDragStart={handleDragStart} />

// 2. Drop creates object in scene
const handleDrop = (position) => {
  const objectId = addObject('connector_3leg', position)
  selectObject(objectId) // Auto-select new object
}

// 3. Transform with gizmo or inspector
<TransformControls onObjectChange={updateObjectTransform} />
<ObjectInspector onObjectUpdate={updateObjectProperties} />

// 4. Export completed assembly
const exportData = exportAssembly({
  title: 'Custom Bridge Assembly',
  description: 'Students build a bridge using straws and connectors',
  author: 'Ms. Johnson'
})

// 5. Use in classroom with Workspace3D
<Workspace3D assemblyUrl="/assemblies/custom-bridge.json" />
```

This comprehensive system provides teachers with professional-grade 3D content creation tools while maintaining compatibility with the existing educational framework.

