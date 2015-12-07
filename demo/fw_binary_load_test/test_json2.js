{
	"version":"1.0",

	"animationProperties" : {
		"running": false,
		"pressed": false
	},
	
	"abstractSceneGraph": {
		"name": "scene1",
		"type": "Scene",
		"typeData": {			
		},
		"children": [
			{	
				"name":"camera1",
				"type":"PerspectiveCamera",
				"typeData": {					
					"parameters":{
						"fov":45,
						"autoAspect": true,
						"aspect": 0,						
						"near":1,
						"far":2000					
					},
					"lookAt":{
						"x":0.0,
						"y":0.0,
						"z":0.0
					}
				},					
				"position":{
					"x":10.0,
					"y":10.0,
					"z":30.0
				},
				"rotation":{
					"x":0.0,
					"y":0.0,
					"z":0.0
				},
				"scale":{
					"x":1.0,
					"y":1.0,
					"z":1.0
				},
				"children": [],
				"actionBlocks": [
					{
						"name":"OrbitControls1",
						"type":"OrbitControls",
						"attributes":{
							"target":{
								"x":0.0,
								"y":0.0,
								"z":0.0
							}						
						},
						"children": [
						]
					}
				]
			},
			{
				"name":"light1",
				"type":"DirectionalLight",
				"typeData": {
					
					"parameters": {
						"color":16777215,
						"intensity":1.0
					}
				},
				"position":{
					"x":0.3,
					"y":0.2,
					"z":0.5
				},
				"rotation":{
					"x":0.0,
					"y":0.0,
					"z":0.0
				},
				"scale":{
					"x":1.0,
					"y":1.0,
					"z":1.0
				}
			},
			{
				"name":"Veyron1",
				"type":"BinaryModel",
				"typeData": {
					
					"path":"./veyron/VeyronNoUv_bin.js"
				},
				
				"position":{
					"x":0,
					"y":0.0,
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
						"name":"PickTest2",
						"type":"PickTest",
						"attributes":{},
						"children": [
						]
					}
				]
			},
			{
				"name":"Gallardo1",
				"type":"BinaryModel",
				"typeData": {					
					"path":"./gallardo/GallardoNoUv_bin.js"
				},
				
				"position":{
					"x":0,
					"y":0.0,
					"z":-50.0
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
						"name":"PickTest1",
						"type":"PickTest",
						"attributes":{},
						"children": [
						]
					}
				]
			},					
			{
				"name":"floor plane",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry": {
						"type" : "PlaneGeometry",
						"width":500,
						"height":500,
						"widthSegments":1,
						"heightSegments":1
					},
					"material": {
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":65535,
							"side":2
						}
					}
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
				},
				"scale":{
					"x":1.0,
					"y":1.0,
					"z":1.0
				}
			},
			{
				"name":"wall plane",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry": {
						"type" : "PlaneGeometry",
						"width":500,
						"height":500,
						"widthSegments":1,
						"heightSegments":1
					},
					"material": {
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":16777215
						}
					}
				},
				"position":{
					"x":0,
					"y":0,
					"z":-250
				},
				"rotation":{
					"x":0.0,
					"y":0.0,
					"z":0.0
				},
				"scale":{
					"x":1.0,
					"y":1.0,
					"z":1.0
				}
			}
		],
		"position":{
			"x":0.0,
			"y":0.0,
			"z":0.0
		},
		"rotation":{
			"x":0.0,
			"y":0.0,
			"z":0.0
		},
		"scale":{
			"x":1.0,
			"y":1.0,
			"z":1.0
		},
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