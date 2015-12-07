{
	"$schema": "http://json-schema.org/draft-04/schema#",
	"type": "object",
    "properties": {
		"version":{
			"type":"string"
		},
		"animationProperties": {
			"type": "object"
		},
		"abstractSceneGraph": { 
			"allOf":[
				{"$ref": "#/definitions/abstractNodeCommon"},
				{"$ref": "#/definitions/abstractNodeTypes/sceneNode" }				
			]
		},
		"internalEvents" : {
			"type": "array",
			"items": {
				"$ref": "#/definitions/eventNode"
			}
		},
		"externalEvents": {
			"type": "array",
			"items": {
				"$ref": "#/definitions/eventNode"
			}
		}, 
		"fwEvents":  {
			"type": "array",
			"items": {
				"$ref": "#/definitions/eventNode"
			}
		}
    },
	"required": [
		"version",
		"abstractSceneGraph"
	],
	"additionalProperties": false,
	"definitions": {		
		"abstractNode": {
			"allOf":[	
				{"$ref": "#/definitions/abstractNodeCommon"}, 
				{
					"oneOf" : [
						{ "$ref": "#/definitions/abstractNodeTypes/perspectiveCameraNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/directionalLightNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/pointLightNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/threeMeshNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/colladaModelNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/objModelNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/objMtlModelNode" },
						{ "$ref": "#/definitions/abstractNodeTypes/binaryModelNode"}
					]		
				} 
			]			
		},
		"abstractNodeCommon": {
			"title": "Abstract scene graph node common structure",
			"type": "object",
			"properties": {
				"name": {
					"type": "string"					
				},
				"type": { 
					"type": "string" 
				},
				"typeData": {					
					"type":"object"					
				},
				"children": {
					"type": "array",
					"items": {
						"$ref": "#/definitions/abstractNode"
					}
				},
				"actionBlocks":{
					"type": "array",
					"items": {
						"$ref": "#/definitions/actionBlock"
					}
				},
				"position" :  {
					"$ref": "#/definitions/vector3"
				}, 
				"rotation" : {
					"$ref": "#/definitions/vector3"				
				}, 
				"scale" : {
					"$ref": "#/definitions/vector3"				
				}				
			},
			"required": [ "name", "type", "typeData", "position", "rotation", "scale" ],
			"additionalProperties": false
		},		
		"actionBlock": {
			"allOf":[	
				{"$ref": "#/definitions/actionBlockCommon"}, 
				{
					"oneOf" : [
						{ "$ref": "#/definitions/actionBlockTypes/Rotate" },
						{ "$ref": "#/definitions/actionBlockTypes/Move" },
						{ "$ref": "#/definitions/actionBlockTypes/Trace" },
						{ "$ref": "#/definitions/actionBlockTypes/If" },
						{ "$ref": "#/definitions/actionBlockTypes/IfNot" },
						{ "$ref": "#/definitions/actionBlockTypes/RigidBodyMotion" },
						{ "$ref": "#/definitions/actionBlockTypes/Acceleration" },
						{ "$ref": "#/definitions/actionBlockTypes/Spring"},
						{ "$ref": "#/definitions/actionBlockTypes/SplineCurveTracking"},
						{ "$ref": "#/definitions/actionBlockTypes/PickTest"},
						{ "$ref": "#/definitions/actionBlockTypes/PickTest2"},
						{ "$ref": "#/definitions/actionBlockTypes/OrbitControls"},
						{ "$ref": "#/definitions/actionBlockTypes/LookAt"},
						{ "$ref": "#/definitions/actionBlockTypes/StatsAB"}	
					]
				}
			]
		},
		"actionBlockCommon": {
			"type": "object",
			"properties": {
				"name": {
					"type": "string"					
				},
				"type": { 
					"type": "string" 
				},				
				"attributes": {
					"type": "object"
				},
				"children" : {
					"type": "array",
					"items": {
						"$ref": "#/definitions/actionBlock"
					}
				}
			},
			"required": [ "name", "type" ],
			"additionalProperties": false			
		},		
		"actionBlockTypes": {
			"Rotate" :{
				"title": "Rotation action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Rotate" ]
					},
					"attributes": {
						"type": "object",
						"properties": {
							"angular_velocity": { "$ref": "#/definitions/vector3" }
						},
						"required": ["angular_velocity"],
						"additionalProperties": false
					}
				}
			},
			"Move" :{
				"title": "Move action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Move" ]
					},
					"attributes": {
						"type": "object",
						"properties": {
							"velocity": { "$ref": "#/definitions/vector3" }
						},
						"required": ["velocity"],
						"additionalProperties": false									
					}							
				}
			},
			"Trace" :{
				"title": "Trace action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Trace" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"maxDistance": {"type": "number"},
							"targetAbstractNodeName": {"type": "string"}									
						},
						"required": ["maxDistance", "targetAbstractNodeName"],
						"additionalProperties": false									
					}							
				}
			},
			"If" :{
				"title": "If action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "If" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"propertyName": {"type": "string"}									
						},
						"required": ["propertyName"],
						"additionalProperties": false									
					}							
				}
			},			
			"IfNot" :{
				"title": "IfNot action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "IfNot" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"propertyName": {"type": "string"}									
						},
						"required": ["propertyName"],
						"additionalProperties": false									
					}							
				}
			},
			"RigidBodyMotion" :{
				"title": "RigidBodyMotion action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "RigidBodyMotion" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"velocity": { "$ref": "#/definitions/vector3" }								
						},
						"required": ["velocity"],
						"additionalProperties": false									
					}							
				}
			},
			"Acceleration" :{
				"title": "Acceleration action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Acceleration" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"acceleration": { "$ref": "#/definitions/vector3" }								
						},
						"required": ["acceleration"],
						"additionalProperties": false									
					}							
				}
			},
			"Spring" :{
				"title": "Spring action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Spring" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"stiffness": { "type": "number"},
							"targetAbstractNodeName": {"type": "string"}												
						},
						"required": ["stiffness", "targetAbstractNodeName"],
						"additionalProperties": false									
					}							
				}
			},
			"SplineCurveTracking" :{
				"title": "SplineCurveTracking action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "SplineCurveTracking" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"controlPoints":{
								"type": "array",
								"items": {
									"$ref": "#/definitions/vector3"
								}
							},
							"autoStart": {"type": "boolean"},
							"playTime": {"type": "number"}
						},
						"required": ["controlPoints", "autoStart", "playTime"],
						"additionalProperties": false									
					}					
				}			
			},
			"PickTest" :{
				"title": "PickTest action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "PickTest" ]									
					}						
				}
			},
			"PickTest2" :{
				"title": "PickTest2 action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "PickTest2" ]									
					}						
				}
			},
			"OrbitControls" :{
				"title": "OrbitControls action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "OrbitControls" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"target": { "$ref": "#/definitions/vector3" }								
						},
						"required": ["target"],
						"additionalProperties": false									
					}							
				}
			},
			"LookAt": {
				"title": "LookAt action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "LookAt" ]									
					},
					"attributes": {
						"type": "object",
						"properties": {
							"targetAbstractNodeName": {"type": "string"}												
						},
						"required": ["targetAbstractNodeName"],
						"additionalProperties": false									
					}							
				}
			},
			"StatsAB" :{
				"title": "StatsAB action",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "StatsAB" ]									
					}						
				}
			}			
		},
		"eventNode": {
			"type": "object",
			"properties": {
				"event": { "type": "string" },
				"actionBlocks":{
					"type": "array",
					"items": {
						"$ref": "#/definitions/actionBlock"
					}
				}
			},
			"required": [ "event" ],
			"additionalProperties": false
		}, 
		
		"vector3" : {
			"type": "object",
			"properties": {
				"x": { "type": "number" },
				"y": { "type": "number" },
				"z": { "type": "number" }			
			},
			"required": [ "x", "y", "z" ],
			"additionalProperties": false
		},		
		"abstractNodeTypes": {
			"sceneNode" : {
				"title": "Scene Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "Scene" ]									
					},
					"typeData": {
						"type":"object",						
						"additionalProperties": false
					}
				}				
			},
			
			"perspectiveCameraNode" :{
				"title": "PerspectiveCamera Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "PerspectiveCamera" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
								"parameters": {
									"type": "object",
									"properties": {
										"fov": {"type":"number"},
										"autoAspect": {"type":"boolean"},
										"aspect": { "type":"number"},
										"near" : {"type":"number"},
										"far" : {"type":"number"}										
									},
									"required": [ 
										"fov", "autoAspect", "aspect", "near", "far"
									],
									"additionalProperties": false									
								},
								"lookAt": {"$ref": "#/definitions/vector3"}		
						},
						"required": [ 
							"parameters", "lookAt"
						],
						"additionalProperties": false						
					}
				}
			},
			
			"directionalLightNode": {
				"title": "DirectionalLight Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "DirectionalLight" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
							"parameters": {
								"type": "object",
								"properties": {
									"color": {"type":"integer", "default":16777215},
									"intensity": { "type":"number", "default":0.8}										
								},
								"required": [ 
									"color", "intensity"
								],
								"additionalProperties": false									
							}
						},
						"required": [ 
							"parameters"
						],
						"additionalProperties": false						
					}
				}
			},
			
			"pointLightNode": {
				"title": "PointLight Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "PointLight" ]
					},
					"typeData": {
						"type":"object",
						"properties": {
							"parameters": {
								"type": "object",
								"properties": {
									"color": {"type":"integer", "default":16777215},
									"intensity": { "type":"number", "default":1.0},
									"vanishingDistance": {"type":"number", "default":0.0}
								},
								"required": [ 
									"color" 
								],
								"additionalProperties": false									
							}
						},
						"required": [ 
							"parameters"
						],
						"additionalProperties": false						
					}
				}			
			},
			
			"threeMeshNode" : {
				"title": "ThreeMesh Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "ThreeMesh" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
							"geometry": {"$ref": "#/definitions/geometry"},
							"material": {"$ref": "#/definitions/material"}
						},
						"required": [ 
							"geometry", "material"
						],
						"additionalProperties": false
					}
				}
			},			
			
			"colladaModelNode" : {
				"title": "Collada Model Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "ColladaModel" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
							"path":{
								"type": "string"								
							}
						},
						"required": [ 
							"path"
						],
						"additionalProperties": false
					}
				}
			},
			"objModelNode" : {
				"title": "Obj Model Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "ObjModel" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
							"path":{
								"type": "string"								
							}
						},
						"required": [ 
							"path"
						],
						"additionalProperties": false	
					}
				}
			},
			"objMtlModelNode" : {
				"title": "Obj-Mtl Model Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "ObjMtlModel" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {
							"path":{
								"type": "string"								
							},
							"mtlPath":{
								"type": "string"								
							}
						},
						"required": [ 
							"path", "mtlPath"
						],
						"additionalProperties": false	
					}
				}
			},
			"binaryModelNode" : {
				"title": "Binary Model Node",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "BinaryModel" ]									
					},
					"typeData": {
						"type":"object",
						"properties": {					
							"path":{
								"type": "string"								
							}
						},
						"required": [ 
							"path"
						],
						"additionalProperties": false	
					}
				}
			}
		},
		"geometry" : {	
			"oneOf": [
				{"$ref": "#/definitions/geometries/boxGeometry"},
				{"$ref": "#/definitions/geometries/sphereGeometry"},
				{"$ref": "#/definitions/geometries/planeGeometry"},
				{"$ref": "#/definitions/geometries/marchingCubesGeometry"}
			]
		},
		"geometries": {
			"boxGeometry" : {
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "BoxGeometry" ]									
					},
					"width":{"type": "number", "default": 1.0},
					"height":{"type": "number", "default": 1.0},
					"depth":{"type": "number", "default": 1.0}
				},
				"required": [ "type", "width", "height", "depth" ],
				"additionalProperties": false
			},
			
			"sphereGeometry" : {
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "SphereGeometry" ]									
					},
					"radius":{"type": "number", "default": 1.0},
					"widthSegments":{"type": "integer", "default": 32},
					"heightSegments":{"type": "integer", "default": 16}
				},
				"required": [ "type", "radius", "widthSegments", "heightSegments" ],
				"additionalProperties": false
			},
			
			"planeGeometry" : {
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "PlaneGeometry" ]									
					},
					"width":{"type": "number", "default": 1.0},
					"height":{"type": "number", "default": 1.0},
					"widthSegments":{"type": "integer", "default": 1},
					"heightSegments":{"type": "integer", "default": 1}
				},
				"required": [ "type", "width", "height","widthSegments", "heightSegments" ],
				"additionalProperties": false
			},
			
			"marchingCubesGeometry" : {
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "MarchingCubesGeometry" ],
						"defaultList": [ "Cross with a hole",
							"Heart shape1",
							"Old default"
						]						
					},
					"expression": {"type": "string", "default":"x*x*x+x*y + y*y - z*z + 9", "defaultList":["x*y*z +y*y -x*x +z*z +x -y-2.0", "Math.pow((2*x*x + y*y + z*z -1),3)-x*x*z*z*z/10 -y*y*z*z*z", "x*x*x+x*y + y*y - z*z + 9"]},
					"size":{"type": "number", "default":15.0, "defaultList":[15.0, 3.0, 15.0]},
					"segments":{"type": "number", "default":50, "defaultList":[50, 50, 50]},
					"isoLevel":{"type": "number", "default":0, "defaultList":[0.0, 0.0, 0.0]}
				},
				"required": [ "type", "size", "segments","isoLevel" ],
				"additionalProperties": false
			}
		},
		
		"material" : {	
			"oneOf": [
				{"$ref": "#/definitions/materials/meshPhongMaterial"}				
			]
		},
		"materials":{
			"meshPhongMaterial" : {
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": [ "MeshPhongMaterial" ],
						"defaultList": [ "Red Metal",
							"Green Metal",
							"Blue Metal"
						]
					},
					"parameters": {
						"type": "object",
						"properties": {
							"color":{"type": "integer", "default":16777215, "defaultList":[0, 0, 0]},
							"shading":{"type": "integer", "default":2, "defaultList":[2, 2, 2]},
							"specular":{"type": "integer", "default":1118481, "defaultList":[16711680, 65280, 255]},
							"ambient":{"type": "integer", "default":16777215, "defaultList":[16777215, 16777215, 16777215]},
							"shininess":{"type": "integer", "default":30, "defaultList":[15, 15, 15]},
							"metal":{"type": "boolean", "default":false, "defaultList":[false, true, true]},
							"side":{"type": "integer", "default":2, "defaultList":[2, 2, 2]}
						},
						"required": [ "color" ],
						"additionalProperties": false
					}
				},
				"required": [ "type", "parameters" ],
				"additionalProperties": false
			}
		}
	}
}