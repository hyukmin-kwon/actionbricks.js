{
  "version": "1.0",
  "abstractSceneGraph": {
    "name": "scene1",
    "position": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "rotation": {
      "x": 0.0,
      "y": 0.0,
      "z": 0.0
    },
    "scale": {
      "x": 1.0,
      "y": 1.0,
      "z": 1.0
    },
    "type": "Scene",
    "typeData": {},
    "children": [
      {
        "name": "camera1",
        "position": {
          "x": 10.0,
          "y": 10.0,
          "z": 30.0
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "PerspectiveCamera",
        "typeData": {
          "parameters": {
            "fov": 45.0,
            "autoAspect": true,
            "aspect": 0.0,
            "near": 1.0,
            "far": 2000.0
          },
          "lookAt": {
            "x": 0.0,
            "y": 0.0,
            "z": 0.0
          }
        },
        "children": [],
        "actionBlocks": [
          {
            "name": "OrbitControls1",
            "type": "OrbitControls",
            "attributes": {
              "target": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
              }
            },
            "children": []
          }
        ]
      },
      {
        "name": "light1",
        "position": {
          "x": 0.3,
          "y": 0.2,
          "z": 0.5
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "DirectionalLight",
        "typeData": {
          "parameters": {
            "color": 1.6777215E7,
            "intensity": 0.8
          }
        },
        "children": [],
        "actionBlocks": []
      },
      {
        "name": "metal sphere1",
        "position": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "ThreeMesh",
        "typeData": {
          "geometry": {
            "radius": 3.0,
            "widthSegments": 32,
            "heightSegments": 16,
            "type": "SphereGeometry"
          },
          "material": {
            "parameters": {
              "color": 0,
              "shading": 1,
              "specular": 65280,
              "ambient": 0,
              "shininess": 15,
              "metal": true,
              "side": 0
            },
            "type": "MeshPhongMaterial"
          }
        },
        "children": [],
        "actionBlocks": [
          {
            "name": "RotateY1",
            "type": "Rotate",
            "attributes": {
              "angular_velocity": {
                "x": 0.0,
                "y": -2.0,
                "z": -2.0
              }
            },
            "children": []
          },
          {
            "name": "motion1",
            "type": "RigidBodyMotion",
            "attributes": {
              "velocity": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
              }
            },
            "children": [
              {
                "name": "Acceleration1",
                "type": "Acceleration",
                "attributes": {
                  "acceleration": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0
                  }
                },
                "children": []
              },
              {
                "name": "Spring1",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere3"
                },
                "children": []
              },
              {
                "name": "Spring2",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere2"
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "name": "metal sphere2",
        "position": {
          "x": 10.0,
          "y": 10.0,
          "z": 0.0
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "ThreeMesh",
        "typeData": {
          "geometry": {
            "radius": 3.0,
            "widthSegments": 32,
            "heightSegments": 16,
            "type": "SphereGeometry"
          },
          "material": {
            "parameters": {
              "color": 0,
              "shading": 1,
              "specular": 255,
              "ambient": 0,
              "shininess": 15,
              "metal": true,
              "side": 0
            },
            "type": "MeshPhongMaterial"
          }
        },
        "children": [],
        "actionBlocks": [
          {
            "name": "RotateY1",
            "type": "Rotate",
            "attributes": {
              "angular_velocity": {
                "x": 0.0,
                "y": -2.0,
                "z": 0.0
              }
            },
            "children": []
          },
          {
            "name": "motion1",
            "type": "RigidBodyMotion",
            "attributes": {
              "velocity": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
              }
            },
            "children": [
              {
                "name": "Acceleration1",
                "type": "Acceleration",
                "attributes": {
                  "acceleration": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0
                  }
                },
                "children": []
              },
              {
                "name": "Spring1",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere1"
                },
                "children": []
              },
              {
                "name": "Spring2",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere2"
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "name": "metal sphere3",
        "position": {
          "x": -10.0,
          "y": 10.0,
          "z": 0.0
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "ThreeMesh",
        "typeData": {
          "geometry": {
            "radius": 2.0,
            "widthSegments": 32,
            "heightSegments": 16,
            "type": "SphereGeometry"
          },
          "material": {
            "parameters": {
              "color": 0,
              "shading": 1,
              "specular": 16711680,
              "ambient": 0,
              "shininess": 15,
              "metal": true,
              "side": 0
            },
            "type": "MeshPhongMaterial"
          }
        },
        "children": [],
        "actionBlocks": [
          {
            "name": "RotateZ1",
            "type": "Rotate",
            "attributes": {
              "angular_velocity": {
                "x": 0.0,
                "y": 0.0,
                "z": -2.0
              }
            },
            "children": []
          },
          {
            "name": "motion1",
            "type": "RigidBodyMotion",
            "attributes": {
              "velocity": {
                "x": 0.0,
                "y": 0.0,
                "z": 0.0
              }
            },
            "children": [
              {
                "name": "Acceleration1",
                "type": "Acceleration",
                "attributes": {
                  "acceleration": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0
                  }
                },
                "children": []
              },
              {
                "name": "Spring1",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere2"
                },
                "children": []
              },
              {
                "name": "Spring2",
                "type": "Spring",
                "attributes": {
                  "stiffness": 5.0,
                  "targetAbstractNodeName": "metal sphere1"
                },
                "children": []
              }
            ]
          }
        ]
      },
      {
        "name": "floor plane",
        "position": {
          "x": 0.0,
          "y": -5.0,
          "z": 0.0
        },
        "rotation": {
          "x": 1.5707964,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "ThreeMesh",
        "typeData": {
          "geometry": {
            "width": 500.0,
            "height": 500.0,
            "widthSegments": 1,
            "heightSegments": 1,
            "type": "PlaneGeometry"
          },
          "material": {
            "parameters": {
              "color": 65535,
              "shading": 0,
              "specular": 0,
              "ambient": 0,
              "shininess": 0,
              "metal": false,
              "side": 2
            },
            "type": "MeshPhongMaterial"
          }
        },
        "children": [],
        "actionBlocks": []
      },
      {
        "name": "wall plane",
        "position": {
          "x": 0.0,
          "y": 0.0,
          "z": -1000.0
        },
        "rotation": {
          "x": 0.0,
          "y": 0.0,
          "z": 0.0
        },
        "scale": {
          "x": 1.0,
          "y": 1.0,
          "z": 1.0
        },
        "type": "ThreeMesh",
        "typeData": {
          "geometry": {
            "width": 500.0,
            "height": 500.0,
            "widthSegments": 1,
            "heightSegments": 1,
            "type": "PlaneGeometry"
          },
          "material": {
            "parameters": {
              "color": 16777215,
              "shading": 0,
              "specular": 0,
              "ambient": 0,
              "shininess": 0,
              "metal": false,
              "side": 0
            },
            "type": "MeshPhongMaterial"
          }
        },
        "children": [],
        "actionBlocks": []
      }
    ],
    "actionBlocks": [
      {
        "name": "stats1",
        "attributes": {},
        "type": "StatsAB",
        "children": []
      }
    ]
  },
  "animationProperties": {
    "running": false,
    "pressed": false
  },
  "internalEvents": [],
  "externalEvents": [],
  "fwEvents": []
}