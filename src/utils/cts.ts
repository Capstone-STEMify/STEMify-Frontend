export const sceneData = {
  environment: {
    background: '#F0F8FF',
    lighting: {
      ambient: '#404040',
      directional: {
        color: '#FFFFFF',
        intensity: 1.5,
        position: { x: 5, y: 10, z: 5 }
      }
    },
    camera: {
      position: { x: 0, y: 0, z: 50 },
      target: { x: 0, y: 0, z: 0 },
      fov: 45,
      controls: 'orbit'
    }
  },
  workspace: {
    bounds: {
      min: { x: -50, y: -50, z: -50 },
      max: { x: 50, y: 50, z: 50 }
    },
    grid: {
      visible: true,
      size: 100,
      divisions: 20
    }
  }
}
