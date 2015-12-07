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
						"name":"Rotate1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0,
								"y":-2.0,
								"z":-2.0
							}							
						},
						"children": [
						]
					},
					{
						"name":"Move1",
						"type":"Move",
						"attributes":{
							"velocity":{
								"x":0,
								"y":-0.0,
								"z":-100.0
							}							
						},
						"children": [
						]
					}
					
				]					
			},
			{
				"name":"cube2",
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
							"color":255					
						}
					}
				},
				"position":{
					"x":10,
					"y":0,
					"z":0
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
				"actionBlocks": [
					{
						"name":"RotateY1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0,
								"y":-2.0,
								"z":0
							}						
						},
						"children": [
						]
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"cube1"														
						},
						"children": [
						]
					}					
				]					
			},
			{
				"name":"cube3",
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
							"color":16711680					
						}
					}
				},
				"position":{
					"x":-10,
					"y":0,
					"z":0
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
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"cube2"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"sphere1",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16						
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":65280,
							"shading":1					
						}
					}
				},
				"position":{
					"x":0,
					"y":6,
					"z":0
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
				"actionBlocks": [
					{
						"name":"Rotate1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0.0,
								"y":-2.0,
								"z":-2.0
							}						
						},
						"children": [
						]
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"cube3"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"sphere2",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16					
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":255,
							"shading":1				
						}
					}
				},
				"position":{
					"x":10,
					"y":6,
					"z":0
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
				"actionBlocks": [
					{
						"name":"RotateY1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0.0,
								"y":-2.0,
								"z":0.0
							}						
						},
						"children": [
						]
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"sphere1"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"sphere3",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16				
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"color":16711680,
							"shading":1				
						}
					}
				},
				"position":{
					"x":-10,
					"y":6,
					"z":0
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
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"sphere2"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"metal sphere1",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16			
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"specular":65280,
							"color": 0, 
							"ambient": 0,
							"shininess": 15, 
							"metal": true,
							"shading":1			
						}
					}
				},
				"position":{
					"x":0,
					"y":10,
					"z":0
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
				"actionBlocks": [
					{
						"name":"RotateY1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0.0,
								"y":-2.0,
								"z":-2.0
							}						
						},
						"children": [
						]
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"sphere3"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"metal sphere2",
				"type":"ThreeMesh",
				"typeData": {				
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16			
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"specular":255,
							"color": 0, 
							"ambient": 0,
							"shininess": 15, 
							"metal": true,
							"shading":1		
						}
					}
				},
				"position":{
					"x":10,
					"y":10,
					"z":0
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
				"actionBlocks": [
					{
						"name":"RotateY1",
						"type":"Rotate",
						"attributes":{
							"angular_velocity":{
								"x":0.0,
								"y":-2.0,
								"z":0.0
							}
						},
						"children": [
						]
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"metal sphere1"														
						},
						"children": [
						]
					}		
				]					
			},
			{
				"name":"metal sphere3",
				"type":"ThreeMesh",
				"typeData": {					
					"geometry":{
						"type" : "SphereGeometry",
						"radius":2,
						"widthSegments":32,
						"heightSegments":16			
					},
					"material":{
						"type":"MeshPhongMaterial",
						"parameters": {
							"specular":16711680,
							"color": 0, 
							"ambient": 0,
							"shininess": 15, 
							"metal": true,
							"shading":1		
						}
					}
				},
				"position":{
					"x":-10,
					"y":10,
					"z":0
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
					},
					{
						"name":"Trace1",
						"type":"Trace",
						"attributes":{
							"maxDistance": 15.0,
							"targetAbstractNodeName":"metal sphere2"														
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