# workspace tree

## Xem ví dụ của hexadron.json thì ta sẽ ra được file json cho tree

```json
{
  "workspace_tree": {
    "actions": [
      // action 1 ứng với step 1
      {
        "id": "action_prepare_connectors",
        "name": "Show Base Connectors",
        "type": "highlight",
        "targets": ["connector_3legs_1", "connector_3legs_2", "connector_3legs_3", "connector_3legs_4"],
        "duration": 2.0,
        "animation": {
          "colorHighlight": "#FFD700",
          "pulseEffect": true
        }
      },
      // action 2 ứng với step 2
      {
        "id": "action_adjust_base_connector_arms",
        "name": "Adjust Base Connector Arms",
        "type": "transform_arm",
        "targets": ["connector_3legs_1", "connector_3legs_2", "connector_3legs_3", "connector_3legs_4"],
        "duration": 2.0,
        "connectorArmTransforms": {
          "connector_3legs_1": {
            "arm_1": { "x": 0, "y": 0, "z": -0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": 0.7854 }
          },
          "connector_3legs_2": {
            "arm_1": { "x": 0, "y": 0, "z": -0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": 0.7854 }
          },
          "connector_3legs_3": {
            "arm_1": { "x": 0, "y": 0, "z": 0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": -0.7854 }
          },
          "connector_3legs_4": {
            "arm_1": { "x": 0, "y": 0, "z": 0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": -0.7854 }
          }
        },
        "interpolation": "easeInOut"
      },
      // action 3 ứng với step 3
      {
        "id": "action_build_base",
        "name": "Form Base Square",
        "type": "highlight",
        "targets": ["straw_yellow_1", "straw_yellow_2", "straw_yellow_3", "straw_yellow_4"],
        "duration": 2.0
      },
      // action 4 ứng với step 4
      {
        "id": "action_build_4_vertical_straws",
        "name": "Form 4 Vertical Straws",
        "type": "highlight",
        "targets": ["straw_yellow_5", "straw_yellow_6", "straw_yellow_7", "straw_yellow_8"],
        "duration": 2.0
      },
      // action 5 ứng với step 5
      {
        "id": "action_build_4_top_connectors",
        "name": "Form 4 Top Connectors",
        "type": "highlight",
        "targets": ["connector_3legs_5", "connector_3legs_6", "connector_3legs_7", "connector_3legs_8"],
        "duration": 2.0,
        "animation": {
          "colorHighlight": "#FFD700",
          "pulseEffect": true
        }
      },
      // action 6 ứng với step 6
      {
        "id": "action_adjust_additional_connector_arms",
        "name": "Adjust Additional Connector Arms",
        "type": "transform_arm",
        "instantAppear": true,
        "targets": ["connector_3legs_5", "connector_3legs_6", "connector_3legs_7", "connector_3legs_8"],
        "duration": 2.0,
        "connectorArmTransforms": {
          "connector_3legs_5": {
            "arm_1": { "x": 0, "y": 0, "z": -0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": 0.7854 }
          },
          "connector_3legs_6": {
            "arm_1": { "x": 0, "y": 0, "z": -0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": 0.7854 }
          },
          "connector_3legs_7": {
            "arm_1": { "x": 0, "y": 0, "z": 0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": -0.7854 }
          },
          "connector_3legs_8": {
            "arm_1": { "x": 0, "y": 0, "z": 0.7854 },
            "arm_2": { "x": 0, "y": 0, "z": -0.7854 }
          }
        },
        "interpolation": "easeInOut"
      },
      // action 7 ứng với step 7
      {
        "id": "action_build_top",
        "name": "Form Top Square",
        "type": "highlight",
        "targets": ["straw_yellow_9", "straw_yellow_10", "straw_yellow_11", "straw_yellow_12"],
        "duration": 2.0
      },
      // action 8 ứng với step 8
      {
        "id": "action_final_highlight",
        "name": "Complete Octahedron",
        "type": "rotate_highlight",
        "targets": "all",
        "duration": 3.0,
        "rotationSpeed": 1.0
      }
    ],
    "activities": [
      {
        "id": "octahedron_assembly",
        "name": "Octahedron Assembly Lab",
        "description": "Learn to construct a regular octahedron using connectors and straws - understanding 3D geometric principles through hands-on assembly",
        "difficulty": "intermediate",
        "estimatedTime": 1800,
        "objectives": [
          "Understand octahedron geometry and symmetry",
          "Practice systematic 3D construction techniques",
          "Learn connector port alignment and joint strength",
          "Develop spatial reasoning through step-by-step assembly"
        ],
        "steps": [
          // step 1
          {
            "actionId": "action_prepare_connectors",
            "title": "Prepare Base Connectors",
            "description": "Identify and position the four 3-leg connectors that will form the base square of the hexahedron",
            "expectedResult": "4 three-leg connectors are visible and highlighted",
            "hints": [
              "Each connector has 3 ports for straw connections",
              "Notice the red color indicating connector type",
              "Observe the spatial arrangement forming square corners"
            ],
            "validation": {
              "type": "structure",
              "criteria": {
                "requiredConnectors": ["connector_3leg_1", "connector_3leg_2", "connector_3leg_3", "connector_3leg_4"],
                "visibility": true
              }
            }
          },
          // step 2
          {
            "actionId": "action_adjust_base_connector_arms",
            "title": "Adjust Base Connector Arms",
            "description": "Fine-tune the arm angles of all base connectors for optimal alignment",
            "expectedResult": "All base connector arms are positioned at the correct angles",
            "hints": [
              "Adjust arm_1 to +15 degrees for better alignment",
              "Adjust arm_2 to -15 degrees to balance the structure",
              "All 4 base connectors should have consistent arm angles"
            ],
            "validation": {
              "type": "arm_transform",
              "criteria": {}
            }
          },
          // step 3
          {
            "actionId": "action_build_base",
            "title": "Form Base Square",
            "description": "Connect the 4 connectors with straws to create the square foundation of the hexahedron",
            "expectedResult": "A complete square base is formed with proper connections",
            "hints": [
              "Each side of the square uses one straw",
              "Straws should fit snugly into connector ports",
              "Verify all connections are properly aligned"
            ],
            "validation": {
              "type": "connection",
              "criteria": {
                "requiredConnectionsGroup": "base_square",
                "connected": true
              }
            }
          },
          // step 4
          {
            "actionId": "action_build_4_vertical_straws",
            "title": "Build 4 Vertical Straws",
            "description": "Attach 4 vertical straws to the base square's connectors to prepare for the top square",
            "expectedResult": "4 vertical straws are connected to the base square's connectors",
            "hints": [
              "Each vertical straw connects to the middle port of a base connector",
              "Ensure straws are perpendicular to the base square",
              "Check that all 4 vertical straws are securely attached"
            ],
            "validation": {
              "type": "connection",
              "criteria": {
                "requiredConnectionsGroup": "bottom_square_4_vertical_straws",
                "connected": true
              }
            }
          },
          // step 5
          {
            "actionId": "action_build_4_top_connectors",
            "title": "Attach 4 Top Connectors",
            "description": "Position and connect the top 4 connectors onto the vertical straws",
            "expectedResult": "Second square is translated into position above the base square without rotation",
            "hints": [
              "Each top connector attaches to the top of a vertical straw",
              "Align connectors so their ports face outward for the top square",
              "Ensure all 4 top connectors are properly seated on the straws"
            ],
            "validation": {
              "type": "connection",
              "criteria": {
                "requiredConnectionsGroup": "4_vertical_straws_4_top_connectors",
                "connected": true
              }
            }
          },
          // step 6
          {
            "actionId": "action_adjust_additional_connector_arms",
            "title": "Adjust Top Connector Arms",
            "description": "Fine-tune the arm angles of all top connectors for optimal alignment",
            "expectedResult": "All top connector arms are positioned at the correct angles",
            "hints": [
              "Adjust arm_1 to +15 degrees for better alignment",
              "Adjust arm_2 to -15 degrees to balance the structure",
              "All 4 top connectors should have consistent arm angles"
            ],
            "validation": {
              "type": "arm_transform",
              "criteria": {}
            }
          },
          // step 7
          {
            "actionId": "action_build_top",
            "title": "Form Top Square",
            "description": "Assemble the top square component from the adjusted connectors and straws",
            "expectedResult": "A complete top square is formed with proper connections",
            "hints": [
              "Each side of the top square uses one straw",
              "Straws should fit snugly into connector ports",
              "Verify all connections are properly aligned"
            ],
            "validation": {
              "type": "connection",
              "criteria": {
                "requiredConnectionsGroup": "top_square",
                "connected": true
              }
            }
          },
          {
            "actionId": "action_final_highlight",
            "title": "Complete Hexadron",
            "description": "Congratulation ...",
            "expectedResult": "You build a hexadron with straw and connector"
          }
        ],
        "playbackControls": {
          "allowRewind": true,
          "allowPause": true,
          "allowSkip": false,
          "speed": 1.0
        }
      }
    ]
  }
}
```

```json


```
