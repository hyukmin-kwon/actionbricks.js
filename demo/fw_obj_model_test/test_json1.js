{
	"version":"1.0",

	"animationProperties" : {
		"running": false,
		"pressed": false
	},
	
	"abstractSceneGraph": {
		"name": "scene1",
		"type": "Scene",
		"children": [
			{	
				"name":"camera1",
				"type":"PerspectiveCamera",
				"parameters":{
					"fov":45,
					"aspect":"auto",
					"near":1,
					"far":2000					
				},
				"lookAt":{
						"x":0.0,
						"y":0.0,
						"z":0.0
				},					
				"position":{
					"x":10.0,
					"y":10.0,
					"z":30.0
				},
				"children": [],
				"actionBlocks": [
				]
			},
			{
				"name":"light1",
				"type":"DirectionalLight",
				"parameters": {
					"color":16777215,
					"intensity": 1.0
				},
				"position":{
					"x":0.3,
					"y":0.2,
					"z":0.5
				}
			},
			{
				"name":"ObjModel1",
				"type":"ObjModel",
				"path":"./male02/male02.obj",
				
				"position":{
					"x":0,
					"y":-3.0,
					"z":0
				},
				"rotation":{
					"x":0,
					"y":0,
					"z":0
				},
				"scale":{
					"x":0.08,
					"y":0.08,
					"z":0.08
				},
				"actionBlocks":[
					{
						"name":"Rotate1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0,
								"y":1.0,
								"z":0.0
							}							
						},
						"children": [
						]
					},
					{
						"name":"PickTest2",
						"type":"PickTest2",
						"attributes":{},
						"children": [
						]
					}
				]
			},					
			{
				"name":"floor plane",
				"type":"ThreeMesh",
				"geometryType":"PlaneGeometry",
				"materialType":"MeshPhongMaterial",
				"geometry": {
					"width":500,
					"height":500,
					"widthSegments":1,
					"heightSegments":1
				},
				"material": {
					"color":65535,
					"side":2
				},
				"position":{
					"x":0,
					"y":-5,
					"z":0
				},
				"rotation":{
					"x":1.5707963267948966,
					"y":0,
					"z":0
				}
			},
			{
				"name":"wall plane",
				"type":"ThreeMesh",
				"geometryType":"PlaneGeometry",
				"materialType":"MeshPhongMaterial",
				"geometry": {
					"width":500,
					"height":500,
					"widthSegments":1,
					"heightSegments":1
				},
				"material": {
					"color":16777215
				},
				"position":{
					"x":0,
					"y":0,
					"z":-250
				}				
			}
		],
		"actionBlocks":[
			{
				"name":"stats1",
				"type":"StatsAB",
				"attributes":{							
				},
				"children": [
				]
			}
		]
	},
	
	"internalEvents": [
		{
			"event": "test1",			
			"actionBlocks": [
				{
					"name":"RotateZ1",
					"type":"Rotate",
					"attributes":{
						"angular_velocity":{
							"x":0.0,
							"y":0.0,
							"z":-2.0
						}
					},
					"children": [
					]
				}		
			]
		}
	],
	
	"externalEvents": [
	
	],
	
	"fwEvents": [
		{
			"event":"picked",
			"actionBlocks":[					
			]
		}
	]	
}