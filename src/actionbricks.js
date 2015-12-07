window.requestAnimationFrame = function(){
    return (
        window.requestAnimationFrame       || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        }
    );
}();



var TDAFW = Backbone.Model.extend(
	{
		constructor: function(arg, options) {
			Backbone.Model.apply(this, arguments);
			var running = false;
			var paused = false;
			
			var defaultCamera = undefined;
			var canvas = options.canvas;
			canvas.tdafw = this; 
			var that = this;
			var renderer = new THREE.WebGLRenderer({canvas:canvas});
			
			var clock = new THREE.Clock();
			
			var animationProperties = new Backbone.Model();
			var scene = new THREE.Scene();
			var abtractSceneGraph = new TDAFW.AbstractNode();			
			
			var internalEvents = _.extend({}, Backbone.Events);
			this.externalEvents = _.extend({}, Backbone.Events);
			var fwEvents = _.extend({}, Backbone.Events);
			
			var internalEventNodes = [];
			var externalEventNodes = [];
			var fwEventNodes = [];
			var projector = new THREE.Projector();
			var waitingList = [];
			var pendingExec = false;
			
			THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader());			
			
			/** 
			*  Main animation loop life cycle event handling routines
			*/
			
			var preUpdate = function (delta) {
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.preUpdate(delta);
						});
					}
					return true;
				});					
			};
			
			var update = function (delta) {
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.update(delta);
						});
					}
					return true;
				});
			};
		
			var postUpdate = function (delta) {
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.postUpdate(delta);							
						});
					}
					return true;
				});			
			};
			
			var preRender = function (delta) {
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.preRender(delta);
						});
					}
					return true;
				});	
			};
						
			var render = function(delta) {
			
				renderer.clear();
				
				renderer.setViewport( 0, 0, canvas.width, canvas.height );
				renderer.setScissor( 0, 0, canvas.width, canvas.height );
				renderer.enableScissorTest ( true );
				renderer.render( scene, defaultCamera );
			};
			
			var postRender = function (delta) {
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.postRender(delta);							
						});
					}
					return true;
				});	
			};
			
			/** 
			*  Animation loop handling routine
			*/
			
			var animate = function () {
				if (running && !paused) {
					var delta = clock.getDelta();
					preUpdate(delta);
					update(delta);
					postUpdate(delta);
					preRender(delta);
					render(delta);
					postRender(delta);
					requestAnimationFrame(animate);
				}
			};		
			
			/** 
			*  JSON Loading function 
			*  @param url : url for json file
			*  @param callback : callback function with parameters (success, json object)
			*  @param progressCallback: progress reporting callback parameters ({total: total length, loaded: loaded length)
			*/
			
			var loadAjaxJSON = function ( url, callback, progressCallback ) {
				var xhr = new XMLHttpRequest();
				var length = 0;
				xhr.onreadystatechange = function () {
					if ( xhr.readyState === xhr.DONE ) {
						if ( xhr.status === 200 || xhr.status === 0 ) {
							if ( xhr.responseText ) {
								var json = JSON.parse( xhr.responseText );
								callback(true, json);
							} else {		
								callback(false, 'TDAFW loadAjaxJSON: "' + url + '" seems to be unreachable or the file is empty.');
							}	
						} else {
							callback(false, 'TDAFW loadAjaxJSON: Couldn\'t load "' + url + '" (' + xhr.status + ')');
						}
					} else if ( xhr.readyState === xhr.LOADING ) {
						if ( progressCallback ) {
							if ( length === 0 ) {
								length = xhr.getResponseHeader( 'Content-Length' );
							}
							progressCallback( { total: length, loaded: xhr.responseText.length } );
						}
					} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {
						if ( progressCallback !== undefined ) {
							length = xhr.getResponseHeader( "Content-Length" );
						}
					}
				};
				xhr.open( "GET", url, true );
				xhr.send( null );
			};
			
			/** 
			*  ThreeMesh parsing routine 
			*  @param node : ThreeMesh abstractNode 
			*/
			
			var createThreeMesh = function (node) {
				var createdGeometry, createdMaterial; 
				var geometry = node.typeData.geometry;
				var material = node.typeData.material;

				switch (geometry.type) {
					case "BoxGeometry": 
						createdGeometry = new THREE.BoxGeometry(
							geometry.width
							, geometry.height
							, geometry.depth );						
						break;
					case "PlaneGeometry":
						createdGeometry = new THREE.PlaneGeometry( 
							geometry.width
							, geometry.height
							, geometry.widthSegments
							, geometry.heightSegments);
						
						break;					
					case "SphereGeometry":
						createdGeometry = new THREE.SphereGeometry( 
							geometry.radius
							, geometry.widthSegments
							, geometry.heightSegments
							, geometry.phiStart
							, geometry.phiLength 
							, geometry.thetaStart 
							, geometry.thetaLength);

						break;
					case "MarchingCubesGeometry":
						createdGeometry = new TDAFW.MarchingCubesGeometry ( 
						    /**
							* @TODO: add security checking for expression string							
							*/

							new Function ("x", "y", "z", "return " + geometry.expression + ";")
							, geometry.size
							, geometry.segments
							, geometry.isoLevel);
						
						break;
					default:
						var msg = "TDAFW: Unknown geometry type : [" + geometry.type + "]";
						console.error(msg);
						throw {errorMsg: msg};
				}
				
				switch (material.type) {
					case "MeshPhongMaterial":
						createdMaterial = new THREE.MeshPhongMaterial(material.parameters);
						
						break;

					default:
						var msg = "TDAFW: Unknown material type : [" + node.type + "]";
						console.error(msg);
						throw {errorMsg: msg};
				}
							
				return new THREE.Mesh(createdGeometry, createdMaterial);
			};
			
			/** 
			*  THREE.Object3D object creating function for Abstract Node parsing 
			*  @param node : Abstract Node 
			*/
			
			var createThreeNodes = function (node) {
				
				var createdThreeNode = undefined; 
				
				switch (node.type) {
					case "Scene": 
						createdThreeNode = new THREE.Scene();
						break;
					case "PerspectiveCamera":
						var aspect = node.typeData.parameters.aspect;
						if (node.typeData.parameters.autoAspect ) {
							aspect = canvas.width / canvas.height;
						}
						createdThreeNode = new THREE.PerspectiveCamera( node.typeData.parameters.fov, aspect, node.typeData.parameters.near, node.typeData.parameters.far );						
						defaultCamera = createdThreeNode;
						break;

					case "DirectionalLight":
						createdThreeNode = new THREE.DirectionalLight( node.typeData.parameters.color, node.typeData.parameters.intensity );
						if (node.position) {
							createdThreeNode.position.set( node.position.x, node.position.y, node.position.z );
							createdThreeNode.position.normalize();
							node.position = undefined;
						}							
						break;
					case "PointLight":
						if (node.typeData.parameters.vanishingDistance) {
							createdThreeNode = new THREE.DirectionalLight( node.typeData.parameters.color, node.typeData.parameters.intensity, node.typeData.parameters.vanishingDistance);
						} else {
							createdThreeNode = new THREE.DirectionalLight( node.typeData.parameters.color, node.typeData.parameters.intensity );
						}
						if (node.position) {
							createdThreeNode.position.set( node.position.x, node.position.y, node.position.z );
							createdThreeNode.position.normalize();
							node.position = undefined;
						}							
						break;
					case "ThreeMesh":
						createdThreeNode = createThreeMesh(node);
						break;
					case "ColladaModel":
						createdThreeNode = new THREE.Object3D();
						var colladaLoader = new THREE.ColladaLoader();
						var waitingInfo = {threeNode:createdThreeNode};
						waitingList.push(waitingInfo);
						colladaLoader.options.convertUpAxis = true;
						colladaLoader.load( node.typeData.path, function ( collada ) {						
							collada.scene.updateMatrix();
							createdThreeNode.add(collada.scene);							
							var index = waitingList.indexOf(waitingInfo);
							if (index !== - 1) {							
								waitingList.splice(index,1);
							}
							checkPendingAndRun();
						} );
						break;
					case "ObjModel":
						createdThreeNode = new THREE.Object3D();
						var objLoader = new THREE.OBJLoader();
						var waitingInfo = {threeNode:createdThreeNode};
						waitingList.push(waitingInfo);
						objLoader.load( node.typeData.path, function ( object ) {
							createdThreeNode.add(object);
							var index = waitingList.indexOf(waitingInfo);
							if (index !== - 1) {
								waitingList.splice(index,1);
							}
							checkPendingAndRun();
						} );
						break;
					case "ObjMtlModel":
						createdThreeNode = new THREE.Object3D();
						var objMtlLoader = new THREE.OBJMTLLoader();
						var waitingInfo = {threeNode:createdThreeNode};
						waitingList.push(waitingInfo);
						objMtlLoader.load( node.typeData.path, node.typeData.mtlPath, function ( object ) {
							createdThreeNode.add(object);
							var index = waitingList.indexOf(waitingInfo);
							if (index !== - 1) {
								waitingList.splice(index,1);
							}
							checkPendingAndRun();
						} );
						break;
					case "BinaryModel":
						createdThreeNode = new THREE.Object3D();
						var binaryLoader = new THREE.BinaryLoader();
						var waitingInfo = {threeNode:createdThreeNode};
						waitingList.push(waitingInfo);
						binaryLoader.load( node.typeData.path, function ( geometry, materials ) {
							var material = new THREE.MeshFaceMaterial( materials );
							var mesh = new THREE.Mesh( geometry, material );
							createdThreeNode.add(mesh);
							var index = waitingList.indexOf(waitingInfo);
							if (index !== - 1) {
								waitingList.splice(index,1);
							}
							checkPendingAndRun();
						} );
						break;
					default:
						var msg = "TDAFW: Unknown abstract node type : [" + node.type + "]";
						console.error(msg);
						throw {errorMsg: msg};
				}
				if (node.position) {
					createdThreeNode.position.set( node.position.x, node.position.y, node.position.z );
				}
				if (node.rotation) {
					createdThreeNode.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z );
				}
				if (node.scale) {
					createdThreeNode.scale.set( node.scale.x, node.scale.y, node.scale.z );
				}
				if (node.typeData.lookAt) {
					createdThreeNode.lookAt(new THREE.Vector3( node.typeData.lookAt.x, node.typeData.lookAt.y, node.typeData.lookAt.z ));
				}
			
				return createdThreeNode;
			};
			/** 
			*  Function for Abstract Node parsing 
			*  @param node : Abstract Node 
			*/
			
			var parseAbstractNode = function (node) {
				var currentAbstractNode = new TDAFW.AbstractNode();
				//create Three scene nodes
				var currentThreeNode = createThreeNodes(node);
				currentAbstractNode.setTargetThreeObject(currentThreeNode);
				currentAbstractNode.set("name",node.name);
				currentAbstractNode.set("type",node.type);
				
				if(node.children && node.children instanceof Array) {
					for (var i = 0; i < node.children.length; i++)
					{
						var result = parseAbstractNode(node.children[i]);
						currentAbstractNode.addChild(result.createdAbstractNode);
						if (currentThreeNode && result.createdThreeNode) {
							currentThreeNode.add (result.createdThreeNode);
						}
					}
				}
				
				if (node.actionBlocks && node.actionBlocks instanceof Array) {
					for (var i = 0; i < node.actionBlocks.length; i++)
					{
						currentAbstractNode.attachActionBlock(parseActionBlock(node.actionBlocks[i]));
					}
				}
				return {createdAbstractNode: currentAbstractNode, createdThreeNode: currentThreeNode};
			};
			
			/** 
			*  Function for Action block parsing 
			*  @param node : Action block Node 
			*/
			
			var parseActionBlock = function (node) {
				var actionBlockConstructor = TDAFW.ActionBlocks[node.type];
				
				if (actionBlockConstructor) {
					var attributes = node.attributes || {};
					var currentActionBlock = new actionBlockConstructor(attributes,{fw:that, internalEvents:internalEvents});
					currentActionBlock.set("name",node.name);
					currentActionBlock.set("type",node.type);
				} else {
					console.error("TDAFW: No such action block." + node.type);
					throw {errorMsg: "TDAFW:  No such action block." + node.type};
				}
				for (var i = 0; i < node.children.length; i++)
				{
					currentActionBlock.addChild(parseActionBlock(node.children[i]));
				}
				return currentActionBlock;			
			};
			
			/** 
			*  Function for event node parsing 
			*  @param node : event node 
			*  @param eventManager : backbone.js Event object
			*  @param eventHandlerName : event handler name string
			*/			
			
			var parseEvents = function (node, eventManager, eventHandlerName){
				var eventsArray = [];
				if (node instanceof Array) {				
					for (var i = 0; i < node.length; i++)
					{
						var currentEvent = new TDAFW.EventNode({event:node[i].event, eventManager:eventManager, eventHandlerName:eventHandlerName});
						if (node[i].actionBlocks && node[i].actionBlocks instanceof Array) {
							for (var j = 0; j < node[i].actionBlocks.length; j++)
							{
								currentEvent.attachActionBlock(parseActionBlock(node[i].actionBlocks[j]));
							}
						}
						eventsArray.push(currentEvent);
					}
				}				
				return eventsArray;
			};
			
			/** 
			*  Function for TDA JSON parsing 
			*  @param json : JSON object of tda JSON file 
			*/	
			
			var parseJSON = function (json) {

				animationProperties = new Backbone.Model(json.animationProperties || {});
				
				if (json.abstractSceneGraph) {
					var result = parseAbstractNode(json.abstractSceneGraph);
					abtractSceneGraph = result.createdAbstractNode;
					scene = result.createdThreeNode;					
				} else {
					console.error("TDAFW: No abstractScene declared.");
				}
				
				if (json.internalEvents instanceof Array) {
					internalEventNodes = parseEvents(json.internalEvents, internalEvents, "internalEvent");					
				}
				
				if (json.externalEvents instanceof Array) {
					externalEventNodes = parseEvents(json.externalEvents, that.externalEvents, "externalEvent");					
				}
				
				unSetupFwEventTriggers ();
				if (json.fwEvents instanceof Array) {
					fwEventNodes = parseEvents(json.fwEvents, fwEvents, "fwEvent");					
					setupFwEventTriggers();
				}				
			};
			
			/** 
			*  Function for setting up event listeners for fwEvents
			*/	
			
			var setupFwEventTriggers = function () {
				for (var i = 0; i < fwEventNodes.length; i++) {
					switch (fwEventNodes[i].get("event")) {
						case "picked":
							canvas.addEventListener( 'mousedown', onPicking, false );
						break;						
					}
				}
			};
			
			/** 
			*  Function for removing event listeners for fwEvents
			*/	
			
			var unSetupFwEventTriggers = function () {
				for (var i = 0; i < fwEventNodes.length; i++) {
					switch (fwEventNodes[i].get("event")) {
						case "picked":
							canvas.removeEventListener( 'mousedown', onPicking, false );
						break;						
					}
				}
				fwEventNodes = [];
			};
			
			/** 
			*  Event handler for "picked" fwEvent
			*/
			
			var onPicking = function(event) {
				var rect = canvas.getBoundingClientRect();
				canvas_x = event.clientX - rect.left;
				canvas_y = event.clientY - rect.top;
				var vector = new THREE.Vector3((canvas_x / canvas.width) * 2 -1, -(canvas_y/canvas.height) * 2 + 1, 1);
				projector.unprojectVector( vector, defaultCamera );
				var ray = new THREE.Raycaster( defaultCamera.position, vector.sub( defaultCamera.position ).normalize() );
				var intersects = ray.intersectObject( scene,true );
				
				if ( intersects.length > 0 )
				{
					console.log("Hit @ " + toString( intersects[0].point ) );
					
					var isTargetedThreeObject = function (threeObject) {
						var result = {found:false, abstractNode:null};
						abtractSceneGraph.traverseDFS(function (abstractNode) {
							if (abstractNode.getTargetThreeObject() === threeObject) {
								result = {found:true, abstractNode:abstractNode};
								return false;
							} else {							
								return true;
							}
						});
						return result;
					};
					
					var getAbstractNodeContainingThreeObject = function (threeObject) {
						var currentThreeObject = threeObject;
						do {
							var isTargeted = isTargetedThreeObject(currentThreeObject);
							if (isTargeted.found) {
								return isTargeted.abstractNode;
							}
							currentThreeObject = currentThreeObject.parent;
						} 
						while (currentThreeObject instanceof THREE.Object3D);
						
						return null;
					};
											
					var intersectingAbstractNode = getAbstractNodeContainingThreeObject(intersects[0].object);
					var handlerParam = {
						"event":"picked", 
						abstractNode:intersectingAbstractNode, 
						intersectionInfo:intersects[0]						
					};
					
					fwEvents.trigger("picked",handlerParam);					
					
					var actionBlocks = intersectingAbstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							return actionBlock.fwEvent(handlerParam);
						});
					}
				}				
			};

			/**			
			* waiting routine for lazy resource loading
			*/			
			
			var checkPendingAndRun = function () {
				if (waitingList.length === 0 && pendingExec) {
					running = true;
					pendingExec = false;
					animate();
				}
			};
			
			/** public methods
			*   loadScene
			*	run	
			* 	pause
			*	reset
			* 	stop
			*/

			this.loadScene = function (url, loadCompleteCallback, progressCallback) {
				var callback = function (success, result) {
					if (success) {
						parseJSON (result);
					} else {
						console.error(result);
					}
					loadCompleteCallback(success, result);
				};
				loadAjaxJSON(url, callback, progressCallback);
			};		
			
			// run the animation loop
			this.run = function () {
				if (!running) {
					if (waitingList.length === 0) {
						running = true;
						animate();
					} else if (waitingList.length > 0) {
						pendingExec = true;						
					}
				}
			};
			this.pause = function () {
				if (running) {
					paused = true;
				}
			};
			this.resume = function () {
				if (running) {
					paused = false;
					animate();
				}
			};
			this.stop = function () {
				running = false;
				paused = false;
			};
			//getters
			this.getCanvas = function () {
				return canvas;
			};
			
			this.getAbstractSceneRoot = function () {
				return abtractSceneGraph;
			};
			
			this.getAbstractNodeByName = function (name) {
				var foundAbstractNode;
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					if (abstractNode.get("name") === name) {
						foundAbstractNode = abstractNode;
						return false;
					} else {
						return true;
					}
				});
				return foundAbstractNode;
			};
			
			this.getActionBlockByName = function (name) {
				var foundActionBlock = undefined;
				abtractSceneGraph.traverseDFS(function (abstractNode) {
					var actionBlocks = abstractNode.getAttachedActionBlocks();
					for (var i = 0; i < actionBlocks.length; i++)
					{
						actionBlocks[i].traverseDFS(function (actionBlock) {
							if (actionBlock.get("name") === name) {
								foundActionBlock = actionBlock;
								return false;
							} else {
								return true;
							}							
						});
					}
					if (foundActionBlock === undefined) {
						return true;
					} else {
						return false;
					}					
				});
				return foundActionBlock;
			};
			
			//camera related
			this.setDefaultCamera = function (newDefaultCamera) {
				if (newDefaultCamera instanceof THREE.Camera) {
					defaultCamera = newDefaultCamera;
				} else {
					console.warn("TDAFW: default camera must be an instance of THREE.Camera.");
				}
			};
			
			this.getDefaultCamera = function () {
				return defaultCamera;
			};
			
			this.getRenderer = function () {
				return renderer;
			};
			
			//construction commands
			this.addToScene = function (node) { 
				scene.add(node);
			};
			
			this.addToAbstractScene = function (abstractNode) { 
				abtractSceneGraph.addChild(abstractNode);
			};			
		},		
	}
);

TDAFW.TreeNode = Backbone.Model.extend(
	{
		constructor: function(arg, options) {
			Backbone.Model.apply(this, arguments);
			
			var parent = undefined;
			var children = [];
			
			this.getParent = function () {
				return parent;
			};
			this.setParent = function (newParent) {
				parent = newParent;
			};
			
			//stops traversing if callback returns false
			this.traverseDFS = function (callback) {
				if (callback(this)) {
					for (var i = 0; i < children.length; i++)
					{
						children[i].traverseDFS(callback);
					}
				}
			};
			
			this.addChild = function (child) {
				if (child === this) {
					console.warn('TDAFW : A tree node can not add itself as a child.');
					return;
				}
				
				if (child instanceof TDAFW.TreeNode) {
					if (child.getParent() !== undefined) {
						child.getParent().removeChild(child);
					}
					
					child.setParent(this);
					children.push(child);
				} else {
					console.warn('TDAFW : Not a tree node.');
				}
			};
			
			this.removeChild = function (child) {
				var index = children.indexOf(child);
				if (index !== - 1) {
					child.setParent(undefined);
					children.splice(index,1);
				}			
			};			
		}		
	}
);

TDAFW.AbstractNode = TDAFW.TreeNode.extend(
	{
		constructor: function(arg, options) {		
			//inherits TreeNode
			TDAFW.TreeNode.apply(this, arguments);
			
			var targetThreeObject = undefined;
			var attachedActionBlocks =[];
			
			this.getTargetThreeObject = function () {
				return targetThreeObject;
			};	
			
			this.setTargetThreeObject = function (newTarget) {
				targetThreeObject = newTarget;
			};			
			
			this.getAttachedActionBlocks = function () {
				return attachedActionBlocks;
			};
			
			this.attachActionBlock = function (actionBlock) {
				if (actionBlock instanceof TDAFW.ActionBlock) {
					actionBlock.setTarget(this);
					attachedActionBlocks.push(actionBlock);										
				} else {
					console.warn('TDAFW : argument must be an ActionBlock');
					return;
				}
			};
			
			this.detachActionBlock = function (actionBlock) {
				var index = attachedActionBlocks.indexOf(actionBlock);
				if (index !== - 1) {
					actionBlock.setTarget(undefined);
					attachedActionBlocks.splice(index,1);
				}
			};
		}	
	}
);

TDAFW.ActionBlock = TDAFW.TreeNode.extend(
	{
		constructor: function(arg, options) {		
			//inherits TreeNode
			TDAFW.TreeNode.apply(this, arguments);
			
			var fw = options.fw; //framework instance
			var internalEvents = options.internalEvents; //internal event object
			var target = undefined;
			
			this.getFW = function () {
				return fw;
			};
			
			this.getInternalEvents = function () {
				return internalEvents;
			};			
			
			// returns target abstract node or event node
			this.getTarget = function () {
				var parent = this.getParent();
				if (parent instanceof TDAFW.ActionBlock) {
					return parent.getTarget();
				} else {
					return target;
				}
			};
			
			this.getTargetThreeObject = function () {
				var targetAbstarctNode = this.getTarget();
				if (targetAbstarctNode instanceof TDAFW.AbstractNode) {
					return targetAbstarctNode.getTargetThreeObject();
				} else {
					return null;
				}
			};
			
			this.setTarget = function (newTarget) {
				target = newTarget;
			};
			
			this.getNearestAncestorByType = function (type) {
				var parent = this.getParent();
				if (parent instanceof TDAFW.ActionBlock) {
					if (parent.get("type") === type) {
						return parent;
					} else {
						return parent.getNearestAncestorActionBlockByType();
					}
				} else {			
					return undefined;
				}
			};
			
			/**
			* Init eventHandler
			* This event occurs after JSON loading.
			* If you created 
			*/
			
			/** animation loop event handlers
			 * return true to propagate to children, false to stop propagation 
			 */
			
			
			this.preUpdate = function (delta) {
				return true;
			};
			this.update = function (delta) {
				return true;
			};
			this.postUpdate = function (delta) {
				return true;
			};
			this.preRender = function (delta) {
				return true;
			};
			this.postRender = function (delta) {
				return true;
			};
			
			/**
				internal/ external event handlers
			*/
			this.internalEvent = function (eventObject) {
				return true;
			};
			this.externalEvent = function (eventObject) {
				return true;
			};
			this.fwEvent = function (eventObject) {
				return true;
			};
		}	
	}
);

TDAFW.EventNode = Backbone.Model.extend(
	{
		constructor: function(arg, options) {		
			Backbone.Model.apply(this, arguments);
			
			var attachedActionBlocks = [];
			var event = this.get("event");
			var eventManager = this.get("eventManager");
			var eventHandlerName = this.get("eventHandlerName");
			
			eventManager.on(event, function(param){
				for (var i = 0; i < attachedActionBlocks.length; i++)
				{
					attachedActionBlocks[i].traverseDFS(function (actionBlock) {
						/** TODO : modify this*/
						var handler = actionBlock[eventHandlerName];
						return handler(param);
					});
				}
			});
					
			this.getAttachedActionBlocks = function () {
				return attachedActionBlocks;
			};
			
			this.getEvent = function () {
				return event;
			};
			
			this.attachActionBlock = function (actionBlock) {
				if (actionBlock instanceof TDAFW.ActionBlock) {
					actionBlock.setTarget(this);
					attachedActionBlocks.push(actionBlock);										
				} else {
					console.warn('TDAFW : argument must be an ActionBlock');
					return;
				}
			};
			
			this.detachActionBlock = function (actionBlock) {
				var index = attachedActionBlocks.indexOf(actionBlock);
				if (index !== - 1) {
					actionBlock.setTarget(undefined);
					attachedActionBlocks.splice(index,1);
				}
			};
		}	
	}
);


/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

TDAFW.edgeTable = new Int32Array([
0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0]);

TDAFW.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);

/*
TDAFW.MarchingCubesGeometry = */

/** Code for generating marching cube node. 
	This code is originally from Lee Stemkoski's tutorial example( http://stemkoski.github.io/Three.js/Marching-Cubes.html ).
*/

TDAFW.MarchingCubesGeometry = function ( targetFunction, size, segments, isoLevel ) {
	THREE.Geometry.call( this );

	this.parameters = {
		size: size,
		segments: segments,
		targetFunction: targetFunction,
		isoLevel: isoLevel
	};

	
	size = size || 1;
	halfSize = size / 2;
	segments = segments || 20;
	isoLevel = isoLevel || 0;

	var x, y, vertices = [], uvs = [];
	
	var values = [];
	var points = [];
	
	for (var k = 0; k < segments; k++)
		for (var j = 0; j < segments; j++)
			for (var i = 0; i < segments; i++) {				
				var x = -halfSize + size * i / (segments - 1);
				var y = -halfSize + size * j / (segments - 1);
				var z = -halfSize + size * k / (segments - 1);
				points.push( new THREE.Vector3(x,y,z) );
				values.push( targetFunction (x, y, z) );
			}
	
	var segments2 = segments * segments;

	// Vertices may occur along edges of cube, when the values at the edge's endpoints
	//   straddle the isolevel value.
	// Actual position along edge weighted according to function values.
	var vlist = new Array(12);	
	var vertexIndex = 0;	
	
	for (var z = 0; z < segments - 1; z++)
		for (var y = 0; y < segments - 1; y++)
			for (var x = 0; x < segments - 1; x++)
			{
				// index of base point, and also adjacent points on cube
				var p    = x + segments * y + segments2 * z,
					px   = p   + 1,
					py   = p   + segments,
					pxy  = py  + 1,
					pz   = p   + segments2,
					pxz  = px  + segments2,
					pyz  = py  + segments2,
					pxyz = pxy + segments2;
				
				// store scalar values corresponding to vertices
				var value0 = values[ p    ],
					value1 = values[ px   ],
					value2 = values[ py   ],
					value3 = values[ pxy  ],
					value4 = values[ pz   ],
					value5 = values[ pxz  ],
					value6 = values[ pyz  ],
					value7 = values[ pxyz ];
				
				// place a "1" in bit positions corresponding to vertices whose
				//   isovalue is less than given constant.

				var cubeindex = 0;
				if ( value0 < isoLevel ) cubeindex |= 1;
				if ( value1 < isoLevel ) cubeindex |= 2;
				if ( value2 < isoLevel ) cubeindex |= 8;
				if ( value3 < isoLevel ) cubeindex |= 4;
				if ( value4 < isoLevel ) cubeindex |= 16;
				if ( value5 < isoLevel ) cubeindex |= 32;
				if ( value6 < isoLevel ) cubeindex |= 128;
				if ( value7 < isoLevel ) cubeindex |= 64;
				
				// bits = 12 bit number, indicates which edges are crossed by the isosurface
				var bits = TDAFW.edgeTable[ cubeindex ];
				
				// if none are crossed, proceed to next iteration
				if ( bits === 0 ) continue;
				
				// check which edges are crossed, and estimate the point location
				//    using a weighted average of scalar values at edge endpoints.
				// store the vertex in an array for use later.
				var mu = 0.5; 
				
				// bottom of the cube
				if ( bits & 1 )
				{		
					mu = ( isoLevel - value0 ) / ( value1 - value0 );
					vlist[0] = points[p].clone().lerp( points[px], mu );
				}
				if ( bits & 2 )
				{
					mu = ( isoLevel - value1 ) / ( value3 - value1 );
					vlist[1] = points[px].clone().lerp( points[pxy], mu );
				}
				if ( bits & 4 )
				{
					mu = ( isoLevel - value2 ) / ( value3 - value2 );
					vlist[2] = points[py].clone().lerp( points[pxy], mu );
				}
				if ( bits & 8 )
				{
					mu = ( isoLevel - value0 ) / ( value2 - value0 );
					vlist[3] = points[p].clone().lerp( points[py], mu );
				}
				// top of the cube
				if ( bits & 16 )
				{
					mu = ( isoLevel - value4 ) / ( value5 - value4 );
					vlist[4] = points[pz].clone().lerp( points[pxz], mu );
				}
				if ( bits & 32 )
				{
					mu = ( isoLevel - value5 ) / ( value7 - value5 );
					vlist[5] = points[pxz].clone().lerp( points[pxyz], mu );
				}
				if ( bits & 64 )
				{
					mu = ( isoLevel - value6 ) / ( value7 - value6 );
					vlist[6] = points[pyz].clone().lerp( points[pxyz], mu );
				}
				if ( bits & 128 )
				{
					mu = ( isoLevel - value4 ) / ( value6 - value4 );
					vlist[7] = points[pz].clone().lerp( points[pyz], mu );
				}
				// vertical lines of the cube
				if ( bits & 256 )
				{
					mu = ( isoLevel - value0 ) / ( value4 - value0 );
					vlist[8] = points[p].clone().lerp( points[pz], mu );
				}
				if ( bits & 512 )
				{
					mu = ( isoLevel - value1 ) / ( value5 - value1 );
					vlist[9] = points[px].clone().lerp( points[pxz], mu );
				}
				if ( bits & 1024 )
				{
					mu = ( isoLevel - value3 ) / ( value7 - value3 );
					vlist[10] = points[pxy].clone().lerp( points[pxyz], mu );
				}
				if ( bits & 2048 )
				{
					mu = ( isoLevel - value2 ) / ( value6 - value2 );
					vlist[11] = points[py].clone().lerp( points[pyz], mu );
				}
				
				// construct triangles -- get correct vertices from triTable.
				var i = 0;
				cubeindex <<= 4;  // multiply by 16... 
				// "Re-purpose cubeindex into an offset into triTable." 
				//  since each row really isn't a row.
				 
				// the while loop should run at most 5 times,
				//   since the 16th entry in each row is a -1.
				while ( TDAFW.triTable[ cubeindex + i ] != -1 ) 
				{
					var index1 = TDAFW.triTable[cubeindex + i];
					var index2 = TDAFW.triTable[cubeindex + i + 1];
					var index3 = TDAFW.triTable[cubeindex + i + 2];
					
					this.vertices.push( vlist[index1].clone() );
					this.vertices.push( vlist[index2].clone() );
					this.vertices.push( vlist[index3].clone() );
					var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
					this.faces.push( face );
					this.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

					vertexIndex += 3;
					i += 3;
				}
			}	
	
	this.computeFaceNormals();
	this.computeVertexNormals(); // We calculate vertex normal by averaging face normal instead of using gradient.
};

TDAFW.MarchingCubesGeometry.prototype = Object.create( THREE.Geometry.prototype );

TDAFW.ActionBlocks = {};
