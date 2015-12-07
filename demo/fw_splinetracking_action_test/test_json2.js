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
				]
			},
			{
				"name":"light1",				
				"type":"DirectionalLight",
				"typeData": {					
					"parameters": {
						"color":16777215,
						"intensity":0.5
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
				"name":"cube1",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "BoxGeometry",
						"width":5,
						"height":5,
						"depth":5						
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":65280					
						}
					}
				},
				"position":{
					"x":0,
					"y":0,
					"z":0
				},
				"rotation": {
					"x":0,
					"y":0,
					"z":0
				},
				"scale": {
					"x":1.0,
					"y":1.0,
					"z":1.0
				},
				"actionBlocks": [
					{
						"name":"SplineCurveTracking1",
						"type":"SplineCurveTracking",
						"attributes":{
							"controlPoints":[
								{
									"x":0,
									"y":0.0,
									"z":10.0
								},
								{
									"x":10.0,
									"y":3.0,
									"z":-2.0
								},
								{
									"x":5.0,
									"y":0.0,
									"z":10.0
								},
								{
									"x":-5.0,
									"y":2.0,
									"z":-10.0
								},
								{
									"x":10.0,
									"y":5.0,
									"z":0.0
								},
								{
									"x":5.0,
									"y":1.0,
									"z":3.0
								}
							],
							"autoStart": true,
							"playTime": 5.0
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
			},
			{
				"name":"wall plane",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "PlaneGeometry",
						"width":500,
						"height":500,
						"widthSegments":1,
						"heightSegments":1		
					},
					"material":{
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
	
	"internalEvents": [],
	
	"externalEvents": []
}