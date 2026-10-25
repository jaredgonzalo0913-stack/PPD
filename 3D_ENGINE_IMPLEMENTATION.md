# ELCO 1 LMS - 3D Engine Implementation Guide

This guide explains how to integrate the 3D ME-C engine model using Three.js.

## Overview

The 3D engine viewer is ready to be integrated with Three.js. The current implementation includes:
- UI framework and controls
- Component panel system
- View mode switching (Normal, Exploded, Cutaway, Component)
- Auto-rotation capability
- Guided tour structure

## Integration Steps

### 1. Install Three.js Dependencies

The dependencies are already in `package.json`. To install:

```bash
npm install three @react-three/fiber @react-three/drei
```

### 2. Create 3D Engine Component

Create a new file: `src/components/Engine3DViewer.tsx`

```typescript
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Engine3DViewer({ mode, autoRotate }) {
  const engineRef = useRef<THREE.Group>(null);

  return (
    <Canvas camera={{ position: [10, 8, 12], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      
      {/* Load your 3D model here */}
      <group ref={engineRef}>
        {/* Model components */}
      </group>

      <OrbitControls autoRotate={autoRotate} />
    </Canvas>
  );
}
```

### 3. 3D Model Requirements

The engine model should include:
- **Main Engine Structure**: Central rotating assembly
- **14 Named Components** with unique IDs:
  - Engine Control System (ECS)
  - Electronic Control Unit (ECU)
  - Control Units (CU)
  - Hydraulic Power Supply
  - Hydraulic Cylinder Units
  - Fuel Injection System & Valve
  - FIVA (Fuel Injection Valve Actuator)
  - Exhaust Valve Actuation System & Actuator
  - Crank Angle Sensor
  - Pressure Sensors
  - Temperature Sensors
  - Hydraulic Oil System
  - Control Oil System
  - Engine Safety & Monitoring System

### 4. Component Interaction

Implement raycasting for component selection:

```typescript
const handleComponentClick = (componentName: string) => {
  const component = MEC_COMPONENTS.find(c => c.id === componentName);
  setSelectedComponent(component);
};
```

### 5. View Modes Implementation

**Normal View**: Standard 3D perspective
```typescript
// Default camera position
camera.position.set(10, 8, 12);
```

**Exploded View**: Components move away from center
```typescript
// Animate components outward
component.position.multiplyScalar(1.5);
```

**Cutaway View**: Use clipping planes to hide portions
```typescript
const clippingPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
material.clippingPlanes = [clippingPlane];
```

**Component Mode**: Highlight and focus on selected component
```typescript
selectedComponent.material.emissive.setHex(0x00d4ff);
camera.lookAt(selectedComponent.position);
```

### 6. Animation System

Implement animations for:
- **360° Rotation**: Smooth auto-rotation around Y-axis
- **Exploded View**: Smooth outward movement of components
- **Component Highlighting**: Glow effect on selection
- **Cutaway Animation**: Smooth clipping plane transitions

```typescript
useFrame((state) => {
  if (autoRotate && engineRef.current) {
    engineRef.current.rotation.y += 0.005;
  }
});
```

### 7. Guided Tour System

Implement camera animations for guided tour:

```typescript
const guidedTourSteps = [
  {
    title: 'Engine Control System',
    target: controlSystemPosition,
    duration: 3000,
  },
  {
    title: 'Fuel Injection System',
    target: fuelSystemPosition,
    duration: 3000,
  },
  // ... more steps
];
```

### 8. Performance Optimization

- **LOD (Level of Detail)**: Use fewer polygons at distance
- **Instancing**: Reuse identical geometry for similar parts
- **Texture Atlasing**: Combine textures into single image
- **Model Compression**: Export as GLB instead of GLTF

```typescript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
loader.load('engine.glb', (gltf) => {
  engineRef.current = gltf.scene;
});
```

## Recommended Model Files

- **Format**: GLB (binary GLTF) for best web performance
- **File Size**: Target < 15MB uncompressed
- **Textures**: High-res (2K) for close-up inspection
- **Geometry**: Optimize to 500K-1M polygons total

## Integration with Current UI

The 3D viewer integrates with existing state management:

```typescript
const { 
  engineLabMode, 
  auto360Rotation, 
  selectedComponent,
  guidedTourActive,
  guidedTourStep 
} = useAppStore();
```

## Testing the Integration

1. Create a simple test model (cube with colored faces)
2. Test camera controls (orbit, zoom, pan)
3. Test component selection and highlighting
4. Test view mode switching
5. Test auto-rotation
6. Test guided tour navigation

## Resources

- **Three.js Documentation**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber/
- **Drei Helpers**: https://github.com/pmndrs/drei
- **3D Model Format**: GLB/GLTF 2.0

## Next Steps

1. Create or obtain 3D model of MAN B&W ME-C engine
2. Implement basic Three.js viewer component
3. Add component selection and highlighting
4. Implement view mode switching
5. Add animations for exploded/cutaway views
6. Create guided tour system
7. Optimize performance for web

---

For questions or implementation support, refer to the Three.js and React Three Fiber documentation.
