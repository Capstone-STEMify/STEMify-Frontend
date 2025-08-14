export const components: any[] = [
  {
    id: 'straw_1',
    name: 'Orange Straw 25cm',
    geometry: {
      length: 5.0,
      diameter: 0.6,
      wallThickness: 0.1
    },
    material: {
      type: 'plastic',
      color: '#FF8C00',
      flexibility: 30,
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
        id: 'straw_1_start',
        localPosition: { x: -12.5, y: 0, z: 0 },
        connectionId: null,
        isAvailable: true
      },
      end: {
        id: 'straw_1_end',
        localPosition: { x: 12.5, y: 0, z: 0 },
        connectionId: null,
        isAvailable: true
      }
    },
    physics: {
      mass: 0.5,
      friction: 0.4,
      elasticity: 0.2
    }
  },
  {
    id: 'straw_2',
    name: 'Blue Straw 19cm',
    geometry: {
      length: 2.0,
      diameter: 0.6,
      wallThickness: 0.1
    },
    material: {
      type: 'plastic',
      color: '#4169E1',
      flexibility: 30,
      opacity: 1.0,
      roughness: 0.3,
      metalness: 0.0
    },
    transform: {
      position: { x: 30, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    endpoints: {
      start: {
        id: 'straw_2_start',
        localPosition: { x: -9.5, y: 0, z: 0 },
        connectionId: null,
        isAvailable: true
      },
      end: {
        id: 'straw_2_end',
        localPosition: { x: 9.5, y: 0, z: 0 },
        connectionId: null,
        isAvailable: true
      }
    },
    physics: {
      mass: 0.4,
      friction: 0.4,
      elasticity: 0.2
    }
  },

  // Connector
  {
    id: 'connector_1',
    name: 'T-Joint Connector',
    type: 'tee',
    geometry: {
      size: { x: 2.0, y: 2.0, z: 2.0 },
      portDiameter: 0.65,
      shape: 'cylindrical'
    },
    material: {
      type: 'plastic',
      color: '#32CD32',
      flexibility: 10,
      opacity: 1.0,
      roughness: 0.4,
      metalness: 0.0
    },
    transform: {
      position: { x: 15, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 }
    },
    ports: [
      {
        id: 'connector_1_port_0',
        localPosition: { x: -1.0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 180 },
        connectionId: null,
        isAvailable: true,
        portIndex: 0
      },
      {
        id: 'connector_1_port_1',
        localPosition: { x: 1.0, y: 0, z: 0 },
        orientation: { x: 0, y: 0, z: 0 },
        connectionId: null,
        isAvailable: true,
        portIndex: 1
      },
      {
        id: 'connector_1_port_2',
        localPosition: { x: 0, y: -1.0, z: 0 },
        orientation: { x: 0, y: 0, z: 90 },
        connectionId: null,
        isAvailable: true,
        portIndex: 2
      },
      {
        id: 'connector_1_port_3',
        localPosition: { x: 0, y: 1.0, z: 0 },
        orientation: { x: 0, y: 0, z: -90 },
        connectionId: null,
        isAvailable: true,
        portIndex: 3
      }
    ],
    constraints: {
      maxConnections: 3,
      allowedAngles: [0, 90, 180, 270]
    }
  }
]
