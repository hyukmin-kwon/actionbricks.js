{
	"version":"1.0",

	"animationProperties" : {
		"running": false,
		"pressed": false
	},
	
	"abstractSceneGraph": {
		"name": "scene1",
		"type": "Scene",
		"typeData":{},
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
			},{
				"name":"light1",
				"type":"DirectionalLight",
				"typeData": {					
					"parameters": {
						"color":16777215,
						"intensity":0.8
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
			},{
				"name":"light2",
				"type":"DirectionalLight",
				"typeData": {					
					"parameters": {
						"color":16777215,
						"intensity":0.8
					}
				},
				"position":{
					"x":-0.3,
					"y":0.2,
					"z":-0.5
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
			},{
				"name":"marchingCubes1",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "MarchingCubesGeometry",						
						"expression" : "x*x*x+x*y + y*y - z*z -1",
						"size":15,
						"segments":50,
						"isoLevel":10			
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"specular":65280,
							"color": 0, 
							"ambient": 0,
							"shininess": 15, 
							"metal": true,
							"shading":2,
							"side":2
						}
					}
				},
				"position":{
					"x":0,
					"y":3,
					"z":0
				},
				"rotation":{
					"x":0.0,
					"y":-1.0,
					"z":0.0
				},
				"scale":{
					"x":1.0,
					"y":1.0,
					"z":1.0
				},
				"actionBlocks": [
					{
						"name":"RotateY1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0.0,
								"y":1.0,
								"z":0.0
							}						
						},
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
						"type":"PlaneGeometry",
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
			},{
				"name":"wall plane",
				"type":"ThreeMesh",	
				"typeData": {									
					"geometry": {
						"type":"PlaneGeometry",
						"width":1000,
						"height":1000,
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
					"z":-1000
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
				"attributes":{},
				"children": []
			}
		]
	},
	
	"internalEvents": [],
	"externalEvents": []
}