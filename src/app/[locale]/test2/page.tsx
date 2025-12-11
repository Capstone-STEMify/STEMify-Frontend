import React from 'react'

export default function Page() {
  const jsonObject = {
    metadata: {
      title: 'Assembly emu_fc1f61b54ebf',
      description: 'Exported from workspace',
      author: 'STEMify User',
      version: '2.0',
      created: '2025-12-11T07:16:28.516Z',
      lastModified: '2025-12-11T07:16:28.516Z'
    },
    templates: {
      materials: [
        { id: 'plastic_green', source: '/components/templates/MaterialLibrary/plastic_green.json' },
        { id: 'plastic_red', source: '/components/templates/MaterialLibrary/plastic_red.json' },
        { id: 'plastic_blue', source: '/components/templates/MaterialLibrary/plastic_blue.json' },
        { id: 'plastic_yellow', source: '/components/templates/MaterialLibrary/plastic_yellow.json' },
        { id: 'plastic_orange', source: '/components/templates/MaterialLibrary/plastic_orange.json' },
        { id: 'plastic_pink', source: '/components/templates/MaterialLibrary/plastic_pink.json' }
      ],
      components: [
        { id: 'blue_19_0', source: '/components/templates/StrawTypes/blue_19_0.json' },
        { id: 'green_16_2', source: '/components/templates/StrawTypes/green_16_2.json' },
        { id: 'pink_8_9', source: '/components/templates/StrawTypes/pink_8_9.json' },
        { id: 'orange_6_3', source: '/components/templates/StrawTypes/orange_6_3.json' },
        { id: 'yellow_3_8', source: '/components/templates/StrawTypes/yellow_3_8.json' },
        { id: '1leg', source: '/components/templates/ConnectorTypes/1leg.json' },
        { id: '2leg', source: '/components/templates/ConnectorTypes/2legs.json' },
        { id: '3leg', source: '/components/templates/ConnectorTypes/3legs.json' },
        { id: '5leg', source: '/components/templates/ConnectorTypes/5legs.json' }
      ]
    },
    instances: {
      straws: [],
      connectors: [
        {
          templateId: '1leg',
          instances: [
            {
              id: 'connector_1',
              transform: {
                position: { x: -0.6475473374387839, y: 0, z: 1.0008010201402797 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
              },
              arms: { arm_1: { x: 0, y: 0, z: 0 }, arm_2: { x: 0, y: 0, z: 0 }, arm_3: { x: 0, y: 0, z: 0 } }
            }
          ]
        }
      ]
    },
    actions: [{ id: 'action_1', name: 'Bước 1', type: 'highlight', targets: ['connector_1'], duration: 2 }],
    activities: [
      {
        id: 'custom_assembly',
        name: 'Cây Cầu Thông Minh',
        description: 'Cây Cầu Thông Minh',
        difficulty: 'beginner',
        estimatedTime: 600,
        steps: [
          { actionId: 'action_1', title: 'Bước 1', description: '', expectedResult: '', hints: [], validation: null },
          { title: 'Bước 1', actionId: 'action_1', description: '', expectedResult: '', hints: [] }
        ]
      }
    ],
    scene: {
      environment: {
        background: '#f5f5f5',
        lighting: {
          ambient: '#404040',
          directional: { color: '#FFFFFF', intensity: 1.2, position: { x: 10, y: 15, z: 8 } }
        },
        camera: { position: { x: 30, y: 20, z: 30 }, target: { x: 0, y: 0, z: 0 }, fov: 60, controls: 'orbit' }
      },
      workspace: {
        bounds: { min: { x: -100, y: -100, z: -100 }, max: { x: 100, y: 100, z: 100 } },
        grid: { visible: true, size: 1, divisions: 100 }
      }
    }
  }

  const jsonString = JSON.stringify(jsonObject)
  console.log(jsonString)

  return <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{jsonString.replace(/"/g, '\\"')}</pre>
}
