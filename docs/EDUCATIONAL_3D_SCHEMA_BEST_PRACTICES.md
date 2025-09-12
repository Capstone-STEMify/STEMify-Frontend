# 🏗️ Educational 3D Schema Architecture - Best Practices

## 📚 Overview
Đây là bộ khung vững chắc để xây dựng schema 3D bài giảng, đảm bảo component integrity và tính giáo dục tiệm tiến.

## 🎯 Problem Solved
- **❌ Component Fragmentation**: Elements transform riêng lẻ → Component bị "rã"
- **❌ Missing Assembly Hierarchy**: Không có cấp độ assembly để ghép components
- **❌ Poor Educational Flow**: Không theo progressive learning pattern

## ✅ Architecture Solution

### **1. Hierarchical Learning Structure**
```
📚 Educational Flow:
Individual Elements → Components → Assemblies → Final Structure

🔧 Technical Implementation:
Elements (base transform)
  → Components (component matrix)
    → Assemblies (assembly matrix)
      → Final Structure
```

### **2. Action Type Hierarchy**
```json
{
  "connect": "Kết nối elements trong component (Steps 1-6)",
  "build_component": "Hoàn thiện component từ elements",
  "assemble_components": "Ghép components thành assembly (Step 7+)", 
  "transform_assembly": "Transform assembly như một unit"
}
```

### **3. Component Matrix System**
```json
{
  "components": {
    "squares": [
      {
        "id": "square_base",
        "elements": { "straws": [...], "connectors": [...] },
        "componentMatrix": {
          "position": {"x": 0, "y": 0, "z": 0},
          "rotation": {"x": 0, "y": 0, "z": 0},
          "scale": {"x": 1, "y": 1, "z": 1}
        },
        "state": "built"
      }
    ]
  }
}
```

### **4. Assembly System**
```json
{
  "assemblies": {
    "diamond_assembly": {
      "id": "diamond_assembly",
      "components": ["square_base", "square_second"],
      "assemblyMatrix": { ... },
      "state": "assembled"
    }
  }
}
```

## 🚀 Implementation Guide

### **Step 1: Define Components**
```json
"components": {
  "squares": [
    {
      "id": "component_id",
      "elements": {
        "straws": ["straw_1", "straw_2"],
        "connectors": ["connector_1", "connector_2"]
      },
      "center": {"x": 10, "y": 0, "z": 10},
      "componentMatrix": { ... }
    }
  ]
}
```

### **Step 2: Create Assembly Actions**
```json
{
  "id": "action_assemble_diamond",
  "type": "assemble_components",
  "assemblyId": "diamond_assembly",
  "componentTransforms": {
    "square_second": {
      "type": "matrix_transform",
      "matrix": {
        "position": {"x": -12, "y": 8, "z": 0},
        "rotation": {"x": -0.7854, "y": 0, "z": 0}
      },
      "pivot": {"x": 27.8, "y": 0, "z": 7.8}
    }
  }
}
```

### **Step 3: Transform System**
- **Elements inherit từ Component Matrix**
- **Components được transform như units**
- **Assembly Matrix cho complex structures**

## 💡 Key Benefits

### **✅ Component Integrity**
- Elements di chuyển cùng nhau như một unit
- Không bị "rã" khi rotate Y/Z axis
- Matrix-based transformation đảm bảo consistency

### **✅ Educational Progression**
- Steps 1-6: Build individual components
- Step 7+: Assemble components together  
- Clear learning hierarchy

### **✅ Scalable Architecture**
- Dễ thêm components mới
- Support complex assemblies
- Maintainable codebase

### **✅ Real-time Controls**
- Component-level controls
- Matrix transformation preview
- Educational debugging tools

## 🔧 Technical Implementation

### **Workspace3D.tsx Changes**
```typescript
// Component matrix state management
const [componentMatrices, setComponentMatrices] = useState<Record<string, Matrix>>({})

// Element component lookup
const getElementComponent = (elementId: string): string | null => { ... }

// Matrix inheritance system
const getTransformOverrides = (instanceId: string, basePos: any, baseRot: any) => {
  // 1. Process assembly actions to build component matrices
  // 2. Apply component matrix to elements belonging to component
  // 3. Ensure component integrity during transforms
}
```

### **Assembly Action Processing**
```typescript
if (action.type === 'assemble_components') {
  const componentTransforms = action.componentTransforms || {}
  for (const [componentId, transform] of Object.entries(componentTransforms)) {
    currentComponentMatrices[componentId] = transform.matrix
  }
}

// Apply component matrix to all elements in component
const elementComponentId = getElementComponent(instanceId)
if (elementComponentId && currentComponentMatrices[elementComponentId]) {
  // Transform element using component matrix
  finalPos = rotateAroundPivot(finalPos, componentCenter, componentMatrix.rotation)
  finalPos = addVector(finalPos, componentMatrix.position)
}
```

## 📝 Schema Template

### **Complete Educational Schema Structure**
```json
{
  "metadata": { "version": "2.0", "description": "Educational 3D Schema" },
  
  "components": {
    "squares": [
      { "id": "component_1", "elements": {...}, "componentMatrix": {...} }
    ]
  },
  
  "assemblies": {
    "assembly_1": {
      "components": ["component_1", "component_2"],
      "assemblyMatrix": {...},
      "state": "separate"
    }
  },
  
  "actions": [
    { "type": "connect", "connectionGroup": "..." },
    { "type": "build_component", "componentId": "..." },
    { "type": "assemble_components", "assemblyId": "...", "componentTransforms": {...} },
    { "type": "transform_assembly", "assemblyId": "...", "transforms": {...} }
  ],
  
  "activities": [{
    "steps": [
      { "actionId": "connect_elements", "title": "Connect Elements" },
      { "actionId": "assemble_components", "title": "Assemble Components" }
    ]
  }]
}
```

## 🎓 Educational Benefits

### **Progressive Learning**
1. **Individual Elements**: Students learn basic components
2. **Component Building**: Understanding structural units
3. **Assembly Process**: Combining components systematically
4. **Final Structure**: Complete geometric understanding

### **Component Thinking**
- Students think in terms of "building blocks"
- Each component has clear purpose and integrity
- Assembly process mirrors real-world construction

### **Interactive Controls**
- Real-time component matrix adjustment
- Visual feedback on component transforms
- Educational debugging and exploration

## 🔄 Migration from Old Schema

### **Old Approach**
```json
// ❌ Individual element transforms
"action_transform_elements": {
  "targets": ["straw_1", "straw_2", "connector_1"],
  "rotation": {...}
}
```

### **New Approach**
```json
// ✅ Component-based assembly
"action_assemble_components": {
  "assemblyId": "diamond_assembly",
  "componentTransforms": {
    "square_component": {
      "matrix": { "rotation": {...}, "position": {...} }
    }
  }
}
```

---

## 📞 Usage Example

Để tạo bài giảng mới:

1. **Define Components** trong `components.squares`
2. **Create Assembly** trong `assemblies`
3. **Build Actions** với hierarchy: `connect` → `assemble_components` → `transform_assembly`
4. **Test Component Integrity** với realtime controls

Kết quả: Bài giảng có tính giáo dục cao, components giữ nguyên integrity, students học theo progressive approach.

